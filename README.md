# Health Connect Card for Home Assistant

Une carte Lovelace personnalisée pour Home Assistant qui affiche les informations des capteurs Health Connect dans une interface belle et organisée.

![Health Connect Card](https://img.shields.io/badge/version-1.0.0-blue.svg)
![HACS](https://img.shields.io/badge/HACS-compatible-green.svg)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2023.4%2B-blue.svg)

## ✨ Fonctionnalités

- 🏥 **Données de santé complètes** : Affiche tous les capteurs Health Connect de votre appareil Android
- 📊 **Catégories organisées** : Groupe les capteurs en Signes vitaux, Activité, Mesures corporelles et Sommeil
- 🎨 **Design moderne** : Interface responsive qui s'intègre parfaitement à l'esthétique de Home Assistant
- 📱 **Responsive mobile** : Optimisé pour l'affichage desktop et mobile
- ⚡ **Auto-détection** : Découvre et affiche automatiquement les capteurs Health Connect disponibles
- 🔄 **Mises à jour temps réel** : Affiche les données en direct de vos capteurs Health Connect
- 🎯 **Détails au clic** : Cliquez sur n'importe quel capteur pour voir les informations détaillées
- ⚙️ **Capteurs personnalisables** : Choisissez quels capteurs afficher via l'interface de configuration
- �️ **Entités personnalisées** : Utilisez vos propres noms d'entités au lieu des noms par défaut
- �🌙 **Thème adaptatif** : Support automatique du mode sombre/clair
- 🎨 **Codes couleur intelligents** : Indication visuelle des valeurs normales, attention et alerte
- 📏 **Formatage intelligent** : Conversion automatique des unités (g→kg, m→km, min→heures, etc.)

## 📸 Captures d'écran

The card displays your health data in organized categories:

### Vitals
- Heart Rate
- Resting Heart Rate  
- Heart Rate Variability
- Blood Glucose
- Blood Pressure (Systolic/Diastolic)
- Oxygen Saturation
- Respiratory Rate

### Activity
- Steps
- Distance Traveled
- Elevation Gained
- Floors Climbed
- Active Calories Burned
- Total Calories Burned

### Body Measurements
- Weight
- Body Fat Percentage
- VO2 Max

### Sleep
- Sleep Duration

## Prerequisites

1. **Android Device**: Health Connect sensors are only available on Android devices
2. **Home Assistant Companion App**: Latest version installed from Google Play Store
3. **Health Connect**: Enabled and configured on your Android device
4. **Sensor Permissions**: Health Connect sensors enabled in the companion app

## Installation

### Method 1: HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the "+" button
4. Search for "Health Connect Card"
5. Install the card
6. Restart Home Assistant

### Method 2: Manual Installation

1. Download `health-connect-card.js` from the latest release
2. Copy the file to your `config/www/` directory
3. Add the card to your resources in the Lovelace configuration:

```yaml
resources:
  - url: /local/health-connect-card.js
    type: module
```

4. Restart Home Assistant

## Configuration

### Using the Visual Editor (Recommended)

1. Add the card to your dashboard
2. Click the **Configure** button (pencil icon) on the card
3. Set a custom title (optional)
4. Select which sensors you want to display by checking the boxes
5. Only sensors that are available in your Home Assistant will be enabled
6. Save your configuration

### Manual YAML Configuration

If you prefer to configure the card manually, you can use YAML:

### Basic Configuration

```yaml
type: custom:health-connect-card
```

### Advanced Configuration

```yaml
type: custom:health-connect-card
title: "My Health Data"
sensors:
  - sensor.health_connect_steps
  - sensor.health_connect_heart_rate
  - sensor.health_connect_weight
  - sensor.health_connect_sleep_duration
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Health Connect Sensors" | Custom title for the card |
| `sensors` | list | (all available sensors) | List of specific sensor entities to display. If not specified, all available Health Connect sensors will be shown |

## Setting Up Health Connect Sensors

To use this card, you need to enable Health Connect sensors in the Home Assistant companion app:

1. Open the Home Assistant companion app on your Android device
2. Go to **Settings** → **Companion App** → **Manage Sensors**
3. Find the **Health Connect** sensors section
4. Enable the sensors you want to track
5. Grant the necessary permissions when prompted

### Supported Health Connect Sensors

The card automatically detects and displays these Health Connect sensors:

- `sensor.health_connect_heart_rate`
- `sensor.health_connect_resting_heart_rate`
- `sensor.health_connect_heart_rate_variability`
- `sensor.health_connect_blood_glucose`
- `sensor.health_connect_systolic_blood_pressure`
- `sensor.health_connect_diastolic_blood_pressure`
- `sensor.health_connect_oxygen_saturation`
- `sensor.health_connect_respiratory_rate`
- `sensor.health_connect_steps`
- `sensor.health_connect_distance`
- `sensor.health_connect_elevation_gained`
- `sensor.health_connect_floors_climbed`
- `sensor.health_connect_active_calories_burned`
- `sensor.health_connect_total_calories_burned`
- `sensor.health_connect_weight`
- `sensor.health_connect_body_fat`
- `sensor.health_connect_vo2_max`
- `sensor.health_connect_sleep_duration`

## Data Sources

Health Connect aggregates data from various health and fitness apps on your Android device:

- **Samsung Health**
- **Google Fit**
- **Fitbit**
- **Garmin Connect**
- **Withings Health Mate**
- **Sleep as Android**
- **MyFitnessPal**
- **Strava**
- And many other compatible apps

## Troubleshooting

### No sensors showing up?

1. **Check Health Connect app**: Ensure Health Connect is installed and configured
2. **Companion app permissions**: Verify the Home Assistant app has health permissions
3. **Sensor enablement**: Enable Health Connect sensors in companion app settings
4. **Data availability**: Ensure connected apps have recent health data
5. **Android version**: Health Connect requires Android 9+ (some features require Android 13+)

### Sensors showing "Unavailable"?

1. **App connectivity**: Check if source apps are properly connected to Health Connect
2. **Recent data**: Some sensors only show data when recently updated
3. **Permissions**: Verify all necessary permissions are granted
4. **Restart**: Try restarting the Home Assistant companion app

### Performance issues?

The card is optimized for performance, but with many sensors:

1. **Sensor selection**: Consider disabling unused sensors in the companion app
2. **Update frequency**: Check companion app sensor update frequency settings

## Customization

### Custom Styling

You can customize the card's appearance using card-mod:

```yaml
type: custom:health-connect-card
title: "Health Dashboard"
card_mod:
  style: |
    .card-header {
      background: linear-gradient(135deg, #4CAF50 0%, #2196F3 100%);
    }
```

### Using in Dashboards

The card works great in various dashboard layouts:

```yaml
# In a grid layout
type: grid
columns: 2
square: false
cards:
  - type: custom:health-connect-card
    title: "Health Overview"
  - type: entities
    title: "Quick Actions"
    entities:
      - switch.fitness_mode
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this card helpful, consider:

- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting new features
- 📖 Improving documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### v1.0.0
- Initial release
- Support for all Health Connect sensors
- Responsive design
- Automatic sensor detection
- Category-based organization
- Click to view details

## Acknowledgments

- Home Assistant team for the excellent platform
- Android Health team for Health Connect
- HACS for making custom component distribution easy
- Community members for feedback and suggestions