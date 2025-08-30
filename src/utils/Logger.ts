import * as fs from "fs";
import * as path from "path";
import Table from "cli-table3";

export class Logger {
    private static logDir: string = "logs";
    private static logFile: string = Logger.initLogFile();

    private static initLogFile(): string {
        if (!fs.existsSync(Logger.logDir)) {
            fs.mkdirSync(Logger.logDir, { recursive: true });
        }

        const today = new Date().toISOString().split("T")[0];
        return path.join(Logger.logDir, `${today}.log`);
    }

    private static writeLog(level: string, message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}\n`;

        fs.appendFileSync(Logger.logFile, logMessage, { encoding: "utf8" });
    }

    static info(message: string) {
        console.log(message)
        Logger.writeLog("INFO", message);
    }

    static warn(message: string) {
        console.warn(message)
        Logger.writeLog("WARN", message);
    }

    static error(message: string) {
        console.error(message)
        Logger.writeLog("ERROR", message);
    }

    static infoTable(headers: string[], contents: string[][]) {
        const table = new Table({
            head: headers,
            wordWrap: true
        });

        contents.forEach(content => {
            table.push(content);
        })

        console.log(table.toString());
        Logger.writeLog("INFO", table.toString());
    }
}

export interface TableInformation {
    headers: string[];
    contents: string[];
}
