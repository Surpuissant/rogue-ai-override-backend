import { Command, CommandConstructor } from "../Command";
import { ToggleCommand } from "../ToggleCommand";
import { SliderCommand } from "../SliderCommand";
import { Logger } from "../../utils/Logger";

export class CommandFactory {
    public static getRandomCommand(exceptIds: string[] = [], onlyCommandType: CommandConstructor | null): Command {
        Logger.info(onlyCommandType!.toString());
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
            new ToggleCommand("Mode transparence", "transparency_mode"),

            new SliderCommand("Volume hallucinations", "volume_hallucinations", 10),
            new SliderCommand("Intensité créativité", "intensity_creativity", 5),
            new SliderCommand("Seuil anomalies", "anomaly_threshold", 8),
            new SliderCommand("Précision prédictive", "predictive_accuracy", 7),
            new SliderCommand("Température génération", "generation_temperature", 10),
            new SliderCommand("Vitesse de traitement", "processing_speed", 6),
            new SliderCommand("Utilisation CPU", "cpu_usage", 4),
            new SliderCommand("Consommation mémoire", "memory_consumption", 8),
            new SliderCommand("Bande passante réseau", "network_bandwidth", 7),
            new SliderCommand("Taux de compression", "compression_rate", 5),
            new SliderCommand("Latence réponse", "response_latency", 3),
            new SliderCommand("Débit données", "data_throughput", 9),
            new SliderCommand("Cache hit ratio", "cache_hit_ratio", 8),
            new SliderCommand("Diversité lexicale", "lexical_diversity", 6),
            new SliderCommand("Complexité syntaxique", "syntactic_complexity", 5),
            new SliderCommand("Profondeur analyse", "analysis_depth", 8),
            new SliderCommand("Originalité contenu", "content_originality", 7),
            new SliderCommand("Richesse sémantique", "semantic_richness", 6),
            new SliderCommand("Variabilité stylitique", "stylistic_variability", 5),
            new SliderCommand("Densité informationnelle", "information_density", 8),
            new SliderCommand("Fluidité narrative", "narrative_fluidity", 7),
            new SliderCommand("Parallélisation", "parallelization_level", 8),
            new SliderCommand("Vectorisation", "vectorization_factor", 7),
            new SliderCommand("Pipeline efficacité", "pipeline_efficiency", 9),
            new SliderCommand("Load balancing", "load_balancing", 6),
            new SliderCommand("Auto-scaling", "auto_scaling", 5),
            new SliderCommand("Resource pooling", "resource_pooling", 7),
            new SliderCommand("Garbage collection", "garbage_collection", 4),
            new SliderCommand("Thread management", "thread_management", 8)
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