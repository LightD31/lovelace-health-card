# Guide d'installation - Health Connect Card

## 🚀 Installation

### Via HACS (Recommandé)

1. Ouvrez HACS dans Home Assistant
2. Allez dans Frontend
3. Cliquez sur "Dépôts personnalisés" (Custom Repositories)
4. Ajoutez l'URL : `https://github.com/LightD31/lovelace-health-card`
5. Sélectionnez "Lovelace" comme catégorie
6. Cliquez sur "Ajouter"
7. Recherchez "Health Connect Card" et installez

### Installation manuelle

1. Téléchargez `health-connect-card.js` depuis ce dépôt
2. Copiez le fichier dans `config/www/health-connect-card/`
3. Ajoutez la ressource dans Home Assistant :
   - Allez dans Configuration → Lovelace Dashboards → Ressources
   - Ajoutez `/local/health-connect-card/health-connect-card.js` comme ressource JavaScript

## ⚙️ Configuration

### Configuration de base

```yaml
type: custom:health-connect-card
```

### Configuration avancée

```yaml
type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals
  - activity
  - body
  - sleep
show_empty_categories: false
entities:
  # Exemple d'entités personnalisées
  heart_rate: sensor.mon_capteur_coeur
  steps: sensor.mes_pas
  weight: sensor.ma_balance
```

## 📋 Options de configuration

| Option | Type | Description | Défaut |
|--------|------|-------------|---------|
| `title` | string | Titre personnalisé de la carte | "Health Connect" |
| `categories` | list | Catégories à afficher | `['vitals', 'activity', 'body', 'sleep']` |
| `show_empty_categories` | boolean | Afficher les catégories vides | `false` |
| `entities` | object | Noms personnalisés des entités | `{}` (noms par défaut) |

### Catégories disponibles

- **vitals** : Signes vitaux (fréquence cardiaque, tension, etc.)
- **activity** : Activité physique (pas, distance, calories, etc.)
- **body** : Mesures corporelles (poids, masse grasse, VO₂ Max)
- **sleep** : Données de sommeil

## 📱 Capteurs Health Connect supportés

### Signes vitaux (vitals)
- `sensor.health_connect_heart_rate` - Fréquence cardiaque
- `sensor.health_connect_resting_heart_rate` - Fréquence cardiaque au repos
- `sensor.health_connect_blood_glucose` - Glycémie
- `sensor.health_connect_systolic_blood_pressure` - Tension systolique
- `sensor.health_connect_diastolic_blood_pressure` - Tension diastolique
- `sensor.health_connect_oxygen_saturation` - Saturation en oxygène
- `sensor.health_connect_respiratory_rate` - Fréquence respiratoire
- `sensor.health_connect_heart_rate_variability` - Variabilité cardiaque

### Activité physique (activity)
- `sensor.health_connect_steps` - Nombre de pas
- `sensor.health_connect_distance` - Distance parcourue
- `sensor.health_connect_active_calories_burned` - Calories actives
- `sensor.health_connect_total_calories_burned` - Calories totales
- `sensor.health_connect_elevation_gained` - Dénivelé
- `sensor.health_connect_floors_climbed` - Étages montés

### Mesures corporelles (body)
- `sensor.health_connect_weight` - Poids
- `sensor.health_connect_body_fat` - Masse grasse
- `sensor.health_connect_vo2_max` - VO₂ Max

### Sommeil (sleep)
- `sensor.health_connect_sleep_duration` - Durée de sommeil

## 🎨 Personnalisation

La carte s'adapte automatiquement au thème de Home Assistant :
- Mode sombre/clair
- Couleurs personnalisées
- Police système

## 🔧 Dépannage

### La carte ne s'affiche pas
1. Vérifiez que la ressource est correctement ajoutée
2. Rechargez la page (Ctrl+F5)
3. Vérifiez la console développeur pour les erreurs

### Capteurs non affichés
1. Vérifiez que les capteurs existent dans Home Assistant
2. Les noms des entités doivent correspondre exactement
3. Les capteurs indisponibles sont automatiquement masqués

### Problèmes de style
1. Videz le cache du navigateur
2. Vérifiez les conflits avec d'autres cartes personnalisées

## 📞 Support

Pour le support et les rapports de bugs, utilisez les [Issues GitHub](https://github.com/LightD31/lovelace-health-card/issues).
