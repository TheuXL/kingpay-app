# Testes de Endpoints de Subcontas (24-28)

Este diretório contém testes para os endpoints de subcontas do aplicativo KingPay.

## Estrutura dos Testes

Os testes estão organizados em arquivos separados para cada endpoint ou grupo de endpoints relacionados:

1. `create-subaccount.test.js` - Testes para o endpoint de criação de subconta (Endpoint 24)
2. `request-verification.test.js` - Testes para o endpoint de verificação KYC (Endpoint 25)
3. `webhooks.test.js` - Testes para os endpoints de webhook (Endpoints 26-27)
4. `create-subaccount-with-kyc.test.js` - Testes para o endpoint de criação de subconta com KYC (Endpoint 28)

## Helpers Utilizados

Os testes utilizam dois helpers principais:

1. `auth-helper.js` - Para gerenciar a autenticação nos testes
2. `subaccount-helper.js` - Para simular operações de subcontas em memória

## Abordagem de Testes

Os testes seguem uma abordagem híbrida:

1. Tentam usar o serviço real do app (que pode falhar se as funções Edge do Supabase não estiverem configuradas)
2. Usam simulações em memória para validar a lógica de negócio

## Endpoints Testados

### Endpoint 24: Criar Subconta
- Método: POST
- URL: https://{{base_url}}/proxy
- Funcionalidade: Cria uma nova subconta em um provedor de serviços de pagamento

### Endpoint 25: Enviar KYC
- Método: POST
- URL: http://{{base_url}}:3000/request_verification
- Funcionalidade: Envia informações e documentos para verificação KYC

### Endpoint 26: Criar Webhook
- Método: POST
- URL: https://{{base_url}}/v1/web_hooks
- Funcionalidade: Cria um webhook na plataforma

### Endpoint 27: Listar Webhooks
- Método: POST
- URL: https://{{base_url}}/v1/web_hooks
- Funcionalidade: Lista os webhooks cadastrados na plataforma

### Endpoint 28: Criar Subconta com KYC
- Método: POST
- URL: https://{{base_url}}/functions/v1/subconta
- Funcionalidade: Automatiza o processo de criação de subconta e envio de documentação KYC

## Endpoints Adicionais Testados

- Reenviar Documentos (PUT https://{{base_url}}/functions/v1/subconta/resend_documents)
- Verificar Status (POST https://{{base_url}}/functions/v1/subconta/checkstatus)
- Verificar KYC (POST https://{{base_url}}/functions/v1/subconta/check_kyc)

## Executando os Testes

Para executar todos os testes de subcontas:

```bash
npm test -- __tests__/Subcontas-Endpoints-24-28
```

Para executar um teste específico:

```bash
npm test -- __tests__/Subcontas-Endpoints-24-28/create-subaccount.test.js
```

## Observações

- Os testes são projetados para funcionar mesmo sem as funções Edge do Supabase configuradas
- Quando as funções Edge não estão disponíveis, os testes usam simulações em memória
- Os testes incluem verificações de casos de erro (dados inválidos, autenticação falha, etc.) 