import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit@3.0.0/index.js?module";

class HealthConnectCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  setConfig(config) {
    this.config = config;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .config-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .config-row label {
        font-weight: 500;
        min-width: 120px;
      }

      .config-row input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        font-size: 14px;
      }

      .config-description {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 8px;
        line-height: 1.4;
      }

      .preview-info {
        background: var(--secondary-background-color);
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
      }

      .preview-info h3 {
        margin: 0 0 8px 0;
        color: var(--primary-text-color);
      }

      .sensor-count {
        color: var(--primary-color);
        font-weight: 500;
      }
    `;
  }

  render() {
    if (!this.config) {
      return html``;
    }

    const availableSensors = this._getAvailableSensorCount();

    return html`
      <div class="card-config">
        <div class="config-row">
          <label for="title">Title:</label>
          <input
            id="title"
            type="text"
            .value=${this.config.title || "Health Connect Sensors"}
            @change=${this._valueChanged}
          />
        </div>
        <div class="config-description">
          Customize the title displayed at the top of the card.
        </div>

        <div class="preview-info">
          <h3>Available Health Connect Sensors</h3>
          <p>
            Found <span class="sensor-count">${availableSensors}</span> Health Connect sensors.
            ${availableSensors === 0 
              ? 'Enable Health Connect sensors in the Home Assistant companion app to see data.'
              : 'All available sensors will be automatically displayed.'
            }
          </p>
          <p>
            <strong>Supported categories:</strong> Vitals, Activity, Body Measurements, Sleep
          </p>
        </div>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this.config || !this.hass) {
      return;
    }

    const target = ev.target;
    const configValue = target.value;

    if (this.config[target.id] === configValue) {
      return;
    }

    const newConfig = {
      ...this.config,
      [target.id]: configValue
    };

    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _getAvailableSensorCount() {
    if (!this.hass) return 0;

    const sensorPrefixes = [
      "sensor.health_connect_heart_rate",
      "sensor.health_connect_resting_heart_rate", 
      "sensor.health_connect_heart_rate_variability",
      "sensor.health_connect_blood_glucose",
      "sensor.health_connect_systolic_blood_pressure",
      "sensor.health_connect_diastolic_blood_pressure",
      "sensor.health_connect_oxygen_saturation",
      "sensor.health_connect_respiratory_rate",
      "sensor.health_connect_steps",
      "sensor.health_connect_distance",
      "sensor.health_connect_elevation_gained",
      "sensor.health_connect_floors_climbed",
      "sensor.health_connect_active_calories_burned",
      "sensor.health_connect_total_calories_burned",
      "sensor.health_connect_weight",
      "sensor.health_connect_body_fat",
      "sensor.health_connect_vo2_max",
      "sensor.health_connect_sleep_duration"
    ];

    return sensorPrefixes.filter(entity => this.hass.states[entity]).length;
  }
}

customElements.define("health-connect-card-editor", HealthConnectCardEditor);