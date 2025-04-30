# GuitarTuning Application

Bienvenue dans l'application GuitarTuning ! Une application web full-stack conçue pour [**Ajouter une courte description ici - ex : aider les musiciens à accorder leur guitare précisément**].

Ce projet est structuré avec un frontend React distinct et un backend Express, partageant certaines configurations et types via un dossier `shared`.

## Table des Matières

*   [Stack Technique](#stack-technique)
*   [Structure du Projet](#structure-du-projet)
*   [Prérequis](#prérequis)
*   [Installation Locale](#installation-locale)
*   [Configuration de la Base de Données](#configuration-de-la-base-de-données)
*   [Lancement en Développement](#lancement-en-développement)
*   [Build pour la Production](#build-pour-la-production)
*   [Déploiement (Exemple avec Render)](#déploiement-exemple-avec-render)
*   [Scripts NPM Disponibles](#scripts-npm-disponibles)

## Stack Technique

*   **Frontend (`client/`)**:
    *   Framework/Librairie : React
    *   Build Tool : Vite
    *   Langage : TypeScript
    *   Styling : Tailwind CSS
    *   Composants UI : Shadcn/ui (utilisant Radix UI)
    *   Gestion de Données/Cache : TanStack Query (@tanstack/react-query)
*   **Backend (`server/`)**:
    *   Framework : Express.js
    *   Langage : TypeScript (exécuté avec `tsx` en dev, compilé avec `esbuild` en prod)
    *   Authentification : Passport.js (probablement `passport-local` basé sur les dépendances)
    *   Base de Données ORM : Drizzle ORM
*   **Base de Données**:
    *   Système : PostgreSQL
    *   Client/Adaptateur : `@neondatabase/serverless` (suggère une compatibilité Neon)
*   **Partagé (`shared/`)**:
    *   Schéma de Base de Données (Drizzle)

## Structure du Projet

```plaintext
guitartuning/
├── client/                 # Code source du frontend React
│   ├── src/                # Fichiers source (composants, pages, hooks...)
│   └── index.html          # Point d'entrée HTML pour Vite
├── server/                 # Code source du backend Express
│   ├── index.ts            # Point d'entrée principal du serveur
│   ├── routes.ts           # Définition des routes de l'API
│   ├── storage.ts          # Logique liée au stockage (sessions, etc.?)
│   └── vite.ts             # Intégration du middleware Vite pour le développement
├── shared/                 # Code partagé entre client et serveur
│   └── schema.ts           # Définition du schéma de la base de données (Drizzle)
├── migrations/             # (Généré par Drizzle Kit) Migrations SQL
├── dist/                   # (Généré par `npm run build`) Fichiers de production
│   ├── public/             # Assets statiques du client buildé
│   └── index.js            # Code serveur compilé
├── .env.example            # Fichier d'exemple pour les variables d'environnement
├── .gitignore              # Fichiers et dossiers ignorés par Git
├── components.json         # Configuration pour Shadcn/ui CLI
├── drizzle.config.ts       # Configuration pour Drizzle Kit (migrations)
├── package.json            # Dépendances et scripts NPM
├── package-lock.json       # Versions exactes des dépendances
├── tailwind.config.ts      # Configuration Tailwind CSS
├── tsconfig.json           # Configuration TypeScript globale
└── vite.config.ts          # Configuration Vite (principalement pour le client)
```

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

*   [Node.js](https://nodejs.org/) (v18 LTS ou supérieur recommandé)
*   [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
*   [Git](https://git-scm.com/)
*   Accès à une instance PostgreSQL et son URL de connexion (`DATABASE_URL`).

## Installation Locale

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DU_REPO>
    cd guitartuning
    ```

2.  **Installer les dépendances :**
    Installe toutes les dépendances pour le client, le serveur et les outils de développement.
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement :**
    Copiez le fichier `.env.example` en `.env` et remplissez la variable `DATABASE_URL` avec l'URL de connexion de votre base de données PostgreSQL locale ou distante.
    ```bash
    cp .env.example .env
    # Ouvrez .env et modifiez DATABASE_URL
    ```
    Contenu attendu dans `.env` :
    ```dotenv
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    # Ajoutez d'autres variables si nécessaire (ex: SESSION_SECRET)
    ```
    **Important :** Assurez-vous que `.env` est listé dans votre fichier `.gitignore` pour ne pas commiter de secrets.

## Configuration de la Base de Données

Ce projet utilise Drizzle ORM et Drizzle Kit pour gérer le schéma de la base de données et les migrations.

1.  **Appliquer le schéma à la base de données :**
    Après avoir configuré votre `DATABASE_URL` dans le fichier `.env`, exécutez :
    ```bash
    npm run db:push
    ```
    Cette commande lit `shared/schema.ts` et met à jour la base de données pour correspondre au schéma. Elle est utile pour le développement ou la configuration initiale. Pour des migrations plus contrôlées en production, explorez les commandes de génération de migrations de Drizzle Kit.

## Lancement en Développement

Pour lancer l'application en mode développement local (avec rechargement à chaud pour le frontend et redémarrage pour le backend) :

```bash
npm run dev
```

Cela lance :
*   Le serveur backend Express via `tsx` (qui écoute généralement sur le port 5000 par défaut).
*   Le serveur de développement Vite qui sert le client React et se connecte au backend.

Ouvrez votre navigateur et allez à [http://localhost:5000](http://localhost:5000) (ou le port indiqué dans la console si différent).

## Build pour la Production

Pour créer une version optimisée de l'application pour la production :

```bash
npm run build
```

Cette commande effectue deux actions principales :
1.  Utilise Vite pour compiler et optimiser le code frontend (React) dans `dist/public/`.
2.  Utilise `esbuild` pour compiler le code backend TypeScript en JavaScript dans `dist/index.js`.

## Déploiement (Exemple avec Render)

Cette application est conçue pour être déployée sur des plateformes supportant Node.js, comme Render.

1.  **Créer une Base de Données PostgreSQL sur Render.**
2.  **Créer un "Web Service" sur Render :**
    *   Connectez votre dépôt Git.
    *   **Build Command :** `npm install && npm run build`
    *   **Start Command :** `npm run start`
    *   **Variables d'environnement requises :**
        *   `DATABASE_URL` : (Utilisez l'URL de connexion *interne* de votre DB Render).
        *   `NODE_ENV` : `production`
        *   `PORT` : Render fournit cette variable automatiquement. Le serveur est configuré pour l'utiliser.
        *   (Ajoutez d'autres secrets nécessaires, comme `SESSION_SECRET`).
3.  **Déployer :** Render lancera le build puis la commande de démarrage. Votre application sera disponible sur l'URL fournie par Render.
4.  **Migrations en Production :** Vous devrez exécuter `npm run db:push` (ou une stratégie de migration plus robuste) manuellement en pointant vers la base de données de production, ou l'intégrer prudemment dans votre processus de déploiement.

## Scripts NPM Disponibles

*   `npm run dev`: Lance le client et le serveur en mode développement.
*   `npm run build`: Construit le client et le serveur pour la production dans le dossier `dist/`.
*   `npm run start`: Lance le serveur de production depuis le dossier `dist/` (nécessite un `npm run build` préalable).
*   `npm run check`: Effectue une vérification des types TypeScript sur le projet.
*   `npm run db:push`: Pousse les changements du schéma Drizzle vers la base de données (utile en développement).
