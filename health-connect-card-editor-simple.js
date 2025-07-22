class HealthConnectCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    this.config = { ...config };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  get hass() {
    return this._hass;
  }

  configChanged(newConfig) {
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .card-config {
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }
        
        .config-section {
          background: var(--primary-background-color, #fff);
          border: 1px solid var(--divider-color, #e1e5e9);
          border-radius: 8px;
          padding: 16px;
        }
        
        .config-section h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color, #1f2937);
        }
        
        .config-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .config-row:last-child {
          margin-bottom: 0;
        }
        
        .config-label {
          font-size: 14px;
          color: var(--primary-text-color, #1f2937);
          flex: 1;
        }
        
        .config-description {
          font-size: 12px;
          color: var(--secondary-text-color, #6b7280);
          margin-top: 4px;
        }
        
        input[type="text"] {
          width: 250px;
          padding: 8px 12px;
          border: 1px solid var(--divider-color, #e1e5e9);
          border-radius: 4px;
          font-size: 14px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color, #1f2937);
        }
        
        input[type="text"]:focus {
          outline: none;
          border-color: var(--primary-color, #3b82f6);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-left: 16px;
          accent-color: var(--primary-color, #3b82f6);
        }
        
        .category-config {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }
        
        .category-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .category-item label {
          font-size: 14px;
          color: var(--primary-text-color, #1f2937);
          cursor: pointer;
        }

        .yaml-example {
          background: var(--secondary-background-color, #f8f9fa);
          border: 1px solid var(--divider-color, #e1e5e9);
          border-radius: 6px;
          padding: 12px;
          margin-top: 12px;
        }
        
        .yaml-example pre {
          margin: 0;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: var(--primary-text-color, #1f2937);
          white-space: pre-wrap;
        }

        .info-box {
          font-size: 13px;
          color: var(--secondary-text-color, #6b7280);
          line-height: 1.5;
          background: var(--secondary-background-color, #f8f9fa);
          padding: 12px;
          border-radius: 6px;
        }
        
        .info-box ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        .info-box code {
          background: var(--divider-color, #e1e5e9);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 12px;
        }
      </style>
      
      <div class="card-config">
        <div class="config-section">
          <h3>🎨 Configuration de base</h3>
          
          <div class="config-row">
            <div>
              <div class="config-label">Titre personnalisé</div>
              <div class="config-description">Laissez vide pour utiliser le titre par défaut</div>
            </div>
            <input
              type="text"
              id="title-input"
              placeholder="Health Connect"
            />
          </div>
          
          <div class="config-row">
            <div>
              <div class="config-label">Afficher les catégories vides</div>
              <div class="config-description">Affiche les catégories même si aucun capteur n'est disponible</div>
            </div>
            <input
              type="checkbox"
              id="show-empty-input"
            />
          </div>
        </div>
        
        <div class="config-section">
          <h3>📊 Catégories à afficher</h3>
          <div class="config-description">Sélectionnez les catégories de capteurs à afficher dans la carte</div>
          
          <div class="category-config">
            <div class="category-item">
              <input type="checkbox" id="cat-vitals" />
              <label for="cat-vitals">🫀 Signes vitaux</label>
            </div>
            
            <div class="category-item">
              <input type="checkbox" id="cat-activity" />
              <label for="cat-activity">🏃‍♂️ Activité</label>
            </div>
            
            <div class="category-item">
              <input type="checkbox" id="cat-body" />
              <label for="cat-body">⚖️ Mesures corporelles</label>
            </div>
            
            <div class="category-item">
              <input type="checkbox" id="cat-sleep" />
              <label for="cat-sleep">😴 Sommeil</label>
            </div>
          </div>
        </div>
        
        <div class="config-section">
          <h3>🔧 Configuration des entités personnalisées</h3>
          <div class="config-description">
            Pour utiliser des entités personnalisées, vous pouvez configurer la carte en YAML avec la section "entities" :
          </div>
          
          <div class="yaml-example">
            <pre>type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals
  - activity
entities:
  heart_rate: sensor.mon_capteur_coeur
  steps: sensor.mes_pas
  weight: sensor.ma_balance
  sleep_duration: sensor.duree_sommeil</pre>
          </div>
        </div>
        
        <div class="config-section">
          <h3>ℹ️ Informations</h3>
          <div class="info-box">
            <p><strong>Types d'entités supportés :</strong></p>
            <ul>
              <li><strong>Signes vitaux :</strong> heart_rate, resting_heart_rate, blood_glucose, systolic_blood_pressure, diastolic_blood_pressure, oxygen_saturation, respiratory_rate, heart_rate_variability</li>
              <li><strong>Activité :</strong> steps, distance, active_calories_burned, total_calories_burned, elevation_gained, floors_climbed</li>
              <li><strong>Mesures corporelles :</strong> weight, body_fat, vo2_max</li>
              <li><strong>Sommeil :</strong> sleep_duration</li>
            </ul>
            <p><strong>Exemple d'entité :</strong> <code>sensor.mon_capteur_poids</code></p>
            <p>Les capteurs non disponibles seront automatiquement masqués.</p>
          </div>
        </div>
      </div>
    `;

    // Configuration des gestionnaires d'événements
    setTimeout(() => {
      this.setupEventListeners();
      this.updateValues();
    }, 0);
  }

  setupEventListeners() {
    // Titre
    const titleInput = this.shadowRoot.getElementById('title-input');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        const newConfig = { ...this.config, title: e.target.value };
        this.configChanged(newConfig);
      });
    }

    // Affichage des catégories vides
    const showEmptyInput = this.shadowRoot.getElementById('show-empty-input');
    if (showEmptyInput) {
      showEmptyInput.addEventListener('change', (e) => {
        const newConfig = { ...this.config, show_empty_categories: e.target.checked };
        this.configChanged(newConfig);
      });
    }

    // Catégories
    ['vitals', 'activity', 'body', 'sleep'].forEach(category => {
      const checkbox = this.shadowRoot.getElementById(`cat-${category}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          let categories = this.config.categories || ['vitals', 'activity', 'body', 'sleep'];
          
          if (e.target.checked) {
            if (!categories.includes(category)) {
              categories.push(category);
            }
          } else {
            categories = categories.filter(cat => cat !== category);
          }
          
          const newConfig = { ...this.config, categories };
          this.configChanged(newConfig);
        });
      }
    });
  }

  updateValues() {
    // Mise à jour du titre
    const titleInput = this.shadowRoot.getElementById('title-input');
    if (titleInput) {
      titleInput.value = this.config.title || '';
    }

    // Mise à jour de l'affichage des catégories vides
    const showEmptyInput = this.shadowRoot.getElementById('show-empty-input');
    if (showEmptyInput) {
      showEmptyInput.checked = this.config.show_empty_categories || false;
    }

    // Mise à jour des catégories
    ['vitals', 'activity', 'body', 'sleep'].forEach(category => {
      const checkbox = this.shadowRoot.getElementById(`cat-${category}`);
      if (checkbox) {
        const categories = this.config.categories || ['vitals', 'activity', 'body', 'sleep'];
        checkbox.checked = categories.includes(category);
      }
    });
  }
}

customElements.define('health-connect-card-editor', HealthConnectCardEditor);

// Ajout de l'éditeur à la carte existante
if (window.customCards) {
  const cardConfig = window.customCards.find(card => card.type === 'health-connect-card');
  if (cardConfig) {
    cardConfig.configurable = true;
  }
}
