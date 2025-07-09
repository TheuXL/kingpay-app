# Testes de Endpoints de Transações

Este diretório contém testes para os endpoints de transações (16-23) da aplicação.

## Estrutura

Os testes estão organizados da seguinte forma:

- `generate-pix-dev.test.js` - Testa a geração de PIX em ambiente de desenvolvimento (Endpoint 16)
- `get-credentials.test.js` - Testa a obtenção de credenciais de API (Endpoint 17)
- `generate-pix-prod.test.js` - Testa a geração de PIX em ambiente de produção (Endpoint 18)
- `process-card-dev.test.js` - Testa o processamento de pagamento com cartão em ambiente de desenvolvimento (Endpoint 19)
- `process-card-hash-dev.test.js` - Testa o processamento de pagamento com hash de cartão em ambiente de desenvolvimento (Endpoint 20)
- `process-card-prod.test.js` - Testa o processamento de pagamento com cartão em ambiente de produção (Endpoint 21)
- `process-webhook.test.js` - Testa o processamento de webhooks de transações (Endpoints 22-23)

## Abordagem de Teste

Os testes seguem uma abordagem híbrida:

1. **Testes diretos**: Usam o helper `transaction-helper.js` para simular operações diretamente em memória, permitindo validar a lógica de negócio sem depender de serviços externos.

2. **Testes via app service**: Tentam usar o serviço real da aplicação que se conecta às funções Edge do Supabase. Estes testes podem falhar se as funções Edge não estiverem configuradas no ambiente de teste, o que é esperado e tratado nos testes.

## Helpers

Os testes utilizam dois helpers principais:

- `auth-helper.js` - Gerencia autenticação para os testes, incluindo cache de sessão para evitar múltiplos logins.
- `transaction-helper.js` - Simula operações de transações em memória, implementando a mesma lógica de negócio dos serviços reais.

## Cenários Testados

### PIX (Desenvolvimento e Produção)
- Geração de código PIX
- Validação de dados obrigatórios
- Diferenças entre ambientes de desenvolvimento e produção

### Cartão de Crédito (Desenvolvimento e Produção)
- Processamento de pagamento com dados completos do cartão
- Processamento de pagamento com hash do cartão
- Validação de dados do cartão
- Diferenças entre ambientes de desenvolvimento e produção

### Credenciais
- Obtenção de credenciais de API
- Validação de autenticação

### Webhooks
- Processamento de diferentes tipos de eventos (aprovação, recusa, reembolso, cancelamento)
- Validação de dados do webhook
- Validação de ID de transação

## Execução

Para executar os testes:

```bash
npm test -- __tests__/Transacoes-Endpoints-16-23
```

Para executar um teste específico:

```bash
npm test -- __tests__/Transacoes-Endpoints-16-23/generate-pix-dev.test.js
```

## Observações

- Os testes são independentes e podem ser executados em qualquer ordem.
- Cada conjunto de testes limpa os dados de teste antes de começar para evitar interferências.
- Os testes que usam o serviço real da aplicação são tolerantes a falhas, pois as funções Edge podem não estar disponíveis no ambiente de teste. 