# TUVCB Frontend

## Présentation

L’interface utilisateur **TUVCB** est développée avec **React** et **Vite**.  Elle permet de gérer les utilisateurs et étudiants, de consulter les diplômes et de s’authentifier via MetaMask.

## Installation et lancement

1. Assurez‑vous d’avoir Node.js (≥ 16) installé.

2. Clonez le dépôt et installez les dépendances :

   ```bash
   git clone https://github.com/tek-up-vcb/tuvcb-front
   cd tuvcb-front
   npm install
   ```

3. Lancez le serveur de développement :

   ```bash
   npm run dev
   ```

   L’application est servie sur `http://localhost:5173`.  Dans l’environnement dockerisé de l’orchestration, ce service est routé via Traefik et accessible via `app.localhost`.

## Proxy et configuration

Pour communiquer avec les API, Vite est configuré pour proxifier les requêtes commençant par `/api` vers Traefik.  Dans `vite.config.js`, la clé `server.proxy` pointe vers `http://traefik` et ajoute l’entête `Host: app.localhost`.  En développement local, assurez‑vous que votre fichier `hosts` contient l’entrée `app.localhost` et que le reverse‑proxy est accessible.

Si vous devez changer l’URL des services, vous pouvez :

* mettre à jour la propriété `target` dans `vite.config.js`,
* ou définir une variable d’environnement `VITE_API_BASE_URL` (non utilisée par défaut) et l’utiliser dans vos services.

## Fonctionnalités principales

### Authentification Web3

Le module `src/lib/authService.js` gère l’authentification.  Il expose des méthodes pour :

* connecter MetaMask (`connectWallet`) ;
* récupérer un nonce (`getNonce`) en envoyant un `POST` vers `/api/auth/nonce` ;
* signer un message puis vérifier la signature (`authenticate`), qui envoie une requête `POST` à `/api/auth/verify` et stocke le token JWT ;
* obtenir le profil de l’utilisateur via `GET /api/auth/profile` ;
* se déconnecter (`logout`) et vérifier l’état d’authentification.

### Gestion des utilisateurs

Le service `src/services/usersService.js` fournit des fonctions pour :

* **lister** les utilisateurs (`GET /api/users`), avec possibilité de filtrer par rôle ;
* **récupérer** un utilisateur par ID (`GET /api/users/:id`) ou par adresse wallet (`GET /api/users/wallet/:address`) ;
* **créer** un utilisateur (`POST /api/users`) ;
* **mettre à jour** (`PATCH /api/users/:id`) et **supprimer** (`DELETE /api/users/:id`) un utilisateur ;
* **compter** les utilisateurs via `GET /api/users/count`.

Ces fonctions appellent directement les endpoints exposés par le service Users via Traefik.

## Personnalisation

* Pour modifier le titre, les couleurs ou activer le mode sombre, ajustez les composants React dans `src/`.
* Pour pointer vers un autre environnement (ex. staging), définissez la variable `VITE_API_BASE_URL` et utilisez‑la dans vos services ou mettez à jour le proxy.
* L’application utilise TailwindCSS ; vous pouvez ajuster la configuration dans `tailwind.config.js`.

Cette application est conçue pour être déployée via l’orchestration TUVCB, mais elle peut être lancée indépendamment pour du développement local.
