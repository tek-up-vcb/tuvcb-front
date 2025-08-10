# Page de Gestion des Utilisateurs

## Description
Une nouvelle page "Manage Users" a été ajoutée à l'application, accessible depuis le dashboard. Cette page permet de gérer les utilisateurs de la plateforme avec les fonctionnalités suivantes :

## Fonctionnalités

### Interface Utilisateur
- **Table des utilisateurs** : Affichage de tous les utilisateurs sous forme de tableau avec :
  - Nom et Prénom
  - Rôle (Admin, Teacher, Guest) avec icônes et badges colorés
  - Adresse wallet (format hexadécimal)
  - Date de création
  - Actions (bouton Modifier)

### Formulaire de création
- **Bouton "+" en haut à gauche** pour ouvrir le formulaire de création
- **Modal dialog** avec formulaire pour créer un nouvel utilisateur
- **Validation des champs** :
  - Nom (requis)
  - Prénom (requis) 
  - Rôle (requis) - sélection parmi Admin, Teacher, Guest
  - Adresse wallet (requise) - validation format Ethereum (0x + 40 caractères hexadécimaux)

### Sécurité
- **Protection par authentification** : La page nécessite d'être connecté
- **Redirection automatique** vers la page de login si non authentifié
- **Validation côté client** des adresses wallet Ethereum

## Navigation
- Accessible depuis le dashboard via le bouton "Gérer les utilisateurs"
- Bouton "Retour au Dashboard" pour revenir au tableau de bord

## Données temporaires
Pour l'instant, la page utilise des données factices (mock data) :
- Affichage de 3 utilisateurs d'exemple
- Simulation de l'ajout d'utilisateurs (stockage local temporaire)
- Les données ne sont pas persistantes et seront perdues au rafraîchissement

## Prochaines étapes
- Connexion au backend pour l'API des utilisateurs
- Implémentation des opérations CRUD (Create, Read, Update, Delete)
- Gestion de la persistance des données
- Ajout de fonctionnalités de modification et suppression

## Technologies utilisées
- **React** avec hooks (useState, useEffect)
- **React Router** pour la navigation
- **Shadcn/ui** pour les composants UI :
  - Table, Card, Button, Dialog
  - Input, Label, Select
  - Icons de Lucide React
- **Validation** côté client avec regex pour les adresses Ethereum

## Structure des fichiers
```
src/
├── pages/
│   ├── manage-users.jsx    # Nouvelle page de gestion des utilisateurs
│   └── dashboard.jsx       # Mise à jour avec lien vers manage-users
├── App.jsx                 # Ajout de la route /manage-users
└── components/ui/          # Composants UI réutilisés
    ├── table.tsx
    ├── dialog.tsx
    ├── select.tsx
    └── ...
```
