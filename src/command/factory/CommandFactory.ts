import { Command } from "../Command";
import { ToggleCommand } from "../ToggleCommand";
import { SliderCommand } from "../SliderCommand";
import { CommandStyleType } from "../CommandStyleType";
import { ConstructorType } from "../../utils/ConstructorType";
import {CommandBoard} from "../board/CommandBoard";

export class CommandFactory {
    public static getRandomCommand(exceptIds: string[] = [], board: CommandBoard, onlyCommandType: ConstructorType | null): Command {
        const commands = [
            new ToggleCommand("Validation des sources", "source_validation", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Mode debug", "debug_mode", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Compression de données", "data_compression", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Cache intelligent", "smart_cache", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Mode performance", "performance_mode", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Vérification de cohérence", "consistency_check", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Auto-correction", "auto_correction", board, CommandStyleType.ON_OFF_BUTTON),
            new ToggleCommand("Mode économie d'énergie", "power_save_mode", board, CommandStyleType.ON_OFF_BUTTON),

            new ToggleCommand("Mémorisation adaptative", "adaptive_memory", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Personnalisation avancée", "advanced_personalization", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Détection de patterns", "pattern_detection", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Mode multi-langues", "multilingual_mode", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Analyse sémantique", "semantic_analysis", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Optimisation continue", "continuous_optimization", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Traçabilité des décisions", "decision_traceability", board, CommandStyleType.TOGGLE),
            new ToggleCommand("Mode adaptatif", "adaptive_mode", board, CommandStyleType.TOGGLE),

            new ToggleCommand("Contrôle de précision", "precision_control", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Mode exploration", "exploration_mode", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Gestion de l'incertitude", "uncertainty_management", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Synthèse intelligente", "smart_synthesis", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Mode réflexif", "reflective_mode", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Optimisation contextuelle", "contextual_optimization", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Analyse comportementale", "behavioral_analysis", board, CommandStyleType.LEVER_BUTTON),
            new ToggleCommand("Mode adaptatif avancé", "advanced_adaptive_mode", board, CommandStyleType.LEVER_BUTTON),

            new SliderCommand("Volume hallucinations", "volume_hallucinations", 10, board, CommandStyleType.SLIDER),
            new SliderCommand("Intensité créativité", "intensity_creativity", 5, board, CommandStyleType.SLIDER),
            new SliderCommand("Seuil anomalies", "anomaly_threshold", 8, board, CommandStyleType.SLIDER),
            new SliderCommand("Précision prédictive", "predictive_accuracy", 7, board, CommandStyleType.SLIDER),
            new SliderCommand("Température génération", "generation_temperature", 10, board, CommandStyleType.SLIDER),
            new SliderCommand("Vitesse de traitement", "processing_speed", 6, board, CommandStyleType.SLIDER),
            new SliderCommand("Utilisation CPU", "cpu_usage", 4, board, CommandStyleType.SLIDER),
            new SliderCommand("Consommation mémoire", "memory_consumption", 8, board, CommandStyleType.SLIDER),
            new SliderCommand("Bande passante réseau", "network_bandwidth", 7, board, CommandStyleType.SLIDER),
            new SliderCommand("Taux de compression", "compression_rate", 5, board, CommandStyleType.SLIDER),
            new SliderCommand("Latence réponse", "response_latency", 3, board, CommandStyleType.SLIDER),
            new SliderCommand("Niveau de confiance", "confidence_level", 8, board, CommandStyleType.SLIDER),
            new SliderCommand("Profondeur d'analyse", "analysis_depth", 6, board, CommandStyleType.SLIDER),
            new SliderCommand("Sensibilité détection", "detection_sensitivity", 7, board, CommandStyleType.SLIDER),
            new SliderCommand("Granularité filtrage", "filtering_granularity", 5, board, CommandStyleType.SLIDER),
            new SliderCommand("Rigidité validation", "validation_strictness", 9, board, CommandStyleType.SLIDER),
            new SliderCommand("Niveau sécurité", "security_level", 10, board, CommandStyleType.SLIDER),
            new SliderCommand("Tolérance erreurs", "error_tolerance", 3, board, CommandStyleType.SLIDER),
            new SliderCommand("Seuil alerte", "alert_threshold", 8, board, CommandStyleType.SLIDER),
            new SliderCommand("Intensité monitoring", "monitoring_intensity", 7, board, CommandStyleType.SLIDER),
            new SliderCommand("Fréquence backup", "backup_frequency", 4, board, CommandStyleType.SLIDER),
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