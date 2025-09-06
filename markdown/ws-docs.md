# Rogue AI Override Backend - WS Docs

## Base Docs

### Messages Reçus

Le WebSocket envoie plusieurs types de messages pour informer les clients de l'état du jeu et des actions possibles. Voici quelques exemples :

- **game_state** : Indique l'état actuel de la partie, comme "lobby_waiting", "lobby_ready", "timer_before_start", ou "game_start".
  ```js
  {
      type: "game_state",
      payload: { state: "lobby_waiting" }
  }
  ```

- **room_info** : Fournit des informations sur la salle, y compris les joueurs présents et leur état de préparation.
  ```js
  {
      type: 'room_info',
      payload: {
          you: { id: '...', name: '...', ready: false },
          players: [ { id: '...', name: '...', ready: false } ],
          room_state: 'ready',
          level: 1
      }
  }
  ```

- **player_board** : Détaille les commandes disponibles pour le joueur et l'instruction actuelle.
  ```js
  {
      type: 'player_board',
      payload: {
          board: { commands: [ /* ... */ ] },
          instruction: { /* ... */ },
          threat: 30
      }
  }
  ```

### Messages Envoyés

Les clients peuvent envoyer des messages pour interagir avec le jeu :

- **refreshName** : Pour update le nom du joueur (toujours sur une base aléatoire).
  ```js
  { 
      type: "refresh_name"
  }
  ```

- **room** : Pour indiquer que le joueur est prêt.
  ```js
  { 
      type: "room", 
      payload: { ready: true } 
  }
  ```

- **execute_action** : Pour exécuter une action spécifique sur une commande.
  ```js
  {
      type: "execute_action",
      payload : {
          command_id: "cross_validation",
          action: "toggle"
      }
  }
  ```
> Malheureusement, il n'y a pas de documentation Swagger pour le WebSocket. Voici donc un petit guide qui devrait vous aider à mieux comprendre comment communiquer avec le backend.


## Scenario

> Pour expliquer le fonctionnement du WebSocket, nous allons décrire chronologiquement ce qui se passe et comment cela se déroule.

### Connect

