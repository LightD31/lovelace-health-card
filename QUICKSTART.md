# Health Connect Card - Guide de démarrage rapide

## 🚀 Installation express

### 1. Via HACS (Recommandé)
1. Ouvrez HACS → Frontend
2. Menu "⋮" → Dépôts personnalisés
3. Ajoutez : `https://github.com/LightD31/lovelace-health-card`
4. Catégorie : "Lovelace"
5. Installez "Health Connect Card"

### 2. Installation manuelle
1. Téléchargez `health-connect-card.js`
2. Copiez dans `config/www/community/lovelace-health-card/`
3. Ajoutez la ressource dans Configuration → Lovelace → Ressources

## ⚙️ Configuration express

### Configuration minimale
```yaml
type: custom:health-connect-card
```

### Configuration recommandée
```yaml
type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals    # Signes vitaux
  - activity  # Activité physique
  - body      # Mesures corporelles
  - sleep     # Sommeil
show_empty_categories: false
```

### Avec entités personnalisées
```yaml
type: custom:health-connect-card
title: "Ma santé"
categories:
  - vitals
  - activity
entities:
  # Remplacez par vos vraies entités
  heart_rate: sensor.mon_capteur_coeur
  steps: sensor.compteur_pas_fitbit
  weight: sensor.balance_xiaomi
  blood_pressure_systolic: sensor.tension_systole
```

## 📱 Capteurs requis

Assurez-vous d'avoir l'intégration Health Connect configurée avec ces capteurs :

### Essentiels
- `sensor.health_connect_heart_rate`
- `sensor.health_connect_steps`
- `sensor.health_connect_weight`

### Complets (18 capteurs supportés)
Voir [EXAMPLES.md](EXAMPLES.md) pour la liste complète.

## 🎨 Personnalisation rapide

### Interface utilisateur
- Éditeur visuel intégré ✅
- Configuration par drag-and-drop ✅
- Aperçu en temps réel ✅

### Depuis l'interface HA
1. Ajoutez la carte
2. Cliquez sur "Configurer"
3. Sélectionnez les catégories désirées
4. Personnalisez le titre
5. Sauvegardez

## 🐛 Résolution rapide

### La carte ne s'affiche pas ?
```bash
# Vérifiez la console développeur (F12)
# Rechargez avec cache vide (Ctrl+Maj+R)
```

### Capteurs manquants ?
- Vérifiez que l'intégration Health Connect fonctionne
- Les capteurs non disponibles sont automatiquement masqués
- Les noms d'entités doivent correspondre exactement

### Performance lente ?
```yaml
# Affichez seulement les catégories nécessaires
categories:
  - vitals  # Plus léger
show_empty_categories: false  # Optimise l'affichage
```

## 🔄 Mise à jour

### Via HACS
1. HACS → Frontend
2. Health Connect Card → "Mettre à jour"
3. Redémarrez HA

### Manuelle
1. Remplacez le fichier `.js`
2. Videz le cache navigateur
3. Rechargez la page

## 💡 Conseils pro

1. **Mobile** : Une carte par catégorie pour un meilleur affichage
2. **Performance** : Désactivez les catégories non utilisées
3. **Design** : La carte s'adapte automatiquement au thème HA
4. **Données** : Cliquez sur un capteur pour voir les détails
5. **Diagnostic** : Utilisez `test.html` pour valider le fonctionnement

## 📞 Support

- 🐛 **Bugs** : [Issues GitHub](https://github.com/LightD31/lovelace-health-card/issues)
- 💬 **Discussion** : [GitHub Discussions](https://github.com/LightD31/lovelace-health-card/discussions)
- 📖 **Documentation** : [README complet](README.md)

---

**⏱️ Temps d'installation : 2-3 minutes**  
**🎯 Prêt à l'emploi : Configuration automatique**  
**🔄 Mises à jour : Automatiques via HACS**

Profitez de votre nouveau tableau de bord santé ! 🏥✨
