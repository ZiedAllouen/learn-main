# Guide Utilisateur — BSMK

## Table des matières

1. [Accès au site](#1-accès-au-site)
2. [Créer un compte](#2-créer-un-compte)
3. [Espace artiste (VitrinArt)](#3-espace-artiste-vitrinart)
4. [Admin Dashboard](#4-admin-dashboard)
5. [Changer son mot de passe](#5-changer-son-mot-de-passe)
6. [Rôles et permissions](#6-rôles-et-permissions)

---

## 1. Accès au site

| Page | URL |
|------|-----|
| Site public | `http://localhost:9003` |
| Connexion | `http://localhost:9003/login` |
| Inscription | `http://localhost:9003/register` |
| Admin Dashboard | `http://localhost:9003/admin` |
| Espace éditeur | `http://localhost:9003/editor` |
| Espace artiste | `http://localhost:9003/artiste` |
| Mon profil | `http://localhost:9003/profil` |
| VitrinArt (annuaire) | `http://localhost:9003/vetrinart` |

---

## 2. Créer un compte

1. Aller sur `/register`
2. Remplir le formulaire : prénom, nom, email, mot de passe (min. 8 caractères)
3. Cliquer sur **"Créer un compte"**
4. Vous êtes automatiquement connecté

---

## 3. Espace artiste (VitrinArt)

### Créer son profil artiste

1. Se connecter avec un compte ayant le rôle **ARTIST**
2. Aller sur `/artiste`
3. Remplir les informations :
   - **Nom** (obligatoire)
   - **Bio**
   - **Déclaration artistique** (statement)
   - **Photo de profil**
   - **Couverture**
   - **Ville**
   - **Adresse**
   - **Site web**
   - **Instagram**
   - **Email de contact**
   - **Disciplines** (sélectionner dans la liste)
   - **Œuvres** (ajouter titre, description, images, année)
4. Cliquer sur **"Enregistrer"**

### Statut du profil

- **Brouillon** → Le profil est en attente de validation par un admin
- **Publié** → Le profil est visible sur `/vetrinart`
- **Archivé** → Le profil n'est plus visible

> Un admin doit publier votre profil avant qu'il n'apparaisse sur VitrinArt.

### Modifier son profil

1. Aller sur `/artiste`
2. Modifier les champs souhaités
3. Cliquer sur **"Enregistrer"**

---

## 4. Admin Dashboard

### Accès

Se connecter avec un compte **ADMIN**, puis aller sur `/admin`.

### Gestion des utilisateurs (onglet Utilisateurs)

- Voir la liste de tous les utilisateurs
- **Changer le rôle** : cliquer sur le badge de rôle (Admin, Éditeur, Artiste, Membre)
- **Rechercher** un utilisateur par nom/email
- **Filtrer** par rôle
- **Supprimer** un utilisateur

### Gestion des artistes (onglet Artistes)

- Voir tous les artistes avec leur statut
- **Publier / Déspublier** : cliquer sur le badge de statut (Brouillon ↔ Publié)
- **Mettre en avant** : cliquer sur l'étoile (☆ ↔ ★)
- **Supprimer** un artiste
- **Rechercher** par nom
- **Filtrer** par statut

### Gestion du contenu (onglets Articles, Événements, Programmes)

- Voir la liste du contenu
- **Créer** un nouvel élément : cliquer sur **"+ Nouveau"**
- **Éditer** : cliquer sur "Éditer" à côté d'un élément
- **Supprimer** : cliquer sur "Supprimer"
- Modifier le statut (Brouillon, Publié, Archivé)

### Gestion des demandes (onglet Demandes)

- Voir les demandes de contact reçues
- Traiter ou archiver les demandes

---

## 5. Changer son mot de passe

1. Se connecter
2. Aller sur `/profil` (lien dans le menu en haut à droite, cliquer sur l'avatar)
3. Remplir :
   - Mot de passe actuel
   - Nouveau mot de passe (min. 8 caractères)
   - Confirmer le nouveau mot de passe
4. Cliquer sur **"Modifier le mot de passe"**
5. Tous les autres appareils seront déconnectés (sécurité)

---

## 6. Rôles et permissions

| Rôle | Description | Accès |
|------|-------------|-------|
| **ADMIN** | Administrateur complet | Dashboard admin, gestion de tout le contenu et les utilisateurs |
| **EDITOR** | Éditeur de contenu | Créer/modifier articles, événements, programmes, artistes |
| **ARTIST** | Artiste inscrit | Créer et modifier son propre profil artiste |
| **USER** | Membre standard | Accès au site public, participer aux programmes |

---

## Informations techniques

- **Frontend** : Next.js 15 (React 19) — port `9003`
- **Backend** : NestJS 11 (API) — port `3001`
- **Base de données** : PostgreSQL 17 (port `5432`)
- **API** : `http://localhost:3001/api`

### Commandes utiles

```bash
# Lancer le serveur de développement
pnpm dev

# Build de production
pnpm build

# Base de données
docker compose up -d          # Lancer PostgreSQL
pnpm --filter @bsmk/db db:push  # Appliquer les migrations
pnpm --filter @bsmk/db db:seed  # Peupler la base (si disponible)
```
