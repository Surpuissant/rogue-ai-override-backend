# Rogue AI Override — Cahier des charges — (MVP)

Le barème de notation est disponible sur [docs/notes](../docs/notes).

## 1) Présentation & pitch

Rogue AI Override — Shout orders. Save the world est un jeu sur Android, multijoueur (2–6 joueurs).

**Pitch**
Vous êtes une équipe tentant d’empêcher une IA centrale de dominer le monde. Chacun reçoit des **instructions** qu’il ne peut pas toujours exécuter seul : il doit **communiquer** pour qu’un autre exécute l’action au bon endroit, à temps et sans se tromper.

**Promesse**

* Parties rapides (\~45s), **coop**, gestion du stress et de l'organisation.
* Vocabulaire IA absurde, montée de tension et fun.

---

## 2) Déroulé du jeu (MVP)

Résumé :

* Chaque joueur a **1 instruction affichée** à l’écran, avec un délai pour la réaliser.
* Chaque joueur voit sur son écran **4 panneaux de contrôle** contenant des commandes aléatoires.
* Ces panneaux sont **fixes** pour toute la partie : un joueur garde toujours les mêmes contrôles.
* L’action peut être sur **son propre téléphone** ou sur celui d’un autre joueur.
* Les joueurs doivent exécuter l’instruction écrite sur leurs téléphones, mais ne savent pas qui peut l’exécuter : ils doivent **communiquer à voix haute** pour identifier le propriétaire du contrôle.
* Dès qu’une instruction est résolue (succès ou échec), le joueur en reçoit une nouvelle immédiatement.
* La jauge **DOMINATION MONDIALE (THREAT)** monte quand on rate, baisse légèrement quand on réussit.
* **THREAT initiale : `0.25`**.
* **Victoire** si l’équipe tient 180s sans atteindre `THREAT ≥ 1.0`.
* **Défaite** dès que `THREAT ≥ 1.0`.
* La difficulté augmente avec le temps : moins de temps pour exécuter une instruction.

L'amusement vient :

* De la difficulté à comprendre la commande à cause des noms invraisemblables.
* De la recherche du **propriétaire** du contrôle demandé et de la communication.
* De la gestion du stress due au **timer**.

MVP : **pas d’onboarding** ni de tuto. Ce MVP sert à valider si le jeu est drôle et à ajuster les règles.

---

## 3) Écrans

1. **Accueil** → **Créer une partie** (génère un code) ou **Rejoindre** (saisir le code).
2. **Lobby** : quand 2 à 6 joueurs sont présents, l’hôte peut lancer la partie.
3. **Distribution des contrôles** : chaque joueur reçoit 4 panneaux de contrôle **aléatoires, uniques et fixes** pour la partie.
4. **Début de partie** : le serveur envoie **1 instruction par joueur**.
5. **Pendant le jeu** :

    * Chaque joueur voit une **instruction** avec un compte à rebours.
    * Si l’action correcte est effectuée avant le délai → succès.
    * Sinon → échec (timeout).
    * Le joueur reçoit immédiatement une nouvelle instruction (`instructionInstanceId` différent).
6. **Fin** :

    * Victoire : chrono atteint 180s et `THREAT < 1.0`.
    * Défaite : `THREAT ≥ 1.0`.

---

## 4) Règles (variables et effets)

### 4.1 Joueurs

* Min : 2, Max : 6.

### 4.2 Menace (THREAT)

* Domaine : `0.0 … 1.0` (**initiale `0.25`**).
* **Réussite** : `THREAT = max(0, THREAT - 0.05)`.
* **Timeout** : `THREAT = min(1, THREAT + 0.08)`.
* **Mauvaise action** (voir définitions 4.5) :

    * Wrong target → `+0.05`
    * Right target, wrong params → `+0.03`
    * No matching active instruction → **ignoré** (option : `+0.01` si on veut punir le spam ; **désactivé par défaut** dans le MVP).

### 4.3 Délai par instruction

