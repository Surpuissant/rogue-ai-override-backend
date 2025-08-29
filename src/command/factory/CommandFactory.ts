import { Command, CommandConstructor } from "../Command";
import { ToggleCommand } from "../ToggleCommand";
import { SliderCommand } from "../SliderCommand";
import { Logger } from "../../utils/Logger";
import { CommandStyleType } from "../CommandStyleType";

export class CommandFactory {
    public static getRandomCommand(exceptIds: string[] = [], onlyCommandType: CommandConstructor | null): Command {
        const commands = [
            new ToggleCommand("Filtre d'hallucination", "hallucination_filter", CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Mode créativité", "creative_mode", CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Surveillance des biais", "bias_monitoring", CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Optimisation des hyperparamètres", "hyperparameter_optimization", CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Détection d’anomalies", "anomaly_detection", CommandStyleType.ON_OFF_BUTTON),

            new ToggleCommand("Réponse probabiliste", "probabilistic_response", CommandStyleType.TOGGLE),
            new ToggleCommand("Génération sécurisée", "safe_generation", CommandStyleType.TOGGLE),
            new ToggleCommand("Analyse contextuelle", "context_analysis", CommandStyleType.TOGGLE),
            new ToggleCommand("Filtrage de contenu sensible", "sensitive_content_filter", CommandStyleType.TOGGLE),
            new ToggleCommand("Mode apprentissage", "learning_mode", CommandStyleType.TOGGLE),

            new ToggleCommand("Mode introspection", "introspection_mode", CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Contrôle de température", "temperature_control", CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Mode collaboratif", "collaborative_mode", CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Filtrage éthique", "ethical_filtering", CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Analyse prédictive", "predictive_analysis", CommandStyleType.LEVER_BUTTON),


            new SliderCommand("Volume hallucinations", "volume_hallucinations", 10, CommandStyleType.SLIDER),
            new SliderCommand("Intensité créativité", "intensity_creativity", 5, CommandStyleType.SLIDER),
            new SliderCommand("Seuil anomalies", "anomaly_threshold", 8, CommandStyleType.SLIDER),
            new SliderCommand("Précision prédictive", "predictive_accuracy", 7, CommandStyleType.SLIDER),
            new SliderCommand("Température génération", "generation_temperature", 10, CommandStyleType.SLIDER),
            new SliderCommand("Vitesse de traitement", "processing_speed", 6, CommandStyleType.SLIDER),
            new SliderCommand("Utilisation CPU", "cpu_usage", 4, CommandStyleType.SLIDER),
            new SliderCommand("Consommation mémoire", "memory_consumption", 8, CommandStyleType.SLIDER),
            new SliderCommand("Bande passante réseau", "network_bandwidth", 7, CommandStyleType.SLIDER),
            new SliderCommand("Taux de compression", "compression_rate", 5, CommandStyleType.SLIDER),
            new SliderCommand("Latence réponse", "response_latency", 3, CommandStyleType.SLIDER),
        ];

        let filteredCommands = commands.filter(cmd => !exceptIds.includes(cmd.id));
        if(onlyCommandType !== null) filteredCommands = filteredCommands.filter(cmd => cmd instanceof onlyCommandType);

        if (filteredCommands.length === 0) {
            throw new Error("Aucune commande disponible, tous les IDs sont exclus !");
        }

        const index = Math.floor(Math.random() * filteredCommands.length);
        return filteredCommands[index];
    }
}