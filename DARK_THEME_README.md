# Thème Dark - Documentation

## Implémentation du thème dark avec shadcn/ui

Le thème dark a été implémenté en utilisant `next-themes` et les variables CSS de shadcn/ui.

### Fonctionnalités

1. **Toggle automatique** : Basculer entre le thème clair et sombre
2. **Persistance** : Le thème choisi est sauvegardé dans le localStorage
3. **Support shadcn/ui** : Tous les composants UI supportent automatiquement le thème dark

### Localisation du bouton

Le bouton de toggle du thème se trouve dans le **dropdown menu** du profil utilisateur dans la sidebar :
- Cliquer sur les **3 points** à droite du profil dans la sidebar
- Sélectionner "Dark mode" ou "Light mode" selon le thème actuel

### Structure des fichiers

```
src/
├── context/
│   └── ThemeContext.jsx          # Provider utilisant next-themes
├── components/
│   ├── ThemeToggle.jsx           # Composants de toggle (bouton et menu item)
│   └── DashboardSidebar.jsx      # Sidebar avec le toggle intégré
├── index.css                     # Variables CSS pour les thèmes
└── App.jsx                       # ThemeProvider wrapping l'app
```

### Utilisation dans d'autres composants

Pour utiliser le toggle du thème dans d'autres composants :

```jsx
import { ThemeToggleButton, ThemeToggleMenuItem } from '@/components/ThemeToggle'

// Pour un bouton simple
<ThemeToggleButton />

// Pour un élément de menu dropdown
<ThemeToggleMenuItem />
```

### Hook personnalisé

Vous pouvez également utiliser directement le hook de next-themes :

```jsx
import { useTheme } from 'next-themes'

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  )
}
```

### Personnalisation des couleurs

Les couleurs du thème sont définies dans `src/index.css` avec les variables CSS :
- `:root` pour le thème clair
- `.dark` pour le thème sombre

Toutes les variables suivent la convention shadcn/ui et sont automatiquement appliquées aux composants UI.
