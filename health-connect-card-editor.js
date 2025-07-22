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
          width: 200px;
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
        
        .entities-config {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
        }
        
        .entity-label {
          font-size: 13px;
          color: var(--primary-text-color, #1f2937);
          font-weight: 500;
        }
        
        .entity-input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid var(--divider-color, #e1e5e9);
          border-radius: 4px;
          font-size: 13px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color, #1f2937);
          font-family: monospace;
        }
        
        .entity-input:focus {
          outline: none;
          border-color: var(--primary-color, #3b82f6);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .collapsible {
          margin-top: 12px;
        }
        
        .collapsible-header {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .collapsible-header:hover {
          background: var(--divider-color, #e1e5e9);
        }
        
        .collapsible-content {
          display: none;
          padding: 12px 0;
        }
        
        .collapsible.expanded .collapsible-content {
          display: block;
        }
        
        .expand-icon {
          transition: transform 0.2s;
          font-size: 12px;
        }
        
        .collapsible.expanded .expand-icon {
          transform: rotate(90deg);
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
          <h3>🎨 Apparence</h3>
          
          <div class="config-row">
            <div>
              <div class="config-label">Titre personnalisé</div>
              <div class="config-description">Laissez vide pour utiliser le titre par défaut</div>
            </div>
            <input
              type="text"
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
            />
          </div>
        </div>
        
        <div class="config-section">
          <h3>📊 Catégories à afficher</h3>
          <div class="config-description">Sélectionnez les catégories de capteurs à afficher dans la carte</div>
          
          <div class="category-config">
            <div class="category-item">
              <input
                type="checkbox"
                id="cat-vitals"
              />
              <label for="cat-vitals">🫀 Signes vitaux</label>
            </div>
            
            <div class="category-item">
              <input
                type="checkbox"
                id="cat-activity"
              />
              <label for="cat-activity">🏃‍♂️ Activité</label>
            </div>
            
            <div class="category-item">
              <input
                type="checkbox"
                id="cat-body"
              />
              <label for="cat-body">⚖️ Mesures corporelles</label>
            </div>
            
            <div class="category-item">
              <input
                type="checkbox"
                id="cat-sleep"
              />
              <label for="cat-sleep">😴 Sommeil</label>
            </div>
          </div>
        </div>
        
        <div class="config-section">
          <h3>🔧 Configuration des entités</h3>
          <div class="config-description">Personnalisez les noms des entités pour chaque type de capteur</div>
          
          <div class="collapsible" id="vitals-entities">
            <div class="collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
              <span class="expand-icon">▶</span>
              <strong>🫀 Signes vitaux</strong>
            </div>
            <div class="collapsible-content">
              <div class="entities-config">
                <div class="entity-label">💓 Fréquence cardiaque:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_heart_rate"
                />
                
                <div class="entity-label">💤 FC au repos:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_resting_heart_rate"
                />
                
                <div class="entity-label">🩸 Glycémie:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_blood_glucose"
                />
                
                <div class="entity-label">📈 Tension systolique:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_systolic_blood_pressure"
                />
                
                <div class="entity-label">📉 Tension diastolique:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_diastolic_blood_pressure"
                />
                
                <div class="entity-label">🫁 Saturation O₂:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_oxygen_saturation"
                />
                
                <div class="entity-label">🌬️ Fréquence respiratoire:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_respiratory_rate"
                />
                
                <div class="entity-label">📊 Variabilité FC:</div>
                <input
                  type="text"
                  class="entity-input"
                  placeholder="sensor.health_connect_heart_rate_variability"
                />
              </div>
            </div>
          </div>
          
          <div class="collapsible" id="activity-entities">
            <div class="collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
              <span class="expand-icon">▶</span>
              <strong>🏃‍♂️ Activité</strong>
            </div>
            <div class="collapsible-content">
              <div class="entities-config">
                <div class="entity-label">👣 Pas:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('steps')}"
                  placeholder="sensor.health_connect_steps"
                  @input="${(e) => this.entityChanged('steps', e.target.value)}"
                />
                
                <div class="entity-label">📍 Distance:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('distance')}"
                  placeholder="sensor.health_connect_distance"
                  @input="${(e) => this.entityChanged('distance', e.target.value)}"
                />
                
                <div class="entity-label">🔥 Calories actives:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('active_calories_burned')}"
                  placeholder="sensor.health_connect_active_calories_burned"
                  @input="${(e) => this.entityChanged('active_calories_burned', e.target.value)}"
                />
                
                <div class="entity-label">⚡ Calories totales:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('total_calories_burned')}"
                  placeholder="sensor.health_connect_total_calories_burned"
                  @input="${(e) => this.entityChanged('total_calories_burned', e.target.value)}"
                />
                
                <div class="entity-label">⛰️ Dénivelé:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('elevation_gained')}"
                  placeholder="sensor.health_connect_elevation_gained"
                  @input="${(e) => this.entityChanged('elevation_gained', e.target.value)}"
                />
                
                <div class="entity-label">🪜 Étages montés:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('floors_climbed')}"
                  placeholder="sensor.health_connect_floors_climbed"
                  @input="${(e) => this.entityChanged('floors_climbed', e.target.value)}"
                />
              </div>
            </div>
          </div>
          
          <div class="collapsible" id="body-entities">
            <div class="collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
              <span class="expand-icon">▶</span>
              <strong>⚖️ Mesures corporelles</strong>
            </div>
            <div class="collapsible-content">
              <div class="entities-config">
                <div class="entity-label">⚖️ Poids:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('weight')}"
                  placeholder="sensor.health_connect_weight"
                  @input="${(e) => this.entityChanged('weight', e.target.value)}"
                />
                
                <div class="entity-label">📊 Masse grasse:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('body_fat')}"
                  placeholder="sensor.health_connect_body_fat"
                  @input="${(e) => this.entityChanged('body_fat', e.target.value)}"
                />
                
                <div class="entity-label">💪 VO₂ Max:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('vo2_max')}"
                  placeholder="sensor.health_connect_vo2_max"
                  @input="${(e) => this.entityChanged('vo2_max', e.target.value)}"
                />
              </div>
            </div>
          </div>
          
          <div class="collapsible" id="sleep-entities">
            <div class="collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
              <span class="expand-icon">▶</span>
              <strong>😴 Sommeil</strong>
            </div>
            <div class="collapsible-content">
              <div class="entities-config">
                <div class="entity-label">😴 Durée de sommeil:</div>
                <input
                  type="text"
                  class="entity-input"
                  .value="${this.getEntityValue('sleep_duration')}"
                  placeholder="sensor.health_connect_sleep_duration"
                  @input="${(e) => this.entityChanged('sleep_duration', e.target.value)}"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="config-section">
          <h3>ℹ️ Informations</h3>
          <div class="info-box">
            <p><strong>Configuration des entités :</strong></p>
            <ul>
              <li>Laissez vide pour utiliser les noms par défaut</li>
              <li>Utilisez vos propres noms d'entités personnalisés</li>
              <li>Les capteurs non disponibles seront automatiquement masqués</li>
              <li>Les unités sont détectées automatiquement depuis les attributs</li>
            </ul>
            <p><strong>Exemple :</strong> <code>sensor.mon_capteur_poids</code> ou <code>sensor.my_custom_heart_rate</code></p>
          </div>
        </div>
      </div>
    `;

    // Mise à jour des valeurs après le rendu
    this.updateInputValues();
    this.addEventListeners();
  }

  updateInputValues() {
    // Mise à jour des valeurs des inputs après le rendu
    setTimeout(() => {
      const titleInput = this.shadowRoot.querySelector('input[type="text"]');
      if (titleInput) titleInput.value = this.config.title || '';
      
      const showEmptyInput = this.shadowRoot.querySelector('input[type="checkbox"]');
      if (showEmptyInput) showEmptyInput.checked = this.config.show_empty_categories || false;
      
      // Mise à jour des checkboxes des catégories
      ['vitals', 'activity', 'body', 'sleep'].forEach(category => {
        const checkbox = this.shadowRoot.querySelector(`#cat-${category}`);
        if (checkbox) checkbox.checked = this.isCategorySelected(category);
      });
      
      // Mise à jour des inputs des entités
      this.shadowRoot.querySelectorAll('.entity-input').forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
          const entityType = placeholder.split('_').pop();
          input.value = this.getEntityValue(entityType) || '';
        }
      });
    }, 10);
  }

  titleChanged(e) {
    const newConfig = { ...this.config, title: e.target.value };
    this.configChanged(newConfig);
  }

  showEmptyChanged(e) {
    const newConfig = { ...this.config, show_empty_categories: e.target.checked };
    this.configChanged(newConfig);
  }

  isCategorySelected(category) {
    if (!this.config.categories) return true; // Par défaut, toutes les catégories sont sélectionnées
    return this.config.categories.includes(category);
  }

  categoryChanged(category, checked) {
    let categories = this.config.categories || ['vitals', 'activity', 'body', 'sleep'];
    
    if (checked) {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    } else {
      categories = categories.filter(cat => cat !== category);
    }
    
    const newConfig = { ...this.config, categories };
    this.configChanged(newConfig);
  }

  getEntityValue(entityType) {
    return this.config.entities?.[entityType] || '';
  }

  entityChanged(entityType, value) {
    const entities = { ...this.config.entities };
    
    if (value.trim()) {
      entities[entityType] = value.trim();
    } else {
      delete entities[entityType];
    }
    
    const newConfig = { ...this.config, entities };
    this.configChanged(newConfig);
  }

  // Ajout des gestionnaires d'événements après le rendu
  addEventListeners() {
    // Gestionnaire pour le titre
    const titleInput = this.shadowRoot.querySelector('input[type="text"]');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => this.titleChanged(e));
    }

    // Gestionnaire pour les catégories vides
    const showEmptyInput = this.shadowRoot.querySelector('input[type="checkbox"]');
    if (showEmptyInput) {
      showEmptyInput.addEventListener('change', (e) => this.showEmptyChanged(e));
    }

    // Gestionnaires pour les catégories
    ['vitals', 'activity', 'body', 'sleep'].forEach(category => {
      const checkbox = this.shadowRoot.querySelector(`#cat-${category}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => this.categoryChanged(category, e.target.checked));
      }
    });

    // Gestionnaires pour les entités
    this.shadowRoot.querySelectorAll('.entity-input').forEach(input => {
      input.addEventListener('input', (e) => {
        // Extraire le type d'entité depuis le placeholder
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
          const match = placeholder.match(/sensor\.health_connect_(.+)$/);
          if (match) {
            this.entityChanged(match[1], e.target.value);
          }
        }
      });
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