Pour rejoindre une salle, il suffit de se connecter à l'URL WebSocket avec le code de la salle en paramètre. 
Le code de la salle est préalablement récupéré via l'API REST à cette URL en POST : `https://backend.rogueai.surpuissant.io/create-room`. Pour plus d'informations, consultez la [documentation de l'API](https://backend.rogueai.surpuissant.io/api-docs).
```
wss://backend.rogueai.surpuissant.io/?room=${roomCode}
```

### En salle d'attente

#### Lobby Waiting
Vous êtes maintenant connecté à une salle, et les messages que vous recevez ressembleront à ceci :
```js
{
    type: "game_state",
    payload: { state: "lobby_waiting" }
}
```
> Vous recevrez un message de type `game_state` à chaque fois que l'état de la salle sera mis à jour ou qu'un nouveau joueur rejoindra la partie.
```js
{
    type: 'room_info',
    payload: {
        you: {
            id: '69c172f0-0c0e-464c-95cb-2a595d162f73',
            name: 'DigitalDemon',
            ready: false
        },
        players: [
            {
                id: '69c172f0-0c0e-464c-95cb-2a595d162f73',
                name: 'DigitalDemon',
                ready: false
            }
        ],
        room_state: 'ready'
    }
}
```
> Vous recevrez un message `room_info` à chaque fois qu'un joueur se connecte ou est prêt. Les noms des joueurs sont attribués automatiquement.

Cela signifie que la salle est en attente, et vous attendez quelqu'un pour pouvoir lancer la partie. 
(Une partie ne peut pas commencer avec un seul joueur.) Dans ce cas, lancez un deuxième émulateur pour établir une deuxième connexion, ou simulez-la avec un script.

#### Lobby Ready

Une fois qu'un autre joueur entre dans la salle, vous recevrez un nouveau message :
```js
{
    type: "game_state",
    payload: { state: "lobby_ready" }
}
```
> /!\ `lobby_ready` ne signifie pas que tous les joueurs sont prêts, mais simplement que tous les joueurs peuvent maintenant se déclarer prêts. Les messages "ready" sont principalement utiles lorsque vous êtes dans le lobby pour indiquer votre état de préparation.
```js 
{
    type: 'room_info',
    payload: {
        you: {
            id: '69c172f0-0c0e-464c-95cb-2a595d162f73',
            name: 'DigitalDemon',
            ready: false
        },
        players: [
            {
                id: '69c172f0-0c0e-464c-95cb-2a595d162f73',
                name: 'DigitalDemon',
                ready: false
            }, 
            {
                id: '2a595d16-0c0e-264c-95cb-2a595d162f73',
                name: 'OmegaLast',
                ready: false
            }
        ],
        room_state: 'ready'
    }
}
```
> Vous recevez donc encore une fois les "room_info". Ce message est envoyé chaque fois qu'un joueur se connecte ou se met "ready".

Maintenant, c'est **aux joueurs** de déclarer s'ils sont prêts ou non. Pour cela, il suffit d'envoyer un message au WebSocket : 
```js
{ 
    type: "room", 
    payload: { ready: true } 
}
```
> /!\ Les messages envoyés à un WebSocket doivent être transformés en chaîne de caractères. Pour cela, vous pouvez consulter : https://kotlinlang.org/docs/serialization.html#serialize-and-deserialize-json

#### Timer

Maintenant que tous les joueurs sont prêts, la partie va passer en état de minuterie.

```js
{
    type: "game_state",
    payload: { state: "timer_before_start", duration: 3000 }
}
```
> Vous recevrez ce message. Par défaut, la durée de la minuterie est de 3 secondes (3000 millisecondes).
 
### Playing !

Maintenant que la minuterie est terminée, vous pouvez commencer la partie.

```js
{
    type: "game_state", 
    payload: {
        state: "game_start", 
        start_threat: 50,
        game_duration: 45000
    }
} 
```
> Nouvelle valeur : la menace, allant de 0 à 100 (pour des raisons de précision). À 100, la partie est perdue, mais si la menace est en dessous de 100 après 90 secondes, c'est gagné ! Le "player_board" n'est reçu que lorsque vous êtes dans le "PlayingState" de la salle.

En prime, vous recevez des informations sur le "tableau" que vous avez (ce que nous appelons tableau, c'est le tableau qui contient toutes les commandes que vous pouvez exécuter).
```js 
{
    type: 'player_board',
    payload: {
        board: { 
            commands: [
                {
                    id: 'cross_validation',
                    name: 'Validation croisée',
                    type: 'toggle',
                    styleType: 'toggle',
                    actual_status: 'inactive',
                    action_possible: [ 'toggle' ]
                },
                {
                    id: 'sentiment_analysis',
                    name: 'Analyse de sentiment',
                    type: 'toggle',
                    styleType: 'lever_button',
                    actual_status: 'inactive',
                    action_possible: [ 'toggle' ]
                },
                {
                    id: 'compression_rate',
                    name: 'Taux de compression',
                    type: 'slider',
                    styleType: 'slider',
                    actual_status: '0',
                    action_possible: [ '1', '2', '3', '4', '5' ]
                },
                {
                    id: 'volume_hallucinations',
                    name: 'Volume hallucinations',
                    type: 'slider',
                    styleType: 'slider',
                    actual_status: '0',
                    action_possible: [
                        '1',  '2', '3',
                        '4',  '5', '6',
                        '7',  '8', '9',
                        '10'
                    ]
                }
            ] 
        },
        instruction: {
            command_id: 'hyperparameter_optimization',
            timeout: 15000,
            timestampCreation: 1756395867333,
            command_type: 'toggle',
            instruction_text: 'Activez le Optimisation des hyperparamètres',
            expected_status: 'active'
        },
        threat: 30
    }
}
```

> Ici, vous avez toutes les informations sur le tableau, les commandes disponibles, et votre instruction.
> 
> Petite précision : la commande Slider gère dynamiquement les possibilités, ce qui signifie que le composant devra s'adapter au nombre de possibilités !

Pour exécuter une action côté utilisateur, il suffit d'envoyer un message au WebSocket :

```js
{
    type: "execute_action",
    payload : {
        command_id: "cross_validation",
        action: "toggle"
    }
}
```

Cela exécutera l'action. Pour les commandes Slider, c'est pareil : 

```js
{
    type: "execute_action",
    payload : {
        command_id: "volume_hallucinations",
        action: '10'
    }
}
```

Une fois la partie terminée après 90 secondes ou si elle est perdue, vous recevrez :

### Partie terminée

Maintenant que la partie est terminée, vous recevrez ceci : 
```js
{
    type: "game_state",
    payload: {
        state: "end_state",
        win: true,
        tryHistory: [
            {
                "time": 2304,
                "player_id": "69c172f0-0c0e-464c-95cb-2a595d162f73",
                "success": false,
            }
        ]
    }
}
```

> Vous recevrez également l'information si la partie est gagnée ou perdue, ainsi qu'une donnée intéressante : l'historique des tentatives, ce qui permet de faire un peu de DataViz (un petit graphique ?).

Après cela, vous pouvez renvoyer un message pour indiquer que vous êtes prêt, et la salle reviendra à son état de ReadyState, FullState ou WaitingState (en fonction du nombre de joueurs présents).

## EDIT

Le serveur peut ne pas être parfait ou manquer de fonctionnalités. Toutes les PR sont les bienvenues.
