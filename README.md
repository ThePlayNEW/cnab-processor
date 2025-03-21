# Processador de Arquivos CNAB

A aplicação processa arquivos CNAB contendo dados de movimentações financeiras de diversas lojas, normaliza os dados e apresenta um dashboard interativo para visualização.

## 📋 Funcionalidades

- Upload de arquivos CNAB via interface amigável (drag-and-drop suportado)
- Processamento e normalização dos dados de acordo com o layout especificado
- Armazenamento em banco de dados MySQL
- Dashboard interativo mostrando transações agrupadas por loja
- Cálculo automático de saldos e totalizadores
- Busca e ordenação de lojas
- Visualização detalhada das transações de cada loja

## 🛠️ Stack Tecnológica

### Frontend
- Vue.js 3 com Vite para build rápido e eficiente
- Tailwind CSS para estilização
- Axios para requisições HTTP

### Backend
- Node.js com Express para a API RESTful
- MySQL para armazenamento dos dados
- Arquitetura MVC

### DevOps
- Docker e Docker Compose para containerização
- Git para controle de versão

## 🚀 Como Executar

### Usando Docker (Recomendado)

1. Certifique-se de ter o Docker e Docker Compose instalados
2. Clone o repositório:
   ```bash
   git clone https://github.com/ThePlayNEW/cnab-processor.git
   cd cnab-processor
   ```

3. Inicie os containers:
   ```bash
   docker-compose up -d
   ```

4. Acesse a aplicação:
   - Frontend: http://localhost:8080
   - API: http://localhost:3000

### Execução Local (Desenvolvimento)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📊 Formato do Arquivo CNAB

O arquivo CNAB processado segue um formato específico onde cada linha representa uma transação financeira com os seguintes campos:

| Campo        | Início | Fim | Tamanho | Descrição                  |
|--------------|--------|-----|---------|----------------------------|
| Tipo         | 1      | 1   | 1       | Tipo da transação          |
| Data         | 2      | 9   | 8       | Data no formato AAAAMMDD   |
| Valor        | 10     | 19  | 10      | Valor em centavos          |
| CPF          | 20     | 30  | 11      | CPF do beneficiário        |
| Cartão       | 31     | 42  | 12      | Cartão utilizado           |
| Hora         | 43     | 48  | 6       | Hora no formato HHMMSS     |
| Dono da loja | 49     | 62  | 14      | Nome do representante      |
| Nome loja    | 63     | 81  | 19      | Nome da loja               |

### Tipos de Transação

| Tipo | Descrição              | Natureza | Sinal |
|------|------------------------|----------|-------|
| 1    | Débito                 | Entrada  | +     |
| 2    | Boleto                 | Saída    | -     |
| 3    | Financiamento          | Saída    | -     |
| 4    | Crédito                | Entrada  | +     |
| 5    | Recebimento Empréstimo | Entrada  | +     |
| 6    | Vendas                 | Entrada  | +     |
| 7    | Recebimento TED        | Entrada  | +     |
| 8    | Recebimento DOC        | Entrada  | +     |
| 9    | Aluguel                | Saída    | -     |

## 🔌 API Endpoints

### `POST /api/upload`
- **Descrição**: Recebe e processa um arquivo CNAB
- **Parâmetros**: Form-data com um campo 'file' contendo o arquivo CNAB
- **Resposta**: 
  ```json
  {
    "message": "Arquivo processado com sucesso",
    "count": 20
  }
  ```

### `GET /api/stores`
- **Descrição**: Retorna os dados das lojas com suas transações e saldos
- **Resposta**: Array de objetos contendo dados das lojas e suas transações

## 💡 Decisões Técnicas

- **Vue.js + Vite**: Escolhi Vue.js pela sua simplicidade e facilidade de uso, combinado com Vite para um ambiente de desenvolvimento rápido
- **Tailwind CSS**: Utilizei para obter um design moderno sem a necessidade de escrever muito CSS personalizado
- **Node.js + Express**: Backend leve e eficiente para processamento de arquivos e API RESTful
- **MySQL**: Banco de dados relacional para armazenamento estruturado dos dados de transações
- **Docker**: Facilita o deploy e garante consistência entre ambientes