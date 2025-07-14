# Testes de Endpoints de Subconta (38-43)

Este diretório contém testes para os endpoints de gerenciamento de subcontas do aplicativo KingPay.

## Estrutura dos Testes

Os testes estão organizados em quatro arquivos:

1. `list-subaccounts.test.js` - Testes para o endpoint de listagem de subcontas (Endpoint 38)
2. `resend-documents.test.js` - Testes para o endpoint de reenvio de documentos (Endpoint 39)
3. `check-status.test.js` - Testes para o endpoint de verificação de status (Endpoint 40)
4. `check-kyc.test.js` - Testes para o endpoint de verificação de status KYC (Endpoint 41)
5. `create-subaccount.test.js` - Testes para o endpoint de criação de subconta com KYC (Endpoint 42)

## Helpers Utilizados

Os testes utilizam dois helpers principais:

1. `auth-helper.js` - Para gerenciar a autenticação nos testes
2. `subaccount-helper.js` - Para simular operações com subcontas e validar os resultados

## Abordagem de Testes

Os testes seguem uma abordagem híbrida:

1. Tentam usar o serviço real do app (que pode falhar se as funções Edge do Supabase não estiverem configuradas)
2. Usam simulações para validar a lógica de negócio

## Endpoints Testados

### Endpoint 38: Listar Subcontas
- Método: GET
- URL: https://{{base_url}}/functions/v1/subconta
- Funcionalidade: Lista as subcontas
- Payload: Nenhum
- Regras de Negócio:
  - Requer privilégios de administrador
  - Consulta no banco de dados
  - Lógica de paginação

### Endpoint 39: Reenviar Documentos
- Método: PUT
- URL: https://{{base_url}}/functions/v1/subconta/resend_documents
- Funcionalidade: Reenvia documentos de verificação para uma subconta
- Payload: JSON contendo IDs de subconta e URLs dos documentos
- Regras de Negócio:
  - Valida os dados e URLs dos documentos
  - Realiza a requisição ao provedor KYC

### Endpoint 40: Verificar Status
- Método: POST
- URL: https://{{base_url}}/functions/v1/subconta/checkstatus
- Funcionalidade: Checa o status de uma subconta no provedor de pagamentos
- Payload: JSON contendo o ID e token da subconta
- Regras de Negócio:
  - Conecta-se ao provedor de pagamentos
  - Consulta o status da subconta

### Endpoint 41: Verificar Status KYC
- Método: POST
- URL: https://{{base_url}}/functions/v1/subconta/check_kyc
- Funcionalidade: Checa o status KYC (Know Your Customer) de uma subconta no provedor de pagamentos
- Payload: JSON contendo o token da subconta
- Regras de Negócio:
  - Conecta-se ao provedor de pagamentos
  - Consulta o status KYC da subconta

### Endpoint 42: Criar Subconta com KYC
- Método: POST
- URL: https://{{base_url}}/functions/v1/subconta
- Funcionalidade: Automatiza o processo de criação de subconta e envio de documentação KYC
- Payload: JSON contendo dados da subconta e documentos
- Regras de Negócio:
  - Valida os dados da subconta e da empresa
  - Chama o endpoint para criar a subconta no provedor de pagamentos
  - Chama o endpoint para enviar a documentação KYC

## Cenários Testados

### Listagem de Subcontas
1. Listar subcontas com paginação padrão
2. Listar subcontas com paginação personalizada
3. Filtrar subcontas por status
4. Buscar subcontas por termo
5. Tentar listar subcontas usando o serviço do app

### Reenvio de Documentos
1. Reenviar documentos para uma subconta
2. Falhar ao tentar reenviar documentos sem os documentos obrigatórios
3. Falhar ao tentar reenviar documentos sem ID da subconta
4. Tentar reenviar documentos usando o serviço do app

### Verificação de Status
1. Verificar o status de uma subconta
2. Falhar ao tentar verificar o status sem ID da subconta
3. Falhar ao tentar verificar o status sem token
4. Tentar verificar o status usando o serviço do app

### Verificação de Status KYC
1. Verificar o status KYC de uma subconta
2. Falhar ao tentar verificar o status KYC sem token
3. Tentar verificar o status KYC usando o serviço do app

### Criação de Subconta com KYC
1. Criar uma subconta com KYC
2. Falhar ao tentar criar uma subconta sem ID da empresa
3. Falhar ao tentar criar uma subconta sem nome
4. Falhar ao tentar criar uma subconta sem balanço patrimonial
5. Tentar criar uma subconta usando o serviço do app

## Executando os Testes

Para executar os testes de subcontas:

```bash
npm test -- __tests__/Subconta\ \(Endpoints\ 38-43\)
```

Para executar um teste específico:

```bash
npm test -- __tests__/Subconta\ \(Endpoints\ 38-43\)/list-subaccounts.test.js
```

## Observações

- Os testes são projetados para funcionar mesmo sem as funções Edge do Supabase configuradas
- Quando as funções Edge não estão disponíveis, os testes usam simulações para validar a lógica de negócio
- Os testes incluem verificações de casos de erro (dados inválidos) 