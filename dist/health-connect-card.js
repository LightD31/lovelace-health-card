// Health Connect Card - A custom card for displaying Health Connect sensor data
// Compatible with HACS and includes visual editor support

import { 
  LitElement, 
  html, 
  css, 
  nothing 
} from "https://unpkg.com/lit@3.1.0/index.js?module";

// Helper function to get the health icon based on sensor type
function getHealthIcon(sensorType) {
  const iconMap = {
    'steps': 'mdi:walk',
    'heart_rate': 'mdi:heart-pulse',
    'sleep': 'mdi:sleep',
    'weight': 'mdi:scale',
    'blood_pressure': 'mdi:heart-box',
    'calories': 'mdi:fire',
    'distance': 'mdi:map-marker-distance',
    'body_fat': 'mdi:human',
    'glucose': 'mdi:water',
    'oxygen': 'mdi:lungs',
    'floors': 'mdi:stairs',
    'elevation': 'mdi:trending-up',
    'vo2_max': 'mdi:speedometer',
    'respiratory_rate': 'mdi:lungs',
    'temperature': 'mdi:thermometer'
  };
  
  // Try to match sensor entity_id to icon
  for (const [key, icon] of Object.entries(iconMap)) {
    if (sensorType.includes(key)) {
      return icon;
    }
  }
  
  return 'mdi:medical-bag'; // Default health icon
}

// Helper function to format health sensor values
function formatHealthValue(stateObj) {
  if (!stateObj) return 'Unknown';
  
  const value = stateObj.state;
  const unit = stateObj.attributes.unit_of_measurement || '';
  
  if (value === 'unavailable' || value === 'unknown') {
    return value;
  }
  
  // Format numbers
  if (!isNaN(value)) {
    const numValue = parseFloat(value);
    if (numValue === Math.floor(numValue)) {
      return `${numValue} ${unit}`.trim();
    } else {
      return `${numValue.toFixed(1)} ${unit}`.trim();
    }
  }
  
  return `${value} ${unit}`.trim();
}

