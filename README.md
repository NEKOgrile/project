# FutureApp - Application de Calendrier Collaboratif

## 📋 Présentation du projet

FutureApp est une application web moderne permettant aux utilisateurs de sélectionner leurs créneaux de disponibilité dans un calendrier partagé. L'application offre une interface intuitive avec des fonctionnalités avancées de filtrage et de visualisation.

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte Supabase (pour la base de données)

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd futureapp

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

### Configuration
1. Créer un projet Supabase
2. Configurer les variables dans `src/supabase.ts`
3. Créer la table `users` avec les colonnes appropriées

## 📁 Structure des dossiers

```
src/
├── components/
│   ├── auth/                 # Composants d'authentification
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/            # Composants du tableau de bord
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── CalendarView.tsx
│   │   ├── StatsPanel.tsx
│   │   └── FilterView.tsx
│   ├── profile/              # Gestion du profil
│   │   └── ProfilePage.tsx
│   ├── settings/             # Paramètres
│   │   └── SettingsPage.tsx
│   └── ui/                   # Composants UI réutilisables
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── contexts/                 # Contextes React
│   └── UsersContext.tsx
├── types/                    # Types TypeScript
│   └── index.ts
├── utils/                    # Utilitaires
│   ├── calendar.ts
│   ├── cn.ts
│   ├── storage.ts
│   └── translations.ts
├── supabase.ts              # Configuration Supabase
├── App.tsx                  # Composant principal
├── main.tsx                 # Point d'entrée
└── index.css               # Styles globaux
```

## 🛠 Technologies utilisées

### Frontend
- **React 18** - Framework JavaScript
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes
- **Vite** - Bundler et serveur de développement

### Backend & Base de données
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de données relationnelle

### Outils de développement
- **ESLint** - Linting JavaScript/TypeScript
- **PostCSS** - Traitement CSS
- **Autoprefixer** - Préfixes CSS automatiques

## ✨ Fonctionnalités principales

### 🔐 Authentification
- Inscription et connexion utilisateur
- Gestion des profils utilisateur
- Changement de mot de passe
- Suppression de compte

### 📅 Calendrier collaboratif
- Sélection de créneaux de disponibilité
- Visualisation des sélections de tous les utilisateurs
- Navigation mensuelle
- Mise en évidence de la date la plus populaire (orange)
- Interface responsive mobile-first

### 🎯 Filtrage avancé
- Filtrage par utilisateur
- Sélection/désélection rapide
- Sauvegarde des préférences de filtre
- Interface dédiée accessible via le menu

### 📊 Statistiques
- Nombre d'utilisateurs actifs
- Total des sélections
- Classement par activité
- Synchronisation en temps réel

### ⚙️ Paramètres
- Choix de thème (Nuit bleue / Anthracite)
- Interface multilingue (FR/EN)
- Sauvegarde automatique des préférences

## 📱 Design et Interface

