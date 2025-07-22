import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit@3.0.0/index.js?module";

const CARD_VERSION = "1.0.0";

class HealthConnectSimpleCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this.config = config;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--ha-card-font-family, inherit);
      }

      .card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
        font-weight: 500;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .card-content {
        padding: 0;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: 0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px);
      }

      .sensors-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1px;
        background: var(--divider-color, #e0e0e0);
      }

      .sensor-card {
        background: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
        min-height: 120px;
      }

      .sensor-card:hover {
        background: var(--secondary-background-color, #f5f5f5);
        transform: translateY(-2px);
      }

      .sensor-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        margin-bottom: 12px;
      }

      .sensor-icon.heart-rate {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      }

      .sensor-icon.steps {
        background: linear-gradient(135deg, #4ecdc4, #44bd87);
      }

      .sensor-icon.floors {
        background: linear-gradient(135deg, #45b7d1, #96ceb4);
      }

      .sensor-icon.sleep {
        background: linear-gradient(135deg, #9c88ff, #8c7ae6);
      }

      .sensor-name {
        font-weight: 600;
        color: var(--primary-text-color);
        font-size: 14px;
        margin-bottom: 8px;
        text-align: center;
      }

      .sensor-value {
        text-align: center;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .sensor-value.unavailable {
        color: var(--error-color);
        font-style: italic;
      }

      .sensor-value.unknown {
        color: var(--warning-color);
        font-style: italic;
      }

      .value-number {
        font-size: 24px;
        line-height: 1;
      }

      .value-unit {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-left: 2px;
      }

      .last-updated {
        text-align: center;
        padding: 12px 16px;
        font-size: 12px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px);
      }

      .no-sensors {
        padding: 32px;
        text-align: center;
        color: var(--secondary-text-color);
      }

      .no-sensors ha-icon {
        font-size: 48px;
        color: var(--disabled-text-color);
        margin-bottom: 16px;
      }

      @media (max-width: 768px) {
        .sensors-grid {
          grid-template-columns: 1fr;
        }

        .card-header {
          font-size: 16px;
          padding: 12px;
        }

        .sensor-card {
          padding: 16px;
          min-height: 100px;
        }

        .sensor-icon {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }

        .value-number {
          font-size: 20px;
        }
      }
    `;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const sensors = this._getCoreSensors();
    const availableSensors = sensors.filter(sensor => this.hass.states[sensor.entity]);

    if (availableSensors.length === 0) {
      return html`
        <ha-card>
          <div class="card-header">
            <ha-icon icon="mdi:heart-pulse"></ha-icon>
            Essential Health Metrics
          </div>
          <div class="no-sensors">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <div>No Health Connect sensors found</div>
            <div style="margin-top: 8px; font-size: 11px;">
              Enable Health Connect sensors in the Home Assistant companion app
            </div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:heart-pulse"></ha-icon>
          ${this.config.title || "Essential Health Metrics"}
        </div>
        <div class="card-content">
          <div class="sensors-grid">
            ${availableSensors.map(sensor => this._renderSensor(sensor))}
          </div>
          <div class="last-updated">
            Last updated: ${this._getLastUpdated()}
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderSensor(sensor) {
    const stateObj = this.hass.states[sensor.entity];
    if (!stateObj) return '';

    const value = this._formatSensorValue(stateObj, sensor.unit);
    const isUnavailable = stateObj.state === 'unavailable';
    const isUnknown = stateObj.state === 'unknown';

    return html`
      <div class="sensor-card" @click=${() => this._showMoreInfo(sensor.entity)}>
        <div class="sensor-icon ${sensor.class}">
          <ha-icon icon="${sensor.icon}"></ha-icon>
        </div>
        <div class="sensor-name">${sensor.name}</div>
        <div class="sensor-value ${isUnavailable ? 'unavailable' : ''} ${isUnknown ? 'unknown' : ''}">
          ${value}
        </div>
      </div>
    `;
  }

  _formatSensorValue(stateObj, unit) {
    if (stateObj.state === 'unavailable') {
      return html`<span>Unavailable</span>`;
    }

    if (stateObj.state === 'unknown') {
      return html`<span>Unknown</span>`;
    }

    const numericValue = parseFloat(stateObj.state);
    if (isNaN(numericValue)) {
      return html`<span>${stateObj.state}</span>`;
    }

    // Format the value based on unit
    let formattedValue = numericValue;
    let displayUnit = unit;

    // Convert minutes to hours for sleep if > 60 min
    if (unit === 'min' && numericValue > 60) {
      const hours = Math.floor(numericValue / 60);
      const minutes = Math.round(numericValue % 60);
      return html`
        <span class="value-number">${hours}h ${minutes}m</span>
      `;
    }
    else if (numericValue >= 1000) {
      formattedValue = numericValue.toLocaleString();
    } else if (numericValue < 1) {
      formattedValue = numericValue.toFixed(2);
    } else {
      formattedValue = numericValue.toFixed(0);
    }

    return html`
      <span class="value-number">${formattedValue}</span>
      <span class="value-unit">${displayUnit}</span>
    `;
  }

  _getCoreSensors() {
    return [
      {entity: "sensor.health_connect_heart_rate", name: "Heart Rate", unit: "bpm", icon: "mdi:heart-pulse", class: "heart-rate"},
      {entity: "sensor.health_connect_steps", name: "Steps", unit: "steps", icon: "mdi:walk", class: "steps"},
      {entity: "sensor.health_connect_floors_climbed", name: "Floors Climbed", unit: "floors", icon: "mdi:stairs-up", class: "floors"},
      {entity: "sensor.health_connect_sleep_duration", name: "Sleep Duration", unit: "min", icon: "mdi:sleep", class: "sleep"}
    ];
  }

  _getLastUpdated() {
    const now = new Date();
    return now.toLocaleString();
  }

  _showMoreInfo(entityId) {
    const event = new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  getCardSize() {
    return 3;
  }

  static getStubConfig() {
    return {
      type: "custom:health-connect-simple-card",
      title: "Essential Health Metrics"
    };
  }
}

customElements.define("health-connect-simple-card", HealthConnectSimpleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "health-connect-simple-card",
  name: "Health Connect Simple Card",
  description: "A simplified card showing essential health metrics: heart rate, steps, floors climbed, and sleep",
  preview: true
});

console.info(
  `%c HEALTH-CONNECT-SIMPLE-CARD %c v${CARD_VERSION} `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);