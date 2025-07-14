# Testes de Endpoints de Chaves Pix (36-37)

Este diretório contém testes para os endpoints de gerenciamento de chaves Pix do aplicativo KingPay.

## Estrutura dos Testes

Os testes estão organizados em dois arquivos:

1. `list-pix-keys.test.js` - Testes para o endpoint de listagem de chaves Pix (Endpoint 36)
2. `approve-pix-key.test.js` - Testes para o endpoint de aprovação/reprovação de chaves Pix (Endpoint 37)

## Helpers Utilizados

Os testes utilizam dois helpers principais:

1. `auth-helper.js` - Para gerenciar a autenticação nos testes
2. `pixkey-helper.js` - Para simular operações com chaves Pix e validar os resultados

## Abordagem de Testes

Os testes seguem uma abordagem híbrida:

1. Tentam usar o serviço real do app (que pode falhar se as funções Edge do Supabase não estiverem configuradas)
2. Usam simulações para validar a lógica de negócio

## Endpoints Testados

### Endpoint 36: Listar Todas as Chaves Pix
- Método: GET
- URL: https://{{base_url}}/functions/v1/pix-key
- Funcionalidade: Retorna uma lista de chaves Pix (todas as chaves, sem filtro de usuário)
- Payload: Nenhum
- Regras de Negócio:
  - Requer privilégios de administrador
  - Consulta o banco de dados de chaves Pix
  - Implementa paginação para lidar com grandes quantidades de chaves

### Endpoint 37: Aprovar ou Reprovar Chave Pix
- Método: PATCH
- URL: https://{{base_url}}/functions/v1/pix-key/:id/approve
- Funcionalidade: Aprova ou reprova uma chave Pix específica
- Payload: JSON contendo:
  - v: Valor booleano indicando aprovação (true) ou reprovação (false)
- Regras de Negócio:
  - Requer privilégios de administrador
  - Valida a senha financeira do administrador
  - Atualiza o status da chave Pix no banco de dados

## Cenários Testados

### Listagem de Chaves Pix
1. Listar chaves Pix com paginação padrão
2. Listar chaves Pix com paginação personalizada
3. Filtrar chaves Pix por status
4. Buscar chaves Pix por termo
5. Tentar listar chaves Pix usando o serviço do app

### Aprovação/Reprovação de Chaves Pix
1. Aprovar uma chave Pix
2. Reprovar uma chave Pix
3. Tentar aprovar uma chave Pix usando o serviço do app
4. Falhar ao tentar aprovar uma chave Pix sem senha financeira
5. Falhar ao tentar aprovar uma chave Pix sem ID

## Executando os Testes

Para executar os testes de chaves Pix:

```bash
npm test -- __tests__/Chaves-Pix-Endpoints-36-37
```

Para executar um teste específico:

```bash
npm test -- __tests__/Chaves-Pix-Endpoints-36-37/list-pix-keys.test.js
```

## Observações

- Os testes são projetados para funcionar mesmo sem as funções Edge do Supabase configuradas
- Quando as funções Edge não estão disponíveis, os testes usam simulações para validar a lógica de negócio
- Os testes incluem verificações de casos de erro (dados inválidos) 