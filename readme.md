# Rogue AI Override Backend
> Backend pour le cours Android Kotlin de Damien Dabernat

## Serveur de production

Le serveur est déjà déployé et accessible à l'adresse :
**https://backend.rogueai.surpuissant.io/**

**Documentation de l'API REST** : https://backend.rogueai.surpuissant.io/api-docs

## Installation locale

### Prérequis
- [Node.js 22.13.1](https://nodejs.org/) (⚠️ utilise bien cette version pour éviter les soucis de compatibilité)
- [npm](https://www.npmjs.com/) (fourni avec Node.js)

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/<ton-org>/<ton-repo>.git
   cd <ton-repo>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur en développement**
   ```bash
   npm run start
   ```

---

### Tests

Lancer la suite de tests :

```bash
npm run test
```