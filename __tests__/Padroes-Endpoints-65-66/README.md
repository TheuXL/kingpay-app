# Testes de Padrões do Sistema (Endpoints 65-66)

Este diretório contém os testes para os endpoints de Padrões do Sistema no aplicativo KingPay.

## Endpoints Testados

### 1. GET /standard (Endpoint 65)
- **Arquivo de teste**: `get-padroes.test.js`
- **Funcionalidade**: Retorna os padrões do sistema
- **Método HTTP**: GET
- **Regras de Negócio**:
  - Verifica se o usuário tem permissão para visualizar os padrões
  - Consulta o banco de dados e retorna as informações

### 2. PATCH /standard/last (Endpoint 66)
- **Arquivo de teste**: `update-padroes.test.js`
- **Funcionalidade**: Atualiza os padrões do sistema
- **Método HTTP**: PATCH
- **Payload**: JSON contendo os dados a serem alterados (ex: paymentmethods, reservepercentageanticipation, etc)
- **Regras de Negócio**:
  - Verifica se o usuário tem permissão para atualizar os padrões
  - Atualiza no banco de dados

## Estrutura dos Testes

Os testes estão organizados em dois arquivos principais:

1. **get-padroes.test.js**: Testa a obtenção dos padrões do sistema
   - Testa a obtenção via serviço do app
   - Testa a obtenção via helper
   - Tenta obter diretamente da API
   - Testa falha de autenticação

2. **update-padroes.test.js**: Testa a atualização dos padrões do sistema
   - Testa a atualização de campos específicos via serviço do app
   - Testa a atualização de métodos de pagamento via helper
   - Tenta atualizar diretamente via API
   - Testa falha de autenticação
   - Testa falha com dados inválidos
   - Restaura os padrões originais após os testes

## Helpers

Os testes utilizam o helper `padroes-helper.js` que fornece funções para:
- Obter os padrões do sistema
- Atualizar os padrões do sistema
- Validar a estrutura dos dados de padrões

## Como Executar os Testes

Para executar os testes de padrões, use o seguinte comando:

```bash
npm test -- -t "Padrões Endpoints"
```

Para executar um teste específico:

```bash
# Teste de obtenção de padrões
npm test -- -t "Get Padrões"

# Teste de atualização de padrões
npm test -- -t "Update Padrões"
```

## Notas Importantes

1. Os testes de atualização restauram os padrões originais após a execução, para evitar alterações permanentes no ambiente de teste.

2. Alguns testes podem falhar se as funções Edge não estiverem configuradas corretamente no ambiente de teste.

3. Os testes de falha são importantes para garantir que a API valida corretamente os dados e as permissões. 