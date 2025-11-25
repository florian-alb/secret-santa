# Secret Santa App 🎅

Application Next.js pour organiser un Secret Santa avec tirage éphémère.

## Fonctionnalités

- **Inscription** : Les participants s'inscrivent avec leur nom et email.
- **Tirage au sort** : Algorithme de Fisher-Yates pour un mélange aléatoire et création d'une chaîne circulaire.
- **Emails** : Envoi immédiat des associations via Resend (rien n'est stocké).
- **Confidentialité** : Base de données utilisée uniquement comme "salle d'attente". Le résultat du tirage n'est jamais persisté.

## Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **DB** : Vercel Postgres (Prisma)
- **Email** : Resend
- **Styling** : Tailwind CSS

## Configuration Locale

1.  Cloner le repo.
2.  Installer les dépendances :
    ```bash
    pnpm install
    ```
3.  Créer un fichier `.env` à la racine (voir exemple ci-dessous) :

    ```env
    # Vercel Postgres
    POSTGRES_PRISMA_URL="votre_url_pooling"
    POSTGRES_URL_NON_POOLING="votre_url_directe"

    # Resend (Emails)
    RESEND_API_KEY="re_..."

    # Admin Access
    ADMIN_SECRET="secret-admin-password"
    ```

4.  Générer le client Prisma :
    ```bash
    pnpm dlx prisma generate
    ```

5.  Pousser le schéma (si vous avez une DB locale ou connectée) :
    ```bash
    pnpm dlx prisma db push
    ```

6.  Lancer le serveur de dev :
    ```bash
    pnpm dev
    ```

## Lancer le Tirage

Accédez à la page admin : `http://localhost:3000/admin/launch?secret=VOTRE_SECRET`

Cliquez sur le bouton rouge pour lancer le tirage et envoyer les emails.
