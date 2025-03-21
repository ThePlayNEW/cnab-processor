const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cnabParser = require('./services/cnabParser');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.post('/api/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        const cnabFile = req.files.file;
        const fileContent = cnabFile.data.toString('utf8');

        const transactions = cnabParser.parseContent(fileContent);

        await db.saveTransactions(transactions);

        return res.status(200).json({
            message: 'Arquivo processado com sucesso',
            count: transactions.length
        });
    } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        return res.status(500).json({ error: 'Erro ao processar o arquivo' });
    }
});

app.get('/api/stores', async (req, res) => {
    try {
        const transactions = await db.getAllTransactions();
        const storesData = cnabParser.groupByStore(transactions);

        return res.status(200).json(storesData);
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return res.status(500).json({ error: 'Erro ao obter dados das lojas' });
    }
});

db.init()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Falha ao inicializar o banco de dados:', err);
        process.exit(1);
    });