* Temps dispo réduit avec l’avancée de la partie :

    * `0–45s` : 20s
    * `45–90s` : 18s
    * `90–135s` : 16s
    * `135–180s` : 14s

* Réapprovisionnement immédiat après résolution (succès/échec).

### 4.4 Génération & validité d’une instruction

Le jeu possède un large catalogue d’instructions (> 60).

* Chaque instruction émise est une **instance unique** avec un **`instructionInstanceId`**.
* Elle référence un **`commandId`** (contrôle statique distribué à un joueur).
* **Invariant MVP : “at most one active instruction per `commandId`”** → réutilisation autorisée, **mais séquentielle** (pas de simultanéité sur le même `commandId`).
* Les commandes sont choisies uniquement parmi les panneaux fixes, jamais en double chez un même joueur.
* Un même `commandId` peut être réutilisé plusieurs fois (avec paramètres différents), sans ambiguïté grâce à `instructionInstanceId`.

### 4.5 États des commandes & “mauvaise action” (définitions MVP)

* **Serveur stateless** vis-à-vis des contrôles (pas de persistance d’état côté serveur).
* Une instruction attend un paramètre concret (`state`, `value`, etc.) si pertinent.
* **Définitions pour la pénalité** :

    * **Wrong target** : un joueur déclenche une action sur un `commandId` **différent** de celui requis par **l’instruction active** ciblée → `+0.05`.
    * **Right target, wrong params** : bon `commandId` mais **paramètre incorrect** vs. l’instruction → `+0.03`.
    * **No matching active instruction** : action reçue pour un `commandId` **sans instruction active** → **ignorée par défaut** (option `+0.01` si on veut punir le spam, non activée en MVP).
* **`toggle` vs serveur stateless** : le type `toggle` est **conservé** pour la **différence visuelle UI** ; côté serveur MVP, sa validation est **équivalente à un `button`** (action instantanée sans état persistant).

---

## 5) UX — premiers écrans

* **Accueil** : *Jouez ensemble. Survivez 3 minutes. Empêchez l’IA de dominer le monde.*
  Boutons : **Créer une partie** / **Rejoindre avec un code**
* **Créer** : affiche Code de partie
* **Rejoindre** : champ *Entrer le code* + bouton *Rejoindre*.
* **Lobby** : *Joueurs requis : 2–6*, liste des joueurs, bouton *Lancer la partie* (host uniquement).
* **In-game** : en-tête **THREAT (0–100%)** *(démarre à 25%)* + **chrono (180→0)**, zone **panneaux fixes**, zone **instruction active** avec compte à rebours.

---

## 6) JSON d’une action/commande (schéma et exemples)

### 6.1 Schéma (catalogue de commandes)

Chaque **commande** décrit **la façon de parler** à l’humain (instruction) **et** **le contrôle** affiché chez le propriétaire.

```json
{
  "id": "string-unique",
  "type": "button|switch|slider|toggle",
  "instruction": "Texte affiché à un joueur (peut contenir {placeholders})",
  "target": "Nom affiché sur le contrôle chez son propriétaire",
  "action": "Texte sur le bouton d'action si pertinent (ex: 'Activer')",
  "params": {
    "min": 0,
    "max": 10,
    "step": 1,
    "states": ["on", "off"],
    "values": [0, 1, 2]
  }
}
```

* **`instruction`** : phrase vue par un joueur. Elle peut contenir des **placeholders** (`{value}`, `{state}`, `{target}`) que le serveur remplira **à l’émission**.
* **`target`** : nom du **contrôle** visible **chez le propriétaire**.
* **`action`** : libellé éventuel sur un **bouton** (utile pour `button`/`toggle`).
* **`params`** : bornes/valeurs autorisées (slider) ou états (switch).

> **Réseau** : on utilise **l’`id`** de la commande comme **identifiant unique** de contrôle.
> Une instruction émise **= une instance** référencée par **`commandId`** + des **paramètres concrets** (ex: `{ "state": "on" }`, `{ "value": 7 }`) et surtout un **`instructionInstanceId`** unique.

