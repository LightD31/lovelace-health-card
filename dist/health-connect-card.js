import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit@3.0.0/index.js?module";

const CARD_VERSION = "1.0.0";

class HealthConnectCard extends LitElement {
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

      .category {
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .category:last-child {
        border-bottom: none;
      }

      .category-header {
        background: var(--secondary-background-color, #f5f5f5);
        padding: 12px 16px;
        font-weight: 500;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .sensors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1px;
        background: var(--divider-color, #e0e0e0);
      }

      .sensor-card {
        background: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .sensor-card:hover {
        background: var(--secondary-background-color, #f5f5f5);
        transform: translateY(-1px);
      }

      .sensor-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }

      .sensor-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-color);
        color: white;
        font-size: 18px;
      }

      .sensor-icon.vitals {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      }

      .sensor-icon.activity {
        background: linear-gradient(135deg, #4ecdc4, #44bd87);
      }

      .sensor-icon.body_measurements {
        background: linear-gradient(135deg, #45b7d1, #96ceb4);
      }

      .sensor-icon.sleep {
        background: linear-gradient(135deg, #9c88ff, #8c7ae6);
      }

      .sensor-details {
        flex: 1;
      }

      .sensor-name {
        font-weight: 500;
        color: var(--primary-text-color);
        font-size: 14px;
        margin-bottom: 4px;
      }

      .sensor-entity {
        font-size: 11px;
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      .sensor-value {
        text-align: right;
        font-weight: 600;
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
        font-size: 18px;
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
          padding: 12px;
        }
      }
    `;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const sensorCategories = this._getSensorCategories();
    const availableSensors = this._getAvailableSensors(sensorCategories);

    if (availableSensors.length === 0) {
      return html`
        <ha-card>
          <div class="card-header">
            <ha-icon icon="mdi:heart-pulse"></ha-icon>
            Health Connect Sensors
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
          ${this.config.title || "Health Connect Sensors"}
        </div>
        <div class="card-content">
          ${Object.entries(sensorCategories).map(([categoryKey, category]) => {
            let categorySensors = category.sensors.filter(sensor => 
              this.hass.states[sensor.entity]
            );

            // If sensors are specified in config, only show configured sensors
            if (this.config.sensors && this.config.sensors.length > 0) {
              categorySensors = categorySensors.filter(sensor => 
                this.config.sensors.includes(sensor.entity)
              );
            }

            if (categorySensors.length === 0) return '';

            return html`
              <div class="category">
                <div class="category-header">
                  <ha-icon icon="${this._getCategoryIcon(categoryKey)}"></ha-icon>
                  ${category.title}
                </div>
                <div class="sensors-grid">
                  ${categorySensors.map(sensor => this._renderSensor(sensor, categoryKey))}
                </div>
              </div>
            `;
          })}
          <div class="last-updated">
            Last updated: ${this._getLastUpdated()}
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderSensor(sensor, categoryKey) {
    const stateObj = this.hass.states[sensor.entity];
    if (!stateObj) return '';

    const value = this._formatSensorValue(stateObj, sensor.unit);
    const isUnavailable = stateObj.state === 'unavailable';
    const isUnknown = stateObj.state === 'unknown';

    return html`
      <div class="sensor-card" @click=${() => this._showMoreInfo(sensor.entity)}>
        <div class="sensor-info">
          <div class="sensor-icon ${categoryKey}">
            <ha-icon icon="${sensor.icon}"></ha-icon>
          </div>
          <div class="sensor-details">
            <div class="sensor-name">${sensor.name}</div>
            <div class="sensor-entity">${sensor.entity}</div>
          </div>
        </div>
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

    // Convert grams to kg for weight
    if (unit === 'g' && numericValue > 1000) {
      formattedValue = (numericValue / 1000).toFixed(1);
      displayUnit = 'kg';
    }
    // Convert meters to km for distance if > 1000m
    else if (unit === 'm' && numericValue > 1000) {
      formattedValue = (numericValue / 1000).toFixed(2);
      displayUnit = 'km';
    }
    // Convert minutes to hours for sleep if > 60 min
    else if (unit === 'min' && numericValue > 60) {
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
      formattedValue = numericValue.toFixed(1);
    }

    return html`
      <span class="value-number">${formattedValue}</span>
      <span class="value-unit">${displayUnit}</span>
    `;
  }

  _getSensorCategories() {
    return {
      vitals: {
        title: "Vitals",
        sensors: [
          {entity: "sensor.health_connect_heart_rate", name: "Heart Rate", unit: "bpm", icon: "mdi:heart-pulse"},
          {entity: "sensor.health_connect_resting_heart_rate", name: "Resting Heart Rate", unit: "bpm", icon: "mdi:heart"},
          {entity: "sensor.health_connect_heart_rate_variability", name: "Heart Rate Variability", unit: "ms", icon: "mdi:heart-box"},
          {entity: "sensor.health_connect_blood_glucose", name: "Blood Glucose", unit: "mg/dL", icon: "mdi:blood-bag"},
          {entity: "sensor.health_connect_systolic_blood_pressure", name: "Systolic Blood Pressure", unit: "mmHg", icon: "mdi:arrow-up-bold"},
          {entity: "sensor.health_connect_diastolic_blood_pressure", name: "Diastolic Blood Pressure", unit: "mmHg", icon: "mdi:arrow-down-bold"},
          {entity: "sensor.health_connect_oxygen_saturation", name: "Oxygen Saturation", unit: "%", icon: "mdi:lungs"},
          {entity: "sensor.health_connect_respiratory_rate", name: "Respiratory Rate", unit: "breaths/min", icon: "mdi:weather-windy"}
        ]
      },
      activity: {
        title: "Activity",
        sensors: [
          {entity: "sensor.health_connect_steps", name: "Steps", unit: "steps", icon: "mdi:walk"},
          {entity: "sensor.health_connect_distance", name: "Distance", unit: "m", icon: "mdi:map-marker-distance"},
          {entity: "sensor.health_connect_elevation_gained", name: "Elevation Gained", unit: "m", icon: "mdi:elevation-rise"},
          {entity: "sensor.health_connect_floors_climbed", name: "Floors Climbed", unit: "floors", icon: "mdi:stairs-up"},
          {entity: "sensor.health_connect_active_calories_burned", name: "Active Calories", unit: "kcal", icon: "mdi:fire"},
          {entity: "sensor.health_connect_total_calories_burned", name: "Total Calories", unit: "kcal", icon: "mdi:fire-circle"}
        ]
      },
      body_measurements: {
        title: "Body Measurements",
        sensors: [
          {entity: "sensor.health_connect_weight", name: "Weight", unit: "g", icon: "mdi:weight"},
          {entity: "sensor.health_connect_body_fat", name: "Body Fat", unit: "%", icon: "mdi:human-male"},
          {entity: "sensor.health_connect_vo2_max", name: "VO2 Max", unit: "ml/min/kg", icon: "mdi:speedometer"}
        ]
      },
      sleep: {
        title: "Sleep",
        sensors: [
          {entity: "sensor.health_connect_sleep_duration", name: "Sleep Duration", unit: "min", icon: "mdi:sleep"}
        ]
      }
    };
  }

  _getAvailableSensors(categories) {
    let sensors = [];
    Object.values(categories).forEach(category => {
      category.sensors.forEach(sensor => {
        // Check if sensor exists in Home Assistant
        if (this.hass.states[sensor.entity]) {
          // If sensors are specified in config, only show those
          if (this.config.sensors && this.config.sensors.length > 0) {
            if (this.config.sensors.includes(sensor.entity)) {
              sensors.push(sensor);
            }
          } else {
            // If no sensors specified, show all available sensors
            sensors.push(sensor);
          }
        }
      });
    });
    return sensors;
  }

  _getCategoryIcon(categoryKey) {
    const icons = {
      vitals: "mdi:heart-pulse",
      activity: "mdi:run",
      body_measurements: "mdi:scale-bathroom",
      sleep: "mdi:sleep"
    };
    return icons[categoryKey] || "mdi:information-outline";
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
    const availableCategories = Object.entries(this._getSensorCategories()).filter(([_, category]) => 
      category.sensors.some(sensor => this.hass && this.hass.states[sensor.entity])
    );
    return Math.max(2, availableCategories.length + 1);
  }

  static getStubConfig() {
    return {
      type: "custom:health-connect-card",
      title: "Health Connect Sensors",
      sensors: [
        "sensor.health_connect_steps",
        "sensor.health_connect_heart_rate",
        "sensor.health_connect_weight",
        "sensor.health_connect_sleep_duration"
      ]
    };
  }
}

customElements.define("health-connect-card", HealthConnectCard);

// Register the card in the UI
window.customCards = window.customCards || [];
window.customCards.push({
  type: "health-connect-card",
  name: "Health Connect Card",
  description: "A card to display Health Connect sensor information",
  preview: true
});

console.info(
  `%c HEALTH-CONNECT-CARD %c v${CARD_VERSION} `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);