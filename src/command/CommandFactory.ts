import { Command } from "./Command";
import { ToggleCommand } from "./ToggleCommand";

export class CommandFactory {
    public static getRandomCommand(exceptIds: string[] = []): Command {
        const commands = [
            new ToggleCommand("Filtre d'hallucination", "hallucination_filter"),
            new ToggleCommand("Mode créativité", "creative_mode"),
            new ToggleCommand("Surveillance des biais", "bias_monitoring"),
            new ToggleCommand("Optimisation des hyperparamètres", "hyperparameter_optimization"),
            new ToggleCommand("Détection d’anomalies", "anomaly_detection"),
            new ToggleCommand("Réponse probabiliste", "probabilistic_response"),
            new ToggleCommand("Génération sécurisée", "safe_generation"),
            new ToggleCommand("Analyse contextuelle", "context_analysis"),
            new ToggleCommand("Filtrage de contenu sensible", "sensitive_content_filter"),
            new ToggleCommand("Mode apprentissage", "learning_mode"),
            new ToggleCommand("Débogage avancé", "advanced_debug"),
            new ToggleCommand("Contrôle de cohérence", "consistency_check"),
            new ToggleCommand("Optimisation mémoire", "memory_optimization"),
            new ToggleCommand("Mode expérimental", "experimental_mode"),
            new ToggleCommand("Validation sémantique", "semantic_validation"),
            new ToggleCommand("Traitement multilingue", "multilingual_processing"),
            new ToggleCommand("Génération adaptative", "adaptive_generation"),
            new ToggleCommand("Contrôle de température", "temperature_control"),
            new ToggleCommand("Mode introspection", "introspection_mode"),
            new ToggleCommand("Filtrage éthique", "ethical_filtering"),
            new ToggleCommand("Analyse de sentiment", "sentiment_analysis"),
            new ToggleCommand("Optimisation de tokens", "token_optimization"),
            new ToggleCommand("Mode collaboratif", "collaborative_mode"),
            new ToggleCommand("Détection de plagiat", "plagiarism_detection"),
            new ToggleCommand("Amélioration continue", "continuous_improvement"),
            new ToggleCommand("Validation croisée", "cross_validation"),
            new ToggleCommand("Mode économie d'énergie", "energy_saving_mode"),
            new ToggleCommand("Surveillance qualité", "quality_monitoring"),
            new ToggleCommand("Génération structurée", "structured_generation"),
            new ToggleCommand("Mode réflexif", "reflective_mode"),
            new ToggleCommand("Contrôle de diversité", "diversity_control"),
            new ToggleCommand("Optimisation latence", "latency_optimization"),
            new ToggleCommand("Mode robustesse", "robustness_mode"),
            new ToggleCommand("Analyse prédictive", "predictive_analysis"),
            new ToggleCommand("Filtrage temporel", "temporal_filtering"),
            new ToggleCommand("Mode adaptatif", "adaptive_mode"),
            new ToggleCommand("Contrôle de pertinence", "relevance_control"),
            new ToggleCommand("Génération personnalisée", "personalized_generation"),
            new ToggleCommand("Mode transparence", "transparency_mode")
        ];

        const filteredCommands = commands.filter(cmd => !exceptIds.includes(cmd.id));

        if (filteredCommands.length === 0) {
            throw new Error("Aucune commande disponible, tous les IDs sont exclus !");
        }

        const index = Math.floor(Math.random() * filteredCommands.length);
        return filteredCommands[index];
    }
}