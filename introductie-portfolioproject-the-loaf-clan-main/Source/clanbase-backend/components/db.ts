import Logger from "./logger";
import mysql from "mysql2/promise";

class DbConnect {
    private logger: Logger = new Logger("DbConnect");

    private dbName: string = import.meta.env.MYSQL_DBNAME || "";
    private sqlHost: string = import.meta.env.MYSQL_HOST || "";
    private dbUsername: string = import.meta.env.MYSQL_USERNAME || "";
    private dbPassword: string = import.meta.env.MYSQL_PASSWORD || "";
    private conn: mysql.Connection | null = null;

    // Verbinden met de database
    private async connect() {
        const mysqlCreds = {
            host: this.sqlHost,
            user: this.dbUsername,
            password: this.dbPassword,
            database: this.dbName,
        };

        this.logger.debug(`Database options: ${JSON.stringify(mysqlCreds)}`);

        this.conn = await mysql.createConnection(mysqlCreds);

        if (!this.conn) {
            this.logger.error("Could not connect");
            throw new Error("Could not connect");
        }
    }

    // Uitvoeren van een query zonder prepared statements
    public async query(sql: string, values?: any[]) {
        if (!this.conn) {
            await this.connect();
        }

        try {
            const [rows] = await this.conn!.query(sql, values);
            return rows;
        } catch (error) {
            this.logger.error(`Query error: ${error}`);
            throw error;
        }
    }

    // Uitvoeren van een query met prepared statements
    public async executeQuery(command: string, values: any[] = []) {
        if (!this.conn) {
            await this.connect();
        }

        // Controleer of het command niet-voorbereidbaar is
        const nonPreparedCommands = ["START TRANSACTION", "COMMIT", "ROLLBACK", "CREATE EVENT"];

        const isNonPreparedCommand = nonPreparedCommands.some(cmd => command.toUpperCase().startsWith(cmd));

        if (isNonPreparedCommand) {
            // Gebruik de query() methode voor niet-voorbereide statements
            return await this.query(command, values);
        } else {
            // Voor andere commands, gebruik prepared statements
            const prepared = await this.conn!.prepare(command);
            return await prepared.execute(values);
        }
    }
}

export default DbConnect;
