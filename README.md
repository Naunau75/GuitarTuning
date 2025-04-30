# GuitarTuning App

Application web full-stack pour [Décrire brièvement l'objectif de l'application, ex: aider à accorder une guitare].

## Stack Technique

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Query
*   **Backend:** Node.js, Express, TypeScript, Passport.js
*   **Base de données:** PostgreSQL (via Drizzle ORM avec Neon)
*   **Outils:** `tsx` (pour le développement), `vite` (build client), `esbuild` (build serveur)

## Prérequis

*   Node.js (v18+ recommandé, v23 utilisée lors du développement initial mais pourrait causer des soucis - voir [lien vers discussion/issue si pertinent])
*   npm
*   Une instance PostgreSQL et sa `DATABASE_URL`. Vous pouvez utiliser [Neon](https://neon.tech/) ou une autre solution.

## Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DU_REPO>
    cd guitartuning
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configuration de l'environnement :**
    Créez un fichier `.env` à la racine du projet et ajoutez votre URL de base de données :
    ```dotenv
    DATABASE_URL="votre_url_postgresql_ici"
    ```
    *(Note: Assurez-vous que ce fichier est dans votre `.gitignore`)*

## Développement

1.  **Appliquer les migrations de base de données (si nécessaire) :**
    Si le schéma a changé ou pour la configuration initiale :
    ```bash
    npm run db:push
    ```
    *(Note: `drizzle-kit` utilise `process.env.DATABASE_URL` défini dans l'environnement ou via un fichier `.env`)*

2.  **Lancer le serveur de développement (Client + Serveur) :**
    ```bash
    npm run dev
    ```
    L'application devrait être accessible sur [http://localhost:5000](http://localhost:5000). Le serveur backend et le client frontend (via Vite) sont lancés avec cette commande.

## Build et Production

1.  **Construire l'application :**
    Cette commande compile le code TypeScript du serveur avec `esbuild` et construit le client React avec `vite`.
    ```bash
    npm run build
    ```
    Les fichiers de build seront placés dans le dossier `dist/`.

2.  **Lancer l'application en production :**
    Assurez-vous que la `DATABASE_URL` est disponible comme variable d'environnement sur votre serveur de production.
    ```bash
    npm run start
    ```
    Cette commande lance le serveur Node.js depuis les fichiers compilés dans `dist/`.

## Scripts disponibles

*   `npm run dev`: Lance l'application en mode développement.
*   `npm run build`: Construit l'application pour la production.
*   `npm run start`: Lance l'application en mode production (après `build`).
*   `npm run check`: Vérifie les types TypeScript.
*   `npm run db:push`: Applique les changements du schéma Drizzle à la base de données.

## Structure du Projet