### Couleurs principales
- **Bleu cyan** (#06B6D4) - Couleur principale
- **Teal** (#14B8A6) - Couleur secondaire
- **Orange** (#FF9800) - Mise en évidence (dates populaires)
- **Dégradés** - Bleu nuit vers gris anthracite

### Responsive Design
- **Mobile First** - Optimisé pour les écrans tactiles
- **Menu hamburger** - Navigation mobile intuitive
- **Cases tactiles** - Dimensionnées pour les doigts
- **Breakpoints** - sm (640px), md (768px), lg (1024px)

### Effets visuels
- **Glass morphism** - Arrière-plans semi-transparents
- **Transitions fluides** - 300ms pour tous les éléments
- **Ombres dynamiques** - Mise en valeur des éléments interactifs
- **Animations** - Fade-in, pulse, spin pour le feedback

## 🎨 Guide de style détaillé

### Composants visuels

#### Header (En-tête)
- **Position** : Fixe en haut
- **Hauteur** : 64px (mobile), 80px (desktop)
- **Background** : `bg-white/5 backdrop-blur-sm`
- **Bordure** : `border-b border-white/10`
- **Logo** : Carré 40x40px, dégradé cyan-teal, coin arrondi 8px
- **Menu hamburger** : Visible uniquement sur mobile (<1024px)

#### Sidebar (Menu latéral)
- **Largeur** : 256px (desktop), plein écran (mobile)
- **Background** : `bg-white/5 backdrop-blur-sm`
- **Animation** : Slide de gauche, 300ms ease
- **Items actifs** : Dégradé cyan/teal 20% opacity, bordure cyan 30%
- **Hover** : `bg-white/10`, transition 200ms

#### Calendar (Calendrier)
- **Grille** : 7 colonnes (jours de la semaine)
- **Cases** : 
  - Mobile : min-height 60px
  - Tablet : min-height 80px  
  - Desktop : min-height 100px
- **Bordures** : `border-white/20`, arrondi 12px
- **Date populaire** : 
  - Bordure : `ring-4 ring-orange-500`
  - Ombre : `shadow-lg shadow-orange-500/50`
  - Background : `bg-orange-500/10`
  - Icône : 🔥 emoji

#### Cards (Cartes)
- **Background** : `bg-white/10 backdrop-blur-sm`
- **Bordure** : `border border-white/20`
- **Arrondi** : 12px (mobile), 16px (desktop)
- **Padding** : 16px (mobile), 24px (desktop)
- **Hover** : `bg-white/15 border-white/30`

### Interactions mobiles

#### Touch targets (Zones tactiles)
- **Taille minimale** : 44x44px (recommandation Apple/Google)
- **Espacement** : 8px minimum entre éléments
- **Feedback** : Changement visuel immédiat (<100ms)

#### Long press (Appui prolongé)
- **Durée** : 500ms pour déclencher
- **Feedback** : Vibration légère (si supportée)
- **Modal** : Overlay plein écran, fond `bg-black/50`
- **Contenu** : Centré, max-width 320px

#### Swipe gestures
- **Navigation** : Swipe horizontal pour changer de mois
- **Seuil** : 50px minimum de déplacement
- **Vélocité** : 0.3px/ms minimum

### Animations et transitions

#### Micro-interactions
- **Hover** : `transition-all duration-200`
- **Focus** : Ring 2px, couleur cyan-500
- **Active** : Scale 0.98, durée 100ms
- **Loading** : Spin animation, 1s linear infinite

#### Page transitions
- **Fade in** : Opacity 0→1, translateY 10px→0, 300ms ease-out
- **Slide** : TranslateX -100%→0, 300ms ease
- **Modal** : Scale 0.9→1, opacity 0→1, 200ms ease

### Typographie

#### Hiérarchie
- **H1** : 2.25rem (36px), font-bold, line-height 1.2
- **H2** : 1.875rem (30px), font-semibold, line-height 1.3
- **H3** : 1.5rem (24px), font-medium, line-height 1.4
- **Body** : 1rem (16px), font-normal, line-height 1.5
- **Small** : 0.875rem (14px), line-height 1.4

#### Couleurs de texte
- **Principal** : `text-white` (100% opacity)
- **Secondaire** : `text-white/70` (70% opacity)
- **Tertiaire** : `text-white/50` (50% opacity)
- **Accent** : `text-cyan-400`, `text-teal-400`
- **Erreur** : `text-red-400`
- **Succès** : `text-green-400`

### Espacements (Système 8px)

#### Marges et paddings
- **xs** : 4px (0.25rem)
- **sm** : 8px (0.5rem)
- **md** : 16px (1rem)
- **lg** : 24px (1.5rem)
- **xl** : 32px (2rem)
- **2xl** : 48px (3rem)

#### Grilles et layouts
- **Gap** : 16px (mobile), 24px (desktop)
- **Container** : max-width 1200px, centré
- **Sidebar** : 256px fixe (desktop)
- **Content** : flex-1, overflow-auto

## 🔧 Fonctionnalités techniques

### Gestion d'état
- **Local State** : useState pour les composants
- **Global State** : Context API pour les utilisateurs
- **Persistence** : localStorage pour les préférences
- **Synchronisation** : Polling toutes les 10 secondes

### Performance
- **Code splitting** : Lazy loading des composants
- **Memoization** : React.memo pour les composants lourds
- **Debouncing** : 300ms pour les recherches
- **Virtual scrolling** : Pour les longues listes

### Accessibilité
- **ARIA labels** : Sur tous les éléments interactifs
- **Focus management** : Navigation au clavier
- **Contrast ratio** : Minimum 4.5:1
- **Screen readers** : Textes alternatifs complets

### Sécurité
- **Input validation** : Côté client et serveur
- **XSS protection** : Échappement des données
- **CSRF tokens** : Pour les formulaires
- **Rate limiting** : Protection contre le spam

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement
- `VITE_SUPABASE_URL` - URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé publique Supabase

### Optimisations
- **Minification** : CSS et JavaScript
- **Compression** : Gzip/Brotli
- **Cache** : Headers appropriés
- **CDN** : Pour les assets statiques

## 📈 Monitoring et analytics

### Métriques importantes
- **Time to First Byte** (TTFB)
- **First Contentful Paint** (FCP)
- **Largest Contentful Paint** (LCP)
- **Cumulative Layout Shift** (CLS)

### Erreurs à surveiller
- **JavaScript errors** - Console logs
- **Network failures** - API calls
- **Performance issues** - Slow queries
- **User experience** - Bounce rate

---

## 🎯 Objectif de cette documentation

Cette documentation est conçue pour permettre à tout développeur de **recréer l'application à l'identique**, au pixel près, en suivant uniquement ces spécifications. Chaque élément visuel, chaque interaction, chaque animation est documentée avec précision pour garantir une reproduction fidèle de l'expérience utilisateur originale.

### Checklist de reproduction
- [ ] Interface identique sur mobile et desktop
- [ ] Couleurs exactes (bleu, teal, orange)
- [ ] Animations fluides (300ms transitions)
- [ ] Fonctionnalités complètes (auth, calendar, filters)
- [ ] Performance optimale (< 3s loading)
- [ ] Accessibilité respectée (WCAG 2.1)

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025