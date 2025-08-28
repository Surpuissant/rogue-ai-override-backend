import {Command} from "./Command";
import {ToggleCommand} from "./ToggleCommand";

export class CommandFactory {
    public static getRandomCommand(): Command {
        const commands = [
            new ToggleCommand("Filtre d'hallucination"),
            new ToggleCommand("Mode créativité"),
            new ToggleCommand("Surveillance des biais"),
            new ToggleCommand("Optimisation des hyperparamètres"),
            new ToggleCommand("Détection d’anomalies"),
            new ToggleCommand("Réponse probabiliste"),
            new ToggleCommand("Génération sécurisée")
        ];

        const index = Math.floor(Math.random() * commands.length);
        return commands[index];
    }
}