// Main Health Connect Card Class
class HealthConnectCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      _config: {}
    };
  }

  static getConfigElement() {
    return document.createElement('health-connect-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:health-connect-card',
      title: 'Health Connect',
      entities: [],
      show_header: true,
      columns: 2
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = { ...HealthConnectCard.getStubConfig(), ...config };
  }

  get config() {
    return this._config;
  }

  shouldUpdate(changedProps) {
    return changedProps.has('hass') || changedProps.has('config');
  }

  render() {
    if (!this.config || !this.hass) {
      return html`<div class="error">Configuration or Home Assistant object missing</div>`;
    }

    const entities = this.config.entities || [];
    if (entities.length === 0) {
      return html`
        <ha-card>
          <div class="card-content">
            <div class="no-entities">
              <mdi-icon icon="mdi:medical-bag"></mdi-icon>
              <p>No Health Connect sensors configured</p>
              <p class="secondary">Add sensors in the card configuration</p>
            </div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        ${this.config.show_header !== false ? html`
          <div class="card-header">
            <div class="name">${this.config.title || 'Health Connect'}</div>
            ${this.config.icon ? html`<ha-icon icon="${this.config.icon}"></ha-icon>` : nothing}
          </div>
        ` : nothing}
        
        <div class="card-content">
          <div class="sensors-grid" style="--columns: ${this.config.columns || 2}">
            ${entities.map(entity => this.renderSensor(entity))}
          </div>
        </div>
      </ha-card>
    `;
  }

  renderSensor(entityConfig) {
    const entityId = typeof entityConfig === 'string' ? entityConfig : entityConfig.entity;
    const stateObj = this.hass.states[entityId];
    
    if (!stateObj) {
      return html`
        <div class="sensor-item error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <div class="sensor-info">
            <div class="sensor-name">Entity Not Found</div>
            <div class="sensor-value">${entityId}</div>
          </div>
        </div>
      `;
    }

    const config = typeof entityConfig === 'string' ? {} : entityConfig;
    const name = config.name || stateObj.attributes.friendly_name || entityId;
    const icon = config.icon || getHealthIcon(entityId);
    const value = formatHealthValue(stateObj);
    const lastUpdated = stateObj.last_updated ? new Date(stateObj.last_updated).toLocaleTimeString() : '';

    return html`
      <div class="sensor-item" @click=${() => this._showMoreInfo(entityId)}>
        <ha-icon icon="${icon}" class="sensor-icon"></ha-icon>
        <div class="sensor-info">
          <div class="sensor-name">${name}</div>
          <div class="sensor-value">${value}</div>
          ${this.config.show_last_updated ? html`
            <div class="sensor-updated">Updated: ${lastUpdated}</div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  _showMoreInfo(entityId) {
    const event = new Event('hass-more-info', {
      bubbles: true,
      composed: true,
    });
    event.detail = { entityId };
    this.dispatchEvent(event);
  }

  static get styles() {
    return css`
      :host {
        --columns: 2;
      }

      .error {
        color: var(--error-color);
        padding: 16px;
        text-align: center;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 0;
      }

      .card-header .name {
        font-size: var(--ha-card-header-font-size, 24px);
        color: var(--ha-card-header-color, --primary-text-color);
        font-weight: normal;
        margin: 0;
      }

      .card-content {
        padding: 16px;
      }

      .no-entities {
        text-align: center;
        padding: 32px 16px;
        color: var(--secondary-text-color);
      }

      .no-entities mdi-icon {
        --mdc-icon-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .no-entities p {
        margin: 8px 0;
      }

      .no-entities .secondary {
        font-size: 14px;
        opacity: 0.7;
      }

      .sensors-grid {
        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        gap: 16px;
        width: 100%;
      }

      .sensor-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .sensor-item:hover {
        background-color: var(--state-icon-active-color);
        background-color: var(--secondary-background-color);
      }

      .sensor-item.error {
        border-color: var(--error-color);
        color: var(--error-color);
        cursor: default;
      }

      .sensor-icon {
        --mdc-icon-size: 24px;
        margin-right: 12px;
        color: var(--state-icon-color);
        flex-shrink: 0;
      }

      .sensor-info {
        flex: 1;
        min-width: 0;
      }

      .sensor-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
      }

      .sensor-value {
        font-size: 16px;
        font-weight: bold;
        color: var(--state-icon-active-color, var(--primary-color));
      }

      .sensor-updated {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      /* Responsive design */
      @media (max-width: 600px) {
        .sensors-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 400px) {
        .card-content {
          padding: 12px;
        }
        
        .sensors-grid {
          gap: 12px;
        }
        
        .sensor-item {
          padding: 8px;
        }
      }
    `;
  }

  getCardSize() {
    const entities = this.config.entities || [];
    const columns = this.config.columns || 2;
    const rows = Math.ceil(entities.length / columns);
    return Math.max(1, rows + (this.config.show_header !== false ? 1 : 0));
  }
}

// Health Connect Card Editor Class
class HealthConnectCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      _config: {}
    };
  }

  setConfig(config) {
    this._config = { ...config };
  }

  get _title() {
    return this._config.title || '';
  }

  get _icon() {
    return this._config.icon || '';
  }

  get _entities() {
    return this._config.entities || [];
  }

  get _columns() {
    return this._config.columns || 2;
  }

  get _show_header() {
    return this._config.show_header !== false;
  }

  get _show_last_updated() {
    return this._config.show_last_updated || false;
  }

  render() {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }

    const schema = [
      {
        name: "title",
        default: "Health Connect",
        selector: {
          text: {}
        }
      },
      {
        name: "icon", 
        default: "",
        selector: {
          icon: {}
        }
      },
      {
        name: "entities",
        default: [],
        selector: {
          entity: {
            multiple: true,
            filter: {
              domain: "sensor",
              integration: "mobile_app"
            }
          }
        }
      },
      {
        name: "columns",
        default: 2,
        selector: {
          number: {
            min: 1,
            max: 4,
            step: 1
          }
        }
      },
      {
        name: "show_header",
        default: true,
        selector: {
          boolean: {}
        }
      },
      {
        name: "show_last_updated",
        default: false,
        selector: {
          boolean: {}
        }
      }
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  _computeLabel(schema) {
    const labels = {
      title: "Title",
      icon: "Icon",
      entities: "Health Connect Sensors", 
      columns: "Number of Columns",
      show_header: "Show Header",
      show_last_updated: "Show Last Updated Time"
    };
    return labels[schema.name] || schema.name;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }

    const config = { ...this._config, ...ev.detail.value };

    const event = new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

// Register the custom elements
customElements.define('health-connect-card', HealthConnectCard);
customElements.define('health-connect-card-editor', HealthConnectCardEditor);

// Add to window for HACS
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'health-connect-card',
  name: 'Health Connect Card',
  description: 'A card for displaying Health Connect sensor data with visual editor support',
  preview: true,
  documentationURL: 'https://github.com/username/health-connect-card'
});

console.info(
  `%c HEALTH-CONNECT-CARD %c v1.0.0 `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);