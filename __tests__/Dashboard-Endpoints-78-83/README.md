# Testes dos Endpoints do Dashboard (78-83)

Este diretório contém testes para os endpoints do Dashboard do KingPay.

## Endpoints Testados

1. **Dados Dashboard** - `POST /functions/v1/dados-dashboard`
   - Retorna um consolidado de dados para o dashboard.
   - Arquivo de teste: `get-dashboard-data.test.js`

2. **Top Sellers** - `POST /functions/v1/dados-dashboard/top-sellers`
   - Retorna informações de maiores clientes do sistema.
   - Arquivo de teste: `get-top-sellers.test.js`

3. **Top Produtos** - `POST /functions/v1/dados-dashboard/top-produtos`
   - Retorna uma lista dos produtos mais vendidos dentro de um período.
   - Arquivo de teste: `get-top-produtos.test.js`

4. **Gráfico** - `POST /functions/v1/dados-dashboard/grafico`
   - Retorna dados para gerar gráficos de desempenho ao longo do tempo.
   - Arquivo de teste: `get-grafico-data.test.js`

5. **Infos Adicionais** - `POST /functions/v1/dados-dashboard/infos-adicionais`
   - Retorna informações adicionais de métricas do dashboard.
   - Arquivo de teste: `get-infos-adicionais.test.js`

6. **Analytics Reports Top Sellers** - `GET /functions/v1/analytics-reports/top-sellers/{startDate}/{endDate}`
   - Endpoint alternativo que retorna um consolidado de dados para o dashboard.
   - Testado no arquivo: `get-top-sellers.test.js`

## Como Executar os Testes

Para executar os testes, use o comando:

```bash
npm test -- __tests__/Dashboard-Endpoints-78-83
```

Para executar um teste específico:

```bash
npm test -- __tests__/Dashboard-Endpoints-78-83/get-dashboard-data.test.js
```

## Requisitos

Os testes utilizam o helper `dashboard-helper.js` que requer as seguintes variáveis de ambiente:

- `API_BASE_URL`: URL base da API do KingPay
- `TEST_USER_EMAIL`: E-mail de usuário para autenticação
- `TEST_USER_PASSWORD`: Senha do usuário para autenticação

Certifique-se de que essas variáveis estejam configuradas no arquivo `.env` na raiz do projeto. 