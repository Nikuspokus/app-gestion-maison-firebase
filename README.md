# App Maison – Gestion de stock (Nuxt 3 + Pinia + Firebase)

MVP prêt à lancer : connexion Google, liste des articles, ajout/soustraction de quantités, upload d'image compressée côté client, sécurité Firestore par `familyId`.

## Démarrage

1. **Cloner et installer**

   ```bash
   pnpm i # ou npm i / yarn
   ```

2. **Config Firebase (Console > Project Settings > Web app)**  
   Crée une app Web et copie les variables dans `.env` (voir `.env.example`).

3. **Règles de sécurité**

   - Firestore Rules → coller le contenu de `firestore.rules`
   - Storage Rules → coller le contenu de `storage.rules`

4. **Lancer en local**

   ```bash
   pnpm dev
   ```

5. **Déployer**
   - **Vercel/Netlify**: expose les variables d'env `NUXT_PUBLIC_*` dans le dashboard.
   - **Firebase Hosting** (optionnel) : `firebase init hosting && nuxt generate && firebase deploy`

## Modèle de données

```
families/{familyId}/items/{itemId}
{
  name: string,
  quantity: number, // grammes ou unités
  unit: 'g' | 'unit',
  imageUrl?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  ownerUid: string,
  familyId: string
}
```

## Roadmap rapide

- [ ] Multi-utilisateur (invitation par email → même `familyId`)
- [ ] PWA + offline queue
- [ ] Détection nom via Vision API locale (tesseract.js) ou Cloud Vision
- [ ] Import tickets Drive/Docs

# app-gestion-maison-firebase

## API

- **Firebase Auth**: pour l'authentification (Google, email/password)
- **Firestore**: pour la base de données
- **Firebase Storage**: pour le stockage des images
- **Recipes**:https://spoonacular.com/food-api
