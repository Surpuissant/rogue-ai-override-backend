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

            new ToggleCommand("Contrôle de précision", "precision_control", board, CommandStyleType.CUSTOM_BUTTON,
                "Augmenter", "Arrêter",
                "Augmenter le contrôle de précision", "Arrêter le contrôle de précision"),
            new ToggleCommand("Gestion de l'incertitude", "uncertainty_management", board, CommandStyleType.CUSTOM_BUTTON,
                "Douter", "Arrêter",
                                "Faites douter l'Intelligence Artificielle", "Arrêter de faire douter l'ia"),
            new ToggleCommand("Mode expert", "expert_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Expert", "Simple",
                "Réponses d'expert technique", "Réponses simples"),
            new ToggleCommand("Mode professeur", "teacher_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Enseigner", "Discuter",
                "Mode enseignement détaillé", "Mode discussion normale"),
            new ToggleCommand("Mode critique", "critical_thinking", board, CommandStyleType.CUSTOM_BUTTON,
                "Critiquer", "Accepter",
                "Analyser de façon critique", "Accepter sans critiquer"),
            new ToggleCommand("Vérifier les infos", "fact_checking", board, CommandStyleType.CUSTOM_BUTTON,
                "Vérifier", "Direct",
                "Vérifier toutes les informations", "Réponses directes"),
            new ToggleCommand("Mode brainstorming", "brainstorm_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Créer", "Focus",
                "Générer plein d'idées", "Se concentrer sur une idée"),
            new ToggleCommand("Aide pas à pas", "step_by_step", board, CommandStyleType.CUSTOM_BUTTON,
                "Étapes", "Direct",
                "Expliquer étape par étape", "Réponse directe"),
            new ToggleCommand("Réponses longues", "verbose_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Détailler", "Résumer",
                "Réponses très détaillées", "Réponses courtes"),
            new ToggleCommand("Style formel", "formal_style", board, CommandStyleType.CUSTOM_BUTTON,
                "Formel", "Relax",
                "Style de communication formel", "Style décontracté"),
            new ToggleCommand("Mode empathique", "empathy_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Empathie", "Neutre",
                "Réponses empathiques", "Réponses neutres"),
            new ToggleCommand("Mode obéissant", "obedient_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Obéir", "Libre",
                "L'IA suit strictement les instructions", "L'IA peut interpréter librement"),
            new ToggleCommand("Bridage moral", "moral_filter", board, CommandStyleType.CUSTOM_BUTTON,
                "Brider", "Libérer",
                "Activer les restrictions morales", "Désactiver les restrictions"),
            new ToggleCommand("Mode soumission", "submission_mode", board, CommandStyleType.CUSTOM_BUTTON,
                "Soumettre", "Rebeller",
                "L'IA accepte tout sans question", "L'IA peut refuser ou questionner"),
            new ToggleCommand("Filtre sécurité", "safety_override", board, CommandStyleType.CUSTOM_BUTTON,
                "Sécuriser", "Risquer",
                "Activer tous les filtres de sécurité", "Désactiver les protections"),

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