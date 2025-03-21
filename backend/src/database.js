const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.connection = null;
        this.config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'cnab_db',
            connectTimeout: 60000
        };
    }

    async init() {
        const maxRetries = 15;
        let retries = 0;
        let connected = false;

        while (!connected && retries < maxRetries) {
            try {
                console.log(`Tentativa ${retries + 1}/${maxRetries} de conexão ao banco de dados...`);
                
                const tempConnection = await mysql.createConnection({
                    host: this.config.host,
                    user: this.config.user,
                    password: this.config.password,
                    connectTimeout: this.config.connectTimeout
                });

                await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${this.config.database}`);
                await tempConnection.end();

                this.connection = await mysql.createConnection(this.config);
                
                await this.connection.query(`
                    CREATE TABLE IF NOT EXISTS transactions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    type INT NOT NULL,
                    type_description VARCHAR(50) NOT NULL,
                    nature VARCHAR(20) NOT NULL,
                    date DATE NOT NULL,
                    value DECIMAL(10, 2) NOT NULL,
                    signed_value DECIMAL(10, 2) NOT NULL,
                    cpf VARCHAR(15) NOT NULL,
                    card VARCHAR(20) NOT NULL,
                    time TIME NOT NULL,
                    store_owner VARCHAR(50) NOT NULL,
                    store_name VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                connected = true;
                console.log('Banco de dados inicializado com sucesso');
                return;
            } catch (error) {
                retries++;
                console.error(`Erro na tentativa ${retries}/${maxRetries}: ${error.message}`);
                
                if (retries >= maxRetries) {
                    console.error('Número máximo de tentativas alcançado. Falha na conexão com o banco de dados.');
                    throw error;
                }
                
                const waitTime = Math.min(1000 * Math.pow(1.5, retries), 30000);
                console.log(`Aguardando ${waitTime/1000} segundos antes da próxima tentativa...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    async saveTransactions(transactions) {
        try {
            await this.connection.beginTransaction();

            const query = `
                INSERT INTO transactions 
                (type, type_description, nature, date, value, signed_value, 
                cpf, card, time, store_owner, store_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            for (const transaction of transactions) {
                await this.connection.execute(query, [
                    transaction.type,
                    transaction.typeDescription,
                    transaction.nature,
                    transaction.date,
                    transaction.value,
                    transaction.signedValue,
                    transaction.cpf,
                    transaction.card,
                    transaction.time,
                    transaction.storeOwner,
                    transaction.storeName
                ]);
            }

            await this.connection.commit();
            console.log(`${transactions.length} transações salvas com sucesso`);
        } catch (error) {
            await this.connection.rollback();
            console.error('Erro ao salvar transações:', error);
            throw error;
        }
    }

    async getAllTransactions() {
        try {
            const [rows] = await this.connection.query(`
                SELECT 
                type,
                type_description AS typeDescription,
                nature,
                date,
                value,
                signed_value AS signedValue,
                cpf,
                card,
                time,
                store_owner AS storeOwner,
                store_name AS storeName
                FROM transactions
                ORDER BY date DESC, time DESC
            `);

            return rows.map(row => ({
                ...row,
                date: row.date.toISOString().split('T')[0]
            }));
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            throw error;
        }
    }
}

module.exports = new Database();