### 6.2 Exemples — 3 par type (12 items)

#### A) `button` (action instantanée)

```json
{
  "id": "btn_001",
  "type": "button",
  "instruction": "Activer {target} immédiatement",
  "target": "Filtre d’hallucination",
  "action": "Activer"
}
```

#### B) `switch` (état ON/OFF)

```json
{
  "id": "swi_001",
  "type": "switch",
  "instruction": "Mettre {target} sur {state}",
  "target": "Canal de mémoire vectorielle",
  "params": { "states": ["on", "off"] }
}
```

#### C) `slider` (valeur numérique)

```json
{
  "id": "sld_001",
  "type": "slider",
  "instruction": "Régler {target} sur {value}",
  "target": "Taux d’inférence probabiliste",
  "params": { "min": 0, "max": 10, "step": 1 }
}
```

#### D) `toggle` (poussoir alterné – visuel côté UI)

```json
{
  "id": "tgl_001",
  "type": "toggle",
  "instruction": "Enclencher {target}",
  "target": "Déclencheur de singularité",
  "action": "Enclencher"
}
```

> À l’émission, le serveur **remplace** `{target}` et fixe, si nécessaire, un paramètre concret :
> `switch` → `{ "state": "on"|"off" }` ; `slider` → `{ "value": 7 }`.
> **MVP** : `toggle` est validé côté serveur comme une **action instantanée** (sans état).

---

## 7) Technologies

* **Back-end** : FastAPI (Python), WebSocket JSON, Uvicorn ; état en mémoire (MVP).
* **Front-end Android** : Kotlin, OkHttp WebSocket, UI Compose/Views.
* **Découverte** : Code de partie.
* **Persistance** : aucune (tout en RAM pendant la partie).

---

## 8) Workflow WebSocket

### 8.1 Distribution des panneaux

```json
{
  "type": "panel.assign",
  "playerId": "p_2",
  "controls": [
    { "id": "btn_001", "type": "button", "target": "Filtre d’hallucination" },
    { "id": "swi_001", "type": "switch", "target": "Canal de mémoire vectorielle" },
    { "id": "sld_001", "type": "slider", "target": "Taux d’inférence probabiliste", "params": { "min": 0, "max": 10, "step": 1 } },
    { "id": "tgl_001", "type": "toggle", "target": "Déclencheur de singularité" }
  ]
}
```

### 8.2 Instruction émise

```json
{
  "type": "instruction.issue",
  "instructionInstanceId": "inst_342c5f",
  "toPlayerId": "p_2",
  "commandId": "sld_001",
  "instruction": "Régler Taux d’inférence probabiliste sur 7",
  "deadlineMs": 20000,
  "params": { "value": 7 }
}
```

### 8.3 Commande exécutée

```json
{
  "type": "command.execute",
  "playerId": "p_4",
  "instructionInstanceId": "inst_342c5f",
  "commandId": "sld_001",
  "params": { "value": 7 }
}
```

### 8.4 Résultat

```json
{
  "type": "command.result",
  "ok": true,
  "commandId": "sld_001",
  "instructionInstanceId": "inst_342c5f",
  "byPlayerId": "p_4",
  "forPlayerId": "p_2",
  "threat": 0.27
}
```

### 8.5 Timeout

```json
{
  "type": "instruction.timeout",
  "commandId": "swi_001",
  "instructionInstanceId": "inst_763fa2",
  "forPlayerId": "p_3",
  "threat": 0.57
}
```

---

## 9) Règles d’équité & invariants (MVP)

* **Pas de duplication de contrôle** chez un même joueur.
* **Panneaux fixes** : chaque joueur garde les mêmes 4 contrôles pendant toute la partie.
* **Instructions toujours faisables** : générées uniquement sur des contrôles existants.
* **Au plus 1 instruction active par `commandId`** (réutilisation **séquentielle**).
* **Chaque joueur a toujours exactement 1 instruction active**.


