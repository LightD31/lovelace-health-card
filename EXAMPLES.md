# Exemples de configuration - Health Connect Card

## 📋 Configuration minimale

```yaml
type: custom:health-connect-card
```

## 🔧 Configuration avec entités personnalisées

```yaml
type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals
  - activity
  - body
entities:
  heart_rate: sensor.mon_capteur_rythme_cardiaque
  steps: sensor.compteur_pas_personnalise  
  weight: sensor.ma_balance_connectee
  sleep_duration: sensor.duree_sommeil_custom
```

## 🎨 Configuration complète avec toutes les options

```yaml
type: custom:health-connect-card
title: "Tableau de bord santé"
categories:
  - vitals
  - activity
  - body
  - sleep
show_empty_categories: true
entities:
  # Signes vitaux
  heart_rate: sensor.polar_heart_rate
  resting_heart_rate: sensor.fitbit_resting_hr
  blood_glucose: sensor.freestyle_glucose
  systolic_blood_pressure: sensor.omron_systolic
  diastolic_blood_pressure: sensor.omron_diastolic
  oxygen_saturation: sensor.pulse_oximeter_spo2
  respiratory_rate: sensor.breath_rate_sensor
  heart_rate_variability: sensor.hrv_monitor
  
  # Activité
  steps: sensor.mi_band_steps
  distance: sensor.strava_distance
  active_calories_burned: sensor.garmin_active_calories
  total_calories_burned: sensor.total_daily_calories
  elevation_gained: sensor.altitude_gain_today
  floors_climbed: sensor.floors_climbed_counter
  
  # Mesures corporelles
  weight: sensor.xiaomi_scale_weight
  body_fat: sensor.xiaomi_scale_body_fat
  vo2_max: sensor.fitness_vo2_max
  
  # Sommeil
  sleep_duration: sensor.sleep_as_android_duration
```

## 🏥 Affichage uniquement des signes vitaux

```yaml
type: custom:health-connect-card
title: "Signes vitaux"
categories:
  - vitals
show_empty_categories: false
```

## 🏃‍♂️ Carte d'activité sportive

```yaml
type: custom:health-connect-card
title: "Activité du jour"
categories:
  - activity
show_empty_categories: false
```

## ⚖️ Suivi corporel

```yaml
type: custom:health-connect-card
title: "Mesures corporelles"
categories:
  - body
show_empty_categories: true
```

## 😴 Suivi du sommeil

```yaml
type: custom:health-connect-card
title: "Qualité du sommeil"
categories:
  - sleep
show_empty_categories: false
```

## 📊 Configuration personnalisée pour tableau de bord principal

```yaml
type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals
  - activity
show_empty_categories: false
```

## 🔧 Configuration avec conditionnement

Vous pouvez utiliser la carte avec des conditions pour l'afficher uniquement si certains capteurs sont disponibles :

```yaml
type: conditional
conditions:
  - entity: sensor.health_connect_heart_rate
    state_not: "unavailable"
card:
  type: custom:health-connect-card
  title: "Données de santé"
```

## 📱 Exemple de dashboard mobile

Pour une vue optimisée mobile, vous pouvez organiser les cartes par catégorie :

```yaml
# Dashboard mobile - Vue santé
title: Ma santé
path: health
icon: mdi:heart-pulse
panel: false
cards:
  - type: vertical-stack
    cards:
      - type: custom:health-connect-card
        title: "🫀 Signes vitaux"
        categories:
          - vitals
      
      - type: custom:health-connect-card
        title: "🏃‍♂️ Activité"
        categories:
          - activity
          
      - type: custom:health-connect-card
        title: "⚖️ Corps"
        categories:
          - body
          
      - type: custom:health-connect-card
        title: "😴 Sommeil"
        categories:
          - sleep
```

## 🏠 Intégration dans une vue existante

```yaml
# Ajout à une vue existante
type: vertical-stack
cards:
  - type: weather-forecast
    entity: weather.home
    
  - type: custom:health-connect-card
    title: "Santé du jour"
    categories:
      - vitals
      - activity
      
  - type: entities
    entities:
      - sensor.temperature
      - sensor.humidity
```

## ⚙️ Configuration avancée avec personnalisation CSS

Si vous souhaitez personnaliser davantage l'apparence :

```yaml
type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals
  - activity
  - body
card_mod:
  style: |
    ha-card {
      --primary-color: #ff6b6b;
      --card-background-color: #f8f9fa;
      border-radius: 20px !important;
    }
```

## 📊 Exemple pour dashboard administrateur

Configuration pour monitorer la santé de plusieurs personnes :

```yaml
type: horizontal-stack
cards:
  - type: custom:health-connect-card
    title: "👨 Papa"
    # Supposons des capteurs avec suffixe _papa
    
  - type: custom:health-connect-card
    title: "👩 Maman" 
    # Supposons des capteurs avec suffixe _maman
    
  - type: custom:health-connect-card
    title: "👶 Enfant"
    # Supposons des capteurs avec suffixe _enfant
```

## 🎯 Conseils de configuration

1. **Performance** : N'affichez que les catégories dont vous avez besoin
2. **Visibilité** : Laissez `show_empty_categories: false` pour une interface plus propre
3. **Mobile** : Utilisez des cartes séparées par catégorie sur mobile
4. **Personnalisation** : Utilisez des titres explicites selon le contexte
5. **Surveillance** : Combinez avec d'autres cartes pour un dashboard complet
