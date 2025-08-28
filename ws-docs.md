# Rogue AI Override Backend - WS Docs
> Malheureusement, il n'y a pas de docs swagger pour du websocket :/ voici donc un petit readme qui devrait vous aider à mieux comprendre comment communiqué avec le backend


## Scenario

> Pour expliquer le fonctionnement du WebSocket, on va plutot essayer de raconter chronologiquement ce qu'il se passe et comment ça se passe.

### Connect

Pour rejoindre une room simplement, il suffit (en websocket) de se connecter à l'url avec le room code en paramètre 
(room code précédemment récupéré via l'api rest à cette url en post : `https://backend.rogueai.surpuissant.io/create-room`, pour + d'infos, rendez vous sur [l'api docs](https://backend.rogueai.surpuissant.io/api-docs)) 
```
wss://backend.rogueai.surpuissant.io/?room=${roomCode}
```

### En salle d'attente

#### Lobby Waiting
Vous êtes maintenant connecté à une Room, et les messages que vous recevez vont ressemblez à ça :
```js
{
    type: "game_state",
    payload: { state: "lobby_waiting" }
}
```
> Vous recevrez un message de type game_state à chaque fois que l'état de la room sera update ou qu'un nouveau joueur rejoindra la partie
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
> Vous recevrez un message room_info à chaque fois qu'un joueur va se connecter ou est ready, les noms des joueurs sont attribués automatiquement

Cela veut dire que la room est en attente et donc, que vous attendez quelqu'un pour pouvoir lancer la room.
(Une partie ne peut pas se lancer à un seul joueur) Dans ce cas là, lancez un deuxième émulateur pour faire une deuxième connection.
(ou émuler là avec un script)

#### Lobby Ready

Une fois qu'un autre joueur rentre dans la room, vous recevrez un nouveau message :
```js
{
    type: "game_state",
    payload: { state: "lobby_ready" }
}
```
> /!\ lobby_ready ne veut pas dire que tout le lobby est ready, il veut simplement dire que tout les joueurs peuvent se 
> mettre en ready maintenant
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
> Vous recevez donc encore une fois les room_info

Maintenant c'est **aux joueurs** de déclarer si ils sont prêt ou non, pour ça, il suffit d'envoyer un message au websocket : 
```js
{ 
    type: "room", 
    payload: { ready: true } 
}
```
> /!\ Les messages envoyés à un websocket doivent être transformé en string, pour ça : https://kotlinlang.org/docs/serialization.html#serialize-and-deserialize-json devrait vous aider

#### Timer

Maintenant que tout les joueurs sont prêt, la partie va passer en état de timer.

```js
{
    type: "game_state",
    payload: { state: "timer_before_start", duration: 3000 }
}
```
> On reçoit donc ce message, par défaut la durée du timer est de 3 secondes (3000 millisecondes)
 
### Playing !

Maintenant, le timer est fini =), on peut donc commencé la partie.

```js
{
    type: "game_state", 
    payload: {
        state: "game_start", 
        start_threat: 30
    }
} 
```
> Nouvelle valeur, le threat, allant de 0 à 100 (pour un soucis de précision), à 100, la partie est perdue, mais si le threat est en dessous de 100 au bout de 90 secondes, c'est gagné !

En prime, on reçoit des informations sur le "board" qu'on a (ce qu'on va appelé board, c'est le tableau qui contient toutes les commandes qu'on peut faire)
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
                    actual_status: 'inactive',
                    action_possible: [ 'toggle' ]
                },
                {
                    id: 'sentiment_analysis',
                    name: 'Analyse de sentiment',
                    type: 'toggle',
                    actual_status: 'inactive',
                    action_possible: [ 'toggle' ]
                },
                {
                    id: 'compression_rate',
                    name: 'Taux de compression',
                    type: 'slider',
                    actual_status: '0',
                    action_possible: [ '1', '2', '3', '4', '5' ]
                },
                {
                    id: 'volume_hallucinations',
                    name: 'Volume hallucinations',
                    type: 'slider',
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

> Et donc ici, on a toutes les informations sur le board, les commandes qui nous sont disponible, notre instruction.
> 
> Petite précision : la Slider command gère dynamiquement les possibilités, ce qui veut dire que le composant devra s'adapter aux nombre de possibilités !

Et donc maintenant pour executer une action côté user, il suffit d'envoyer un message au websocket :

```js
{
    type: "execute_action",
    payload : {
        command_id: "cross_validation",
        action: "toggle"
    }
}
```

Ce qui va effectuer l'action, pour les Slider, c'est pareil : 

```js
{
    type: "execute_action",
    payload : {
        command_id: "volume_hallucinations",
        action: '10'
    }
}
```

Et donc une fois la partie terminée au bout des 90 secondes ou simplement si elle est perdue

### Partie terminée

Maintenant la partie est terminée on reçoit ça : 
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

> On reçoit aussi si la partie est gagnée ou perdue ! avec aussi une donnée intéressante, l'historique de try, possibilité donc de faire un peu de DataViz (un petit graph ?)

Après ça, tu peux renvoyer un message pour dire que tu es ready et la room se remettra à son state de ReadyState ou FullState ou WaitingState (en fonction du nombre du joueur présent)

## DISCLAIMER

Le serveur peut ne pas être parfait // manquer de features, toute PR sont les bienvenues