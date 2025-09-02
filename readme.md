# Rogue AI Override Backend
> Backend pour le cours Android Kotlin de Damien Dabernat

## Serveur de production

Le serveur est déjà déployé et accessible à l'adresse :
**https://backend.rogueai.surpuissant.io/**

**Documentation** : https://backend.rogueai.surpuissant.io/

## Installation locale

### Prérequis
- [Node.js 22.13.1](https://nodejs.org/) (⚠️ utilise bien cette version pour éviter les soucis de compatibilité)
- [npm](https://www.npmjs.com/) (fourni avec Node.js)

> Ou sinon, utilisez [nvm](https://github.com/nvm-sh/nvm) (`brew install nvm` + `nvm use --lts`)

### Étapes

1. **Cloner le dépôt**
   ```bash
   https://github.com/Surpuissant/rogue-ai-override-backend.git
   cd rogue-ai-override-backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur en développement**
   ```bash
   npm run dev 
   # Ou le lancer sans hot reload : npm run start
   ```

---

### Tests

Lancer la suite de tests :

```bash
npm run test
```
