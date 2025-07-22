# Changelog

Toutes les modifications importantes de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/lang/fr/).

## [1.0.0] - 2025-07-22

### Ajouté
- 🎉 Version initiale de Health Connect Card
- 🏥 Support complet de tous les capteurs Health Connect
- 📊 Organisation en 4 catégories : Signes vitaux, Activité, Mesures corporelles, Sommeil
- 🎨 Interface moderne et responsive
- 📱 Optimisation mobile avec design adaptatif
- ⚡ Auto-détection des capteurs disponibles
- 🔄 Mise à jour en temps réel des données
- 🎯 Interaction : clic pour ouvrir les détails des entités
- ⚙️ Interface de configuration visuelle
- 🌙 Support du mode sombre/clair automatique
- 🎨 Thème personnalisable selon Home Assistant
- 📝 Documentation complète avec exemples
- 🔧 Compatible HACS
- ✨ Formatage intelligent des unités (kg, km, heures, etc.)
- 🎨 Codes couleur selon les valeurs (normal/attention/alerte)
- 💾 Configuration persistante
- 📊 Affichage des horodatages de mise à jour
- 🏷️ Support des entités indisponibles avec indication visuelle

### Capteurs supportés
- **Signes vitaux (8 capteurs)**
  - Fréquence cardiaque et au repos
  - Tension artérielle (systolique/diastolique)  
  - Glycémie
  - Saturation en oxygène
  - Fréquence respiratoire
  - Variabilité cardiaque

- **Activité physique (6 capteurs)**
  - Pas et distance
  - Calories actives et totales
  - Dénivelé et étages montés

- **Mesures corporelles (3 capteurs)**
  - Poids et masse grasse
  - VO₂ Max

- **Sommeil (1 capteur)**
  - Durée de sommeil

### Fonctionnalités techniques
- Classe ES6 moderne avec Shadow DOM
- Gestion d'état réactive
- Formatage des données intelligent
- Code couleur selon les valeurs normales
- Interface de configuration drag-and-drop
- Chargement différé de l'éditeur
- Validation des configurations
- Gestion d'erreurs robuste
- Logs de débogage

### Documentation
- Guide d'installation détaillé
- Exemples de configuration variés
- Documentation des capteurs
- Guide de dépannage
- Bonnes pratiques d'utilisation

---

## Fonctionnalités prévues

### [1.1.0] - À venir
- 🎨 Thèmes personnalisés prédéfinis
- 📊 Graphiques historiques intégrés
- 🔔 Alertes et seuils configurables
- 🏆 Objectifs et badges de progression
- 📅 Vue calendrier des données
- 🔄 Synchronisation avec Google Fit/Apple Health
- 🏥 Export des données vers fichiers
- 🌍 Support multilingue étendu

### [1.2.0] - Fonctionnalités avancées
- 📈 Analyse des tendances
- 🤖 Suggestions basées sur IA
- 👥 Support multi-utilisateurs
- 📱 Notifications push
- 🎮 Gamification
- 🔐 Chiffrement des données sensibles
- 📊 Rapports automatiques
- 🏃‍♂️ Intégration avec applications de fitness

---

## Notes de développement

### Architecture
- Basé sur lit-element pour les performances
- Architecture modulaire pour l'extensibilité
- Tests automatisés avec Jest
- CI/CD avec GitHub Actions
- Support TypeScript pour le développement

### Compatibilité
- Home Assistant 2023.4.0+
- Navigateurs modernes (Chrome 80+, Firefox 75+, Safari 13+)
- Mobile responsive
- Support PWA
- Compatible avec tous les thèmes HA

### Performance
- Chargement différé des composants
- Optimisation des re-rendus
- Cache intelligent des données
- Minification automatique
- Lazy loading des ressources
