const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;
const nothing = LitElement.prototype.nothing;

class HealthConnectCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  static styles = css`
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
    
    ha-textfield {
      width: 200px;
    }
    
    ha-checkbox {
      margin-left: 16px;
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
    
    .entity-textfield {
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
  `;

  setConfig(config) {
    this._config = { ...config };
  }

  _configChanged(newConfig) {
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="config-section">
          <h3>🎨 Apparence</h3>
          
          <div class="config-row">
            <div>
              <div class="config-label">Titre personnalisé</div>
              <div class="config-description">Laissez vide pour utiliser le titre par défaut</div>
            </div>
            <ha-textfield
              .label=${"Titre"}
              .value=${this._config.title || ''}
              .configValue=${"title"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
          
          <div class="config-row">
            <div>
              <div class="config-label">Afficher les catégories vides</div>
              <div class="config-description">Affiche les catégories même si aucun capteur n'est disponible</div>
            </div>
            <ha-checkbox
              .checked=${this._config.show_empty_categories || false}
              .configValue=${"show_empty_categories"}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </div>
        </div>
        
        <div class="config-section">
          <h3>📊 Catégories à afficher</h3>
          <div class="config-description">Sélectionnez les catégories de capteurs à afficher dans la carte</div>
          
          <div class="category-config">
            ${this._renderCategoryCheckbox('vitals', '🫀 Signes vitaux')}
            ${this._renderCategoryCheckbox('activity', '🏃‍♂️ Activité')}
            ${this._renderCategoryCheckbox('body', '⚖️ Mesures corporelles')}
            ${this._renderCategoryCheckbox('sleep', '😴 Sommeil')}
          </div>
        </div>
        
        <div class="config-section">
          <h3>🔧 Configuration des entités</h3>
          <div class="config-description">Personnalisez les noms des entités pour chaque type de capteur</div>
          
          ${this._renderEntitySection('vitals', '🫀 Signes vitaux', [
            { key: 'heart_rate', label: '💓 Fréquence cardiaque', placeholder: 'sensor.health_connect_heart_rate' },
            { key: 'resting_heart_rate', label: '💤 FC au repos', placeholder: 'sensor.health_connect_resting_heart_rate' },
            { key: 'blood_glucose', label: '🩸 Glycémie', placeholder: 'sensor.health_connect_blood_glucose' },
            { key: 'systolic_blood_pressure', label: '📈 Tension systolique', placeholder: 'sensor.health_connect_systolic_blood_pressure' },
            { key: 'diastolic_blood_pressure', label: '📉 Tension diastolique', placeholder: 'sensor.health_connect_diastolic_blood_pressure' },
            { key: 'oxygen_saturation', label: '🫁 Saturation O₂', placeholder: 'sensor.health_connect_oxygen_saturation' },
            { key: 'respiratory_rate', label: '🌬️ Fréquence respiratoire', placeholder: 'sensor.health_connect_respiratory_rate' },
            { key: 'heart_rate_variability', label: '📊 Variabilité FC', placeholder: 'sensor.health_connect_heart_rate_variability' }
          ])}
          
          ${this._renderEntitySection('activity', '🏃‍♂️ Activité', [
            { key: 'steps', label: '👣 Pas', placeholder: 'sensor.health_connect_steps' },
            { key: 'distance', label: '📍 Distance', placeholder: 'sensor.health_connect_distance' },
            { key: 'active_calories_burned', label: '🔥 Calories actives', placeholder: 'sensor.health_connect_active_calories_burned' },
            { key: 'total_calories_burned', label: '⚡ Calories totales', placeholder: 'sensor.health_connect_total_calories_burned' },
            { key: 'elevation_gained', label: '⛰️ Dénivelé', placeholder: 'sensor.health_connect_elevation_gained' },
            { key: 'floors_climbed', label: '🪜 Étages montés', placeholder: 'sensor.health_connect_floors_climbed' }
          ])}
          
          ${this._renderEntitySection('body', '⚖️ Mesures corporelles', [
            { key: 'weight', label: '⚖️ Poids', placeholder: 'sensor.health_connect_weight' },
            { key: 'body_fat', label: '📊 Masse grasse', placeholder: 'sensor.health_connect_body_fat' },
            { key: 'vo2_max', label: '💪 VO₂ Max', placeholder: 'sensor.health_connect_vo2_max' }
          ])}
          
          ${this._renderEntitySection('sleep', '😴 Sommeil', [
            { key: 'sleep_duration', label: '😴 Durée de sommeil', placeholder: 'sensor.health_connect_sleep_duration' }
          ])}
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
  }

  _renderCategoryCheckbox(category, label) {
    return html`
      <div class="category-item">
        <ha-checkbox
          .checked=${this._isCategorySelected(category)}
          .configValue=${category}
          @change=${this._categoryChanged}
        ></ha-checkbox>
        <label>${label}</label>
      </div>
    `;
  }

  _renderEntitySection(sectionId, title, entities) {
    return html`
      <div class="collapsible" id="${sectionId}-entities">
        <div class="collapsible-header" @click=${this._toggleCollapsible}>
          <span class="expand-icon">▶</span>
          <strong>${title}</strong>
        </div>
        <div class="collapsible-content">
          <div class="entities-config">
            ${entities.map(entity => html`
              <div class="entity-label">${entity.label}:</div>
              <ha-textfield
                class="entity-textfield"
                .label=${entity.label}
                .value=${this._getEntityValue(entity.key) || ''}
                .placeholder=${entity.placeholder}
                .configValue=${entity.key}
                @input=${this._entityChanged}
              ></ha-textfield>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  _toggleCollapsible(e) {
    const collapsible = e.currentTarget.parentElement;
    collapsible.classList.toggle('expanded');
  }

  _valueChanged(e) {
    if (!this._config || !this.hass) return;

    const target = e.target;
    const value = e.detail?.value !== undefined ? e.detail.value : target.value;
    const configValue = target.configValue;

    if (configValue) {
      const newConfig = {
        ...this._config,
        [configValue]: target.type === 'number' ? parseInt(value) : value,
      };

      if (value === '') {
        delete newConfig[configValue];
      }

      this._configChanged(newConfig);
    }
  }

  _categoryChanged(e) {
    if (!this._config) return;

    const category = e.target.configValue;
    const checked = e.target.checked;

    let categories = this._config.categories || ['vitals', 'activity', 'body', 'sleep'];
    
    if (checked) {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    } else {
      categories = categories.filter(cat => cat !== category);
    }
    
    const newConfig = { ...this._config, categories };
    this._configChanged(newConfig);
  }

  _entityChanged(e) {
    if (!this._config) return;

    const entityType = e.target.configValue;
    const value = e.target.value;

    const entities = { ...this._config.entities };
    
    if (value.trim()) {
      entities[entityType] = value.trim();
    } else {
      delete entities[entityType];
    }
    
    const newConfig = { ...this._config, entities };
    this._configChanged(newConfig);
  }

  _isCategorySelected(category) {
    if (!this._config.categories) return true; // Par défaut, toutes les catégories sont sélectionnées
    return this._config.categories.includes(category);
  }

  _getEntityValue(entityType) {
    return this._config.entities?.[entityType] || '';
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
