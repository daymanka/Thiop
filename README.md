# Food Delivery App - Documentation Technique

## Vue d'ensemble

Cette application de livraison de nourriture est développée avec Expo Router et React Native. Elle offre une expérience utilisateur complète pour commander de la nourriture, avec un support pour le mode sombre/clair et une architecture modulaire.

## Architecture du Projet

```
app/
├── _layout.tsx                # Layout racine avec Stack Navigator
├── (tabs)/                    # Navigation par onglets
│   ├── _layout.tsx           # Configuration des onglets
│   ├── index.tsx             # Page d'accueil
│   ├── search.tsx            # Recherche
│   ├── cart.tsx              # Panier
│   └── profile.tsx           # Profil utilisateur
├── +not-found.tsx            # Page 404
└── index.tsx                 # Redirection vers les onglets

components/
├── common/                    # Composants réutilisables
├── home/                     # Composants spécifiques à l'accueil
├── profile/                  # Composants du profil
└── search/                   # Composants de recherche

services/
├── api.ts                    # Service API principal
├── authService.ts            # Gestion de l'authentification
├── cartService.ts            # Gestion du panier
└── orderService.ts           # Gestion des commandes
```

## Fonctionnalités Principales

### Navigation
- Navigation par onglets avec 4 sections principales
- Support du thème sombre/clair automatique
- Navigation Stack pour les écrans détaillés

### Accueil (index.tsx)
- Liste des catégories de nourriture
- Section des plats mis en avant
- Liste des restaurants à proximité
- En-tête avec localisation

### Recherche (search.tsx)
- Barre de recherche avec debounce
- Filtres : cuisine, prix, régime alimentaire
- Résultats mixtes (restaurants et plats)

### Panier (cart.tsx)
- Gestion complète du panier
- Modification des quantités
- Calcul automatique des frais de livraison
- Résumé de la commande

### Profil (profile.tsx)
- Informations utilisateur
- Historique des commandes
- Paramètres du compte
- Gestion des notifications

## Services

### API (api.ts)
```typescript
// Configuration de base
const ODOO_API_BASE_URL = 'https://your-odoo-instance.com/api';

// Endpoints principaux
- fetchCategories()
- fetchFeaturedItems()
- fetchRestaurants()
- searchRestaurantsAndItems()
- fetchRestaurantDetails()
- fetchItemDetails()
```

### Authentication (authService.ts)
```typescript
// Fonctions principales
- login(email: string, password: string)
- register(userData: UserData)
- getCurrentUser()
- logout()
- refreshUserProfile()
```

### Cart (cartService.ts)
```typescript
// Fonctions principales
- getCart()
- addToCart(item, quantity, options)
- updateCartItem(itemId, quantity)
- removeCartItem(itemId)
- clearCart()
```

### Orders (orderService.ts)
```typescript
// Fonctions principales
- placeOrder(orderData)
- getOrder(orderId)
- getOrders(options)
- trackOrder(orderId)
- cancelOrder(orderId, reason)
```

## Styles et Thème

### Couleurs Principales
```typescript
const colors = {
  primary: '#FF6B35',
  background: {
    light: '#F8F9FA',
    dark: '#121212'
  },
  text: {
    light: '#333333',
    dark: '#FFFFFF'
  }
};
```

### Exemple de Style
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F8F9FA'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#333333'
  }
});
```

## Dépendances Clés

```json
{
  "expo": "^53.0.0",
  "expo-router": "~5.0.2",
  "react-native": "0.79.1",
  "lucide-react-native": "^0.475.0",
  "@expo/vector-icons": "^14.1.0",
  "react-native-reanimated": "~3.17.4"
}
```

## Guide de Développement

### Installation
```bash
npm install
```

### Démarrage
```bash
npm run dev
```

### Build Web
```bash
npm run build:web
```

### Lint
```bash
npm run lint
```

## Bonnes Pratiques

### Gestion des États
- Utilisation de useState pour les états locaux
- useEffect pour les effets de bord
- Gestion des erreurs avec try/catch

### Composants
- Composants fonctionnels avec TypeScript
- Props typées et documentées
- Gestion du thème sombre/clair

### Performance
- Debounce sur la recherche
- Mise en cache des données
- Optimisation des images

### Sécurité
- Authentification sécurisée
- Stockage sécurisé des tokens
- Validation des données

## Tests et Débogage

### Environnement de Test
- Mode développement avec mock data
- Simulation des réponses API
- Tests des différents états UI

### Débogage
- Console.log pour le développement
- Gestion des erreurs avec try/catch
- Validation des données d'entrée

## Déploiement

### Prérequis
- Node.js v14+
- npm ou yarn
- Expo CLI

### Étapes de Déploiement
1. Vérification des dépendances
2. Build de production
3. Tests de régression
4. Déploiement sur les stores

## Maintenance

### Mises à Jour
- Vérification régulière des dépendances
- Application des correctifs de sécurité
- Optimisation des performances

### Monitoring
- Suivi des erreurs
- Analyse des performances
- Métriques utilisateur

## Support

Pour toute question ou problème :
- Consulter la documentation
- Vérifier les issues GitHub
- Contacter l'équipe de développement