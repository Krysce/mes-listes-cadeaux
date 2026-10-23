# 🎁 Mes listes cadeaux

Une petite app pour préparer ses cadeaux de Noël, d'anniversaires et d'événements, avec un budget, des photos, des liens et un PDF à envoyer à la famille.

## Ce qu'elle fait

- **4 espaces** : 🎄 Noël, 🎂 Anniversaires, 🎉 Événements et 💡 Idées (la boîte à idées de l'année).
- **Budget** : prévu, déjà acheté et ce qu'il reste. Les cadeaux offerts par quelqu'un d'autre (sticker 🙋) sont rendus au budget.
- **Photos** des cadeaux, **icônes et couleurs** pour chaque personne.
- **Partage** : un PDF aux couleurs de l'app, envoyé directement dans WhatsApp, Messages ou Mail depuis le téléphone.
- **Listes passées archivées** : elles restent consultables mais ne se modifient plus.
- **Sauvegarde** : export et import de toutes les listes (avec les photos) dans un fichier.
- **Hors ligne** : l'app s'ouvre même sans connexion.

Les données restent **sur ton téléphone** (rien n'est envoyé sur un serveur). Pense à faire une sauvegarde de temps en temps.

## Installer l'app sur le téléphone

Ouvre l'adresse GitHub Pages du dépôt, puis :

- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮ → « Installer l'application » (ou « Ajouter à l'écran d'accueil »).

## Les fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | L'app (générée par `build.py`) |
| `app-source.html` | La page source, identique à la version dans Claude |
| `local-runtime.js` | Enregistrement sur le téléphone, photos, partage des fichiers |
| `sw.js` | Fonctionnement hors ligne |
| `manifest.webmanifest` | Nom, couleurs et icônes de l'app installée |
| `icons/` | Icône de l'app |
| `build.py` | Régénère `index.html` après une modification de `app-source.html` |
