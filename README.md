# Health Connect Card for Home Assistant

A custom Lovelace card for Home Assistant that displays Health Connect sensor information in a beautiful, organized layout.

![Health Connect Card](https://img.shields.io/badge/version-1.0.0-blue.svg)
![HACS](https://img.shields.io/badge/HACS-compatible-green.svg)

## Features

- 🏥 **Comprehensive Health Data**: Displays all Health Connect sensors from your Android device
- 📊 **Organized Categories**: Groups sensors into Vitals, Activity, Body Measurements, and Sleep
- 🎨 **Beautiful Design**: Modern, responsive design that fits Home Assistant's aesthetic
- 📱 **Mobile Responsive**: Optimized for both desktop and mobile viewing
- ⚡ **Auto-Detection**: Automatically discovers and displays available Health Connect sensors
- 🔄 **Real-time Updates**: Shows live data from your Health Connect sensors
- 🎯 **Click to Details**: Click any sensor to view detailed information

## Screenshots

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

Add the card to your Lovelace dashboard:

### Basic Configuration

```yaml
type: custom:health-connect-card
```

### Advanced Configuration

```yaml
type: custom:health-connect-card
title: "My Health Data"
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Health Connect Sensors" | Custom title for the card |

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