class CNABParser {
    constructor() {
        this.transactionTypes = {
            1: { description: 'Débito', nature: 'Entrada', sign: 1 },
            2: { description: 'Boleto', nature: 'Saída', sign: -1 },
            3: { description: 'Financiamento', nature: 'Saída', sign: -1 },
            4: { description: 'Crédito', nature: 'Entrada', sign: 1 },
            5: { description: 'Recebimento Empréstimo', nature: 'Entrada', sign: 1 },
            6: { description: 'Vendas', nature: 'Entrada', sign: 1 },
            7: { description: 'Recebimento TED', nature: 'Entrada', sign: 1 },
            8: { description: 'Recebimento DOC', nature: 'Entrada', sign: 1 },
            9: { description: 'Aluguel', nature: 'Saída', sign: -1 }
        };

        this.structure = {
            type: { start: 0, end: 1, size: 1 },
            date: { start: 1, end: 9, size: 8 },
            value: { start: 9, end: 19, size: 10 },
            cpf: { start: 19, end: 30, size: 11 },
            card: { start: 30, end: 42, size: 12 },
            time: { start: 42, end: 48, size: 6 },
            storeOwner: { start: 48, end: 62, size: 14 },
            storeName: { start: 62, end: 81, size: 19 }
        };
    }

    parseLine(line) {
        if (!line || line.length < 81) {
            throw new Error('Linha CNAB inválida');
        }

        const type = parseInt(line.substring(this.structure.type.start, this.structure.type.end), 10);
        const transactionInfo = this.transactionTypes[type] || {
            description: 'Desconhecido',
            nature: 'Desconhecido',
            sign: 0
        };

        const dateStr = line.substring(this.structure.date.start, this.structure.date.end);
        const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;

        const valueInCents = parseInt(line.substring(this.structure.value.start, this.structure.value.end), 10);
        const value = valueInCents / 100;

        const timeStr = line.substring(this.structure.time.start, this.structure.time.end);
        const formattedTime = `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:${timeStr.substring(4, 6)}`;

        return {
            type,
            typeDescription: transactionInfo.description,
            nature: transactionInfo.nature,
            date: formattedDate,
            value: value,
            signedValue: value * transactionInfo.sign,
            cpf: line.substring(this.structure.cpf.start, this.structure.cpf.end).trim(),
            card: line.substring(this.structure.card.start, this.structure.card.end).trim(),
            time: formattedTime,
            storeOwner: line.substring(this.structure.storeOwner.start, this.structure.storeOwner.end).trim(),
            storeName: line.substring(this.structure.storeName.start, this.structure.storeName.end).trim()
        };
    }

    parseContent(content) {
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        const transactions = [];

        for (const line of lines) {
            try {
                const transaction = this.parseLine(line);
                transactions.push(transaction);
            } catch (error) {
                console.error(`Erro ao processar linha: ${line}`, error);
            }
        }

        return transactions;
    }

    groupByStore(transactions) {
        const stores = {};
        
        for (const transaction of transactions) {
            const storeKey = transaction.storeName;
            
            if (!stores[storeKey]) {
            stores[storeKey] = {
                name: transaction.storeName,
                owner: transaction.storeOwner,
                transactions: [],
                balance: 0
            };
            }
            
            stores[storeKey].transactions.push(transaction);
            
            const signedValue = parseFloat(transaction.signedValue);
            if (!isNaN(signedValue)) {
            stores[storeKey].balance += signedValue;
            
            stores[storeKey].balance = parseFloat(stores[storeKey].balance.toFixed(2));
            }
        }
        
        return Object.values(stores);
    }
}

module.exports = new CNABParser();