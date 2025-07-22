class HealthConnectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Configuration invalide');
    }
    this.config = config;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  get hass() {
    return this._hass;
  }

  // Configuration par défaut des capteurs Health Connect avec leurs métadonnées
  getDefaultSensorConfig() {
    return {
      vitals: {
        title: '🫀 Signes vitaux',
        sensors: [
          {
            type: 'heart_rate',
            name: 'Fréquence cardiaque',
            icon: '💓',
            description: 'Dernière fréquence cardiaque enregistrée'
          },
          {
            type: 'resting_heart_rate',
            name: 'FC au repos',
            icon: '💤',
            description: 'Dernière fréquence cardiaque au repos'
          },
          {
            type: 'blood_glucose',
            name: 'Glycémie',
            icon: '🩸',
            description: 'Dernière mesure de glycémie'
          },
          {
            type: 'systolic_blood_pressure',
            name: 'Tension systolique',
            icon: '📈',
            description: 'Dernière tension artérielle systolique'
          },
          {
            type: 'diastolic_blood_pressure',
            name: 'Tension diastolique',
            icon: '📉',
            description: 'Dernière tension artérielle diastolique'
          },
          {
            type: 'oxygen_saturation',
            name: 'Saturation O₂',
            icon: '🫁',
            description: 'Dernière saturation en oxygène'
          },
          {
            type: 'respiratory_rate',
            name: 'Fréquence respiratoire',
            icon: '🌬️',
            description: 'Dernière fréquence respiratoire'
          },
          {
            type: 'heart_rate_variability',
            name: 'Variabilité FC',
            icon: '📊',
            description: 'Dernière variabilité de fréquence cardiaque'
          }
        ]
      },
      activity: {
        title: '🏃‍♂️ Activité',
        sensors: [
          {
            type: 'steps',
            name: 'Pas',
            icon: '👣',
            description: 'Nombre total de pas depuis minuit'
          },
          {
            type: 'distance',
            name: 'Distance',
            icon: '📍',
            description: 'Distance totale parcourue depuis minuit'
          },
          {
            type: 'active_calories_burned',
            name: 'Calories actives',
            icon: '🔥',
            description: 'Calories actives brûlées (hors métabolisme de base)'
          },
          {
            type: 'total_calories_burned',
            name: 'Calories totales',
            icon: '⚡',
            description: 'Calories totales brûlées depuis minuit'
          },
          {
            type: 'elevation_gained',
            name: 'Dénivelé',
            icon: '⛰️',
            description: 'Dénivelé total gagné depuis minuit'
          },
          {
            type: 'floors_climbed',
            name: 'Étages montés',
            icon: '🪜',
            description: 'Nombre d\'étages montés depuis minuit'
          }
        ]
      },
      body: {
        title: '⚖️ Mesures corporelles',
        sensors: [
          {
            type: 'weight',
            name: 'Poids',
            icon: '⚖️',
            description: 'Dernier poids enregistré'
          },
          {
            type: 'body_fat',
            name: 'Masse grasse',
            icon: '📊',
            description: 'Dernier pourcentage de masse grasse'
          },
          {
            type: 'vo2_max',
            name: 'VO₂ Max',
            icon: '💪',
            description: 'Dernier score VO₂ Max enregistré'
          }
        ]
      },
      sleep: {
        title: '😴 Sommeil',
        sensors: [
          {
            type: 'sleep_duration',
            name: 'Durée de sommeil',
            icon: '😴',
            description: 'Dernière durée de sommeil enregistrée'
          }
        ]
      }
    };
  }

  // Récupération de la configuration des capteurs avec entités personnalisées
  getSensorConfig() {
    const defaultConfig = this.getDefaultSensorConfig();
    const customEntities = this.config.entities || {};

    // Pour chaque catégorie, on applique les entités personnalisées
    Object.keys(defaultConfig).forEach(categoryKey => {
      defaultConfig[categoryKey].sensors = defaultConfig[categoryKey].sensors.map(sensor => {
        // Cherche une entité personnalisée pour ce type de capteur
        const customEntity = customEntities[sensor.type];
        return {
          ...sensor,
          entity: customEntity || `sensor.health_connect_${sensor.type}` // Fallback sur le nom par défaut
        };
      });
    });

    return defaultConfig;
  }

  // Formatage intelligent des valeurs
  formatValue(value, entity, sensorType) {
    if (value === null || value === undefined || value === 'unavailable' || value === 'unknown') {
      return '—';
    }

    const numValue = parseFloat(value);
    const unit = entity?.attributes?.unit_of_measurement || '';
    
    // Formatage spécifique selon le type de capteur
    if (sensorType === 'weight' && (unit === 'g' || unit === 'grams')) {
      return `${(numValue / 1000).toFixed(1)} kg`;
    }
    
    if (sensorType === 'distance' && (unit === 'm' || unit === 'meters')) {
      if (numValue >= 1000) {
        return `${(numValue / 1000).toFixed(2)} km`;
      }
      return `${numValue.toFixed(0)} m`;
    }

    if (sensorType === 'sleep_duration' && (unit === 'min' || unit === 'minutes')) {
      const hours = Math.floor(numValue / 60);
      const minutes = numValue % 60;
      return `${hours}h ${minutes.toFixed(0)}min`;
    }

    // Formatage numérique standard avec unité
    if (numValue >= 1000 && !unit.includes('%')) {
      return `${(numValue / 1000).toFixed(1)}k ${unit}`;
    }
    
    if (numValue % 1 === 0) {
      return `${numValue}${unit ? ' ' + unit : ''}`;
    } else {
      return `${numValue.toFixed(1)}${unit ? ' ' + unit : ''}`;
    }
  }

  // Déterminer la couleur selon la valeur
  getValueColor(value, sensorType) {
    if (value === null || value === undefined || value === 'unavailable' || value === 'unknown') {
      return '#6b7280'; // Gris
    }

    const numValue = parseFloat(value);
    
    // Couleurs selon les plages normales
    if (sensorType === 'heart_rate') {
      if (numValue < 60 || numValue > 100) return '#ef4444'; // Rouge
      if (numValue < 70 || numValue > 90) return '#f59e0b'; // Orange
      return '#10b981'; // Vert
    }

    if (sensorType === 'resting_heart_rate') {
      if (numValue < 50 || numValue > 90) return '#ef4444';
      if (numValue < 60 || numValue > 80) return '#f59e0b';
      return '#10b981';
    }

    if (sensorType === 'oxygen_saturation') {
      if (numValue < 95) return '#ef4444';
      if (numValue < 98) return '#f59e0b';
      return '#10b981';
    }

    // Couleur par défaut selon la valeur
    if (numValue > 0) return '#3b82f6'; // Bleu
    return '#6b7280'; // Gris
  }

  // Rendu d'une carte de capteur
  renderSensorCard(sensor) {
    const entity = this.hass?.states?.[sensor.entity];
    const value = entity?.state;
    const lastUpdated = entity?.last_updated;
    const formattedValue = this.formatValue(value, entity, sensor.type);
    const valueColor = this.getValueColor(value, sensor.type);

    const isAvailable = value !== 'unavailable' && value !== 'unknown' && value !== null;
    
    return `
      <div class="sensor-card ${!isAvailable ? 'unavailable' : ''}" 
           onclick="this.getRootNode().host.openEntityDetails('${sensor.entity}')">
        <div class="sensor-header">
          <span class="sensor-icon">${sensor.icon}</span>
          <span class="sensor-name">${sensor.name}</span>
        </div>
        <div class="sensor-value" style="color: ${valueColor}">
          ${formattedValue}
        </div>
        <div class="sensor-description">
          ${sensor.description}
        </div>
        ${lastUpdated ? `<div class="sensor-updated">
          Mis à jour: ${new Date(lastUpdated).toLocaleString('fr-FR')}
        </div>` : ''}
        ${!isAvailable ? `<div class="sensor-entity">
          Entité: ${sensor.entity}
        </div>` : ''}
      </div>
    `;
  }

  // Ouverture des détails d'une entité
  openEntityDetails(entityId) {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  // Rendu d'une catégorie
  renderCategory(categoryKey, category) {
    const availableSensors = category.sensors.filter(sensor => 
      this.hass?.states?.[sensor.entity] !== undefined
    );

    if (availableSensors.length === 0 && !this.config.show_empty_categories) {
      return '';
    }

    return `
      <div class="category">
        <h3 class="category-title">${category.title}</h3>
        <div class="sensors-grid">
          ${availableSensors.map(sensor => this.renderSensorCard(sensor)).join('')}
        </div>
        ${availableSensors.length === 0 ? '<div class="no-sensors">Aucun capteur disponible</div>' : ''}
      </div>
    `;
  }

  render() {
    if (!this.hass) return;

    const sensorConfig = this.getSensorConfig();
    const selectedCategories = this.config.categories || Object.keys(sensorConfig);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          background: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--divider-color, #e1e5e9);
        }

        .card-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--primary-text-color, #1f2937);
          margin: 0;
        }

        .card-subtitle {
          font-size: 14px;
          color: var(--secondary-text-color, #6b7280);
          margin: 4px 0 0 0;
        }

        .category {
          margin-bottom: 32px;
        }

        .category:last-child {
          margin-bottom: 0;
        }

        .category-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-text-color, #1f2937);
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sensors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .sensor-card {
          background: var(--primary-background-color, #f9fafb);
          border: 1px solid var(--divider-color, #e1e5e9);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .sensor-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border-color: var(--primary-color, #3b82f6);
        }

        .sensor-card.unavailable {
          opacity: 0.6;
          background: var(--disabled-background-color, #f3f4f6);
        }

        .sensor-card.unavailable:hover {
          transform: none;
          box-shadow: none;
        }

        .sensor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .sensor-icon {
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--primary-color, #3b82f6);
          color: white;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .sensor-name {
          font-weight: 600;
          font-size: 16px;
          color: var(--primary-text-color, #1f2937);
        }

        .sensor-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .sensor-description {
          font-size: 13px;
          color: var(--secondary-text-color, #6b7280);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .sensor-updated {
          font-size: 11px;
          color: var(--disabled-text-color, #9ca3af);
          font-style: italic;
        }

        .sensor-entity {
          font-size: 10px;
          color: var(--error-color, #ef4444);
          font-family: monospace;
          background: rgba(239, 68, 68, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
          margin-top: 4px;
        }

        .no-sensors {
          text-align: center;
          padding: 32px;
          color: var(--secondary-text-color, #6b7280);
          font-style: italic;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          color: var(--secondary-text-color, #6b7280);
        }

        @media (max-width: 768px) {
          :host {
            padding: 12px;
          }
          
          .sensors-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .sensor-card {
            padding: 12px;
          }
          
          .sensor-value {
            font-size: 24px;
          }
          
          .card-title {
            font-size: 20px;
          }
        }

        @media (prefers-color-scheme: dark) {
          .sensor-card {
            background: var(--card-background-color, #1f2937);
            border-color: var(--divider-color, #374151);
          }
          
          .sensor-icon {
            background: var(--primary-color, #60a5fa);
          }
        }
      </style>

      <div class="card-content">
        <div class="card-header">
          <div>
            <h2 class="card-title">🏥 Health Connect</h2>
            <p class="card-subtitle">Données de santé en temps réel</p>
          </div>
        </div>
        
        ${selectedCategories
          .map(categoryKey => {
            const category = sensorConfig[categoryKey];
            return category ? this.renderCategory(categoryKey, category) : '';
          })
          .join('')
        }
      </div>
    `;
  }

  getCardSize() {
    return 6; // Hauteur estimée de la carte
  }

  // Configuration de l'éditeur
  static getConfigElement() {
    return document.createElement('health-connect-card-editor');
  }

  static getStubConfig() {
    return {
      categories: ['vitals', 'activity', 'body', 'sleep'],
      show_empty_categories: false,
      entities: {
        // Exemple avec quelques entités personnalisées
        // heart_rate: 'sensor.my_heart_rate',
        // steps: 'sensor.my_steps_counter',
        // weight: 'sensor.my_scale_weight'
      }
    };
  }

  static get properties() {
    return {
      hass: Object,
      config: Object
    };
  }
}

// Enregistrement de la carte personnalisée
customElements.define('health-connect-card', HealthConnectCard);

// Configuration pour l'éditeur de cartes
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'health-connect-card',
  name: 'Health Connect Card',
  description: 'Affiche les capteurs Health Connect dans une interface organisée et moderne',
  preview: true,
  configurable: true,
  documentationURL: 'https://github.com/LightD31/lovelace-health-card'
});

// Chargement de l'éditeur
const loadEditor = () => {
  if (!customElements.get('health-connect-card-editor')) {
    const script = document.createElement('script');
    script.src = '/hacsfiles/lovelace-health-card/health-connect-card-editor-simple.js';
    script.onerror = () => {
      // Fallback pour développement local
      const fallbackScript = document.createElement('script');
      fallbackScript.src = './health-connect-card-editor-simple.js';
      fallbackScript.onerror = () => {
        console.warn('Éditeur Health Connect Card non trouvé');
      };
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
  }
};

// Chargement différé de l'éditeur
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadEditor);
} else {
  loadEditor();
}

// Information de la console
console.info(
  `%c HEALTH-CONNECT-CARD %c Version 1.0.0 `,
  'color: white; background: #3b82f6; font-weight: 700;',
  'color: #3b82f6; background: white; font-weight: 700;'
);
