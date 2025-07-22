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
        }
        
        .config-section {
          background: var(--primary-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          padding: 16px;
        }
        
        .config-section h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color);
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
          color: var(--primary-text-color);
          flex: 1;
        }
        
        .config-description {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
        
        ha-switch {
          margin-left: 16px;
        }
        
        ha-textfield {
          width: 200px;
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
          color: var(--primary-text-color);
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
          color: var(--primary-text-color);
          font-weight: 500;
        }
        
        .entity-input {
          width: 100%;
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
        }
        
        .collapsible.expanded .expand-icon {
          transform: rotate(90deg);
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
            <ha-textfield
              .value=${this.config.title || ''}
              .placeholder=${'Health Connect'}
              @input=${this.titleChanged}
            ></ha-textfield>
          </div>
          
          <div class="config-row">
            <div>
              <div class="config-label">Afficher les catégories vides</div>
              <div class="config-description">Affiche les catégories même si aucun capteur n'est disponible</div>
            </div>
            <ha-switch
              .checked=${this.config.show_empty_categories || false}
              @change=${this.showEmptyChanged}
            ></ha-switch>
          </div>
        </div>
        
        <div class="config-section">
          <h3>📊 Catégories à afficher</h3>
          <div class="config-description">Sélectionnez les catégories de capteurs à afficher dans la carte</div>
          
          <div class="category-config">
            <div class="category-item">
              <ha-checkbox
                .checked=${this.isCategorySelected('vitals')}
                @change=${(e) => this.categoryChanged('vitals', e.target.checked)}
              ></ha-checkbox>
              <label>🫀 Signes vitaux</label>
            </div>
            
            <div class="category-item">
              <ha-checkbox
                .checked=${this.isCategorySelected('activity')}
                @change=${(e) => this.categoryChanged('activity', e.target.checked)}
              ></ha-checkbox>
              <label>🏃‍♂️ Activité</label>
            </div>
            
            <div class="category-item">
              <ha-checkbox
                .checked=${this.isCategorySelected('body')}
                @change=${(e) => this.categoryChanged('body', e.target.checked)}
              ></ha-checkbox>
              <label>⚖️ Mesures corporelles</label>
            </div>
            
            <div class="category-item">
              <ha-checkbox
                .checked=${this.isCategorySelected('sleep')}
                @change=${(e) => this.categoryChanged('sleep', e.target.checked)}
              ></ha-checkbox>
              <label>😴 Sommeil</label>
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
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('heart_rate')}
                  .placeholder=${'sensor.health_connect_heart_rate'}
                  @input=${(e) => this.entityChanged('heart_rate', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">💤 FC au repos:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('resting_heart_rate')}
                  .placeholder=${'sensor.health_connect_resting_heart_rate'}
                  @input=${(e) => this.entityChanged('resting_heart_rate', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">🩸 Glycémie:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('blood_glucose')}
                  .placeholder=${'sensor.health_connect_blood_glucose'}
                  @input=${(e) => this.entityChanged('blood_glucose', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">📈 Tension systolique:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('systolic_blood_pressure')}
                  .placeholder=${'sensor.health_connect_systolic_blood_pressure'}
                  @input=${(e) => this.entityChanged('systolic_blood_pressure', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">📉 Tension diastolique:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('diastolic_blood_pressure')}
                  .placeholder=${'sensor.health_connect_diastolic_blood_pressure'}
                  @input=${(e) => this.entityChanged('diastolic_blood_pressure', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">🫁 Saturation O₂:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('oxygen_saturation')}
                  .placeholder=${'sensor.health_connect_oxygen_saturation'}
                  @input=${(e) => this.entityChanged('oxygen_saturation', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">🌬️ Fréquence respiratoire:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('respiratory_rate')}
                  .placeholder=${'sensor.health_connect_respiratory_rate'}
                  @input=${(e) => this.entityChanged('respiratory_rate', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">📊 Variabilité FC:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('heart_rate_variability')}
                  .placeholder=${'sensor.health_connect_heart_rate_variability'}
                  @input=${(e) => this.entityChanged('heart_rate_variability', e.target.value)}
                ></ha-textfield>
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
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('steps')}
                  .placeholder=${'sensor.health_connect_steps'}
                  @input=${(e) => this.entityChanged('steps', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">📍 Distance:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('distance')}
                  .placeholder=${'sensor.health_connect_distance'}
                  @input=${(e) => this.entityChanged('distance', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">🔥 Calories actives:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('active_calories_burned')}
                  .placeholder=${'sensor.health_connect_active_calories_burned'}
                  @input=${(e) => this.entityChanged('active_calories_burned', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">⚡ Calories totales:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('total_calories_burned')}
                  .placeholder=${'sensor.health_connect_total_calories_burned'}
                  @input=${(e) => this.entityChanged('total_calories_burned', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">⛰️ Dénivelé:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('elevation_gained')}
                  .placeholder=${'sensor.health_connect_elevation_gained'}
                  @input=${(e) => this.entityChanged('elevation_gained', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">🪜 Étages montés:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('floors_climbed')}
                  .placeholder=${'sensor.health_connect_floors_climbed'}
                  @input=${(e) => this.entityChanged('floors_climbed', e.target.value)}
                ></ha-textfield>
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
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('weight')}
                  .placeholder=${'sensor.health_connect_weight'}
                  @input=${(e) => this.entityChanged('weight', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">📊 Masse grasse:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('body_fat')}
                  .placeholder=${'sensor.health_connect_body_fat'}
                  @input=${(e) => this.entityChanged('body_fat', e.target.value)}
                ></ha-textfield>
                
                <div class="entity-label">💪 VO₂ Max:</div>
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('vo2_max')}
                  .placeholder=${'sensor.health_connect_vo2_max'}
                  @input=${(e) => this.entityChanged('vo2_max', e.target.value)}
                ></ha-textfield>
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
                <ha-textfield
                  class="entity-input"
                  .value=${this.getEntityValue('sleep_duration')}
                  .placeholder=${'sensor.health_connect_sleep_duration'}
                  @input=${(e) => this.entityChanged('sleep_duration', e.target.value)}
                ></ha-textfield>
              </div>
            </div>
          </div>
        </div>
        
        <div class="config-section">
          <h3>ℹ️ Informations</h3>
          <div style="font-size: 13px; color: var(--secondary-text-color); line-height: 1.5;">
            <p><strong>Configuration des entités :</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
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
}

customElements.define('health-connect-card-editor', HealthConnectCardEditor);

// Ajout de l'éditeur à la carte existante
if (window.customCards) {
  const cardConfig = window.customCards.find(card => card.type === 'health-connect-card');
  if (cardConfig) {
    cardConfig.configurable = true;
  }
}
