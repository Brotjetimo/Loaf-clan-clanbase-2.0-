import Colors from "./types/colors";

class Logger {
    private typeName: string;

    constructor(typeName: string) {
        if (typeName == undefined || typeName == "") {
            console.error("Logger didn't get a type name as a string");
            process.exit();
        }
        this.typeName = typeName;
    }

    private log(messageType: string, message: string) {
        const result = `[${messageType} - ${this.typeName} - ${this.getTime()}]: ${message}`;

        switch (messageType) {
            case "ERROR":
                console.error(Colors.FAIL + result + Colors.ENDC)
                break;
            case "INFO":
                console.info(Colors.OKBLUE + result + Colors.ENDC);
                break;
            case "DEBUG":
                console.debug(Colors.OKGREEN + result + Colors.ENDC);
                break;
            case "WARNING":
                console.warn(Colors.WARNING + result + Colors.ENDC);
                break;
            default:
                console.log(Colors.OKCYAN + result + Colors.ENDC);
                break;
        }
    }

    public warning(message: string) {
        this.log("WARNING", message);
    }

    public error(message: string) {
        this.log("ERROR", message);
    }

    public info(message: string) {
        this.log("INFO", message)
    }

    public debug(message: string) {
        if (process.env.DEBUG == "true") {
            this.log("DEBUG", message);
        }
    }

    private getTime(): string {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return `${date} ${time}`;
    }

}

export default Logger;