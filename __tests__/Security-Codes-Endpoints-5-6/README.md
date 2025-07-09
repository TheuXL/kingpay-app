# Testes de Endpoints de Código de Segurança (Endpoints 5-6)

Este diretório contém testes para os endpoints relacionados à geração e validação de códigos de segurança na API Supabase, utilizando o `securityCodeService` do aplicativo com dados reais.

## Abordagem de Testes

Os testes seguem o princípio de utilizar os mesmos serviços que o aplicativo usa para interagir com o backend, com dados reais (não mocados). Isso garante:

- Consistência entre o comportamento do app e os testes
- Testes mais confiáveis por usar a API real
- Melhor manutenibilidade quando ocorrerem mudanças no backend
- Maior segurança por não expor credenciais diretamente nos testes

## Endpoints Testados

### 1. Gerar Código de Segurança
- **Service**: `securityCodeService.generateCode()`
- **Funcionalidade**: Gera um código de validação de segurança único.
- **Autenticação**: Requer token de acesso (gerenciado pelo serviço do app)
- **Regras de Negócio**:
  - Gera um código alfanumérico aleatório
  - Associa o código ao usuário autenticado
  - Define um tempo de expiração para o código

### 2. Validar Código de Segurança
- **Service**: `securityCodeService.validateCode()`
- **Funcionalidade**: Valida um código de segurança fornecido pelo usuário.
- **Autenticação**: Requer token de acesso (gerenciado pelo serviço do app)
- **Regras de Negócio**:
  - Verifica se o código existe no banco de dados
  - Verifica se o código corresponde ao usuário associado
  - Verifica se o código ainda não expirou
  - Um código só pode ser validado uma vez

## Arquivos de Teste

1. **generate-code.test.js** - Testa o endpoint de geração de código de segurança
   - Faz login antes de executar os testes usando `authHelper.loginForTests()`
   - Teste de sucesso na geração de código

2. **validate-code.test.js** - Testa o endpoint de validação de código de segurança
   - Faz login antes de executar os testes usando `authHelper.loginForTests()`
   - Gera um novo código para cada teste de validação
   - Teste de validação de código válido
   - Teste de rejeição de código inválido
   - Teste de falha por falta de autenticação (faz logout temporário)

## Resultados dos Testes

### Geração de Código

Resposta de sucesso:
```json
{
  "success": true,
  "code": "RLOZ9494",
  "expires_at": "2025-07-10T18:24:54.758282+00:00"
}
```

Resposta de erro (sem autenticação):
```json
{
  "success": false,
  "error": {
    "name": "FunctionsHttpError",
    "context": {}
  }
}
```

### Validação de Código

Resposta de sucesso:
```json
{
  "success": true,
  "message": "Código validado com sucesso"
}
```

Resposta de falha com código inválido:
```json
{
  "success": false,
  "message": "Código inválido ou não encontrado"
}
```

Resposta de erro (sem autenticação):
```json
{
  "success": false,
  "error": {
    "name": "FunctionsHttpError",
    "context": {}
  }
}
```

## Executando os Testes

Para executar todos os testes de códigos de segurança:

```bash
npm run test:security
```

Ou para executar um teste específico:

```bash
npm run test -- "__tests__/Security-Codes-Endpoints-5-6/generate-code.test.js"
npm run test -- "__tests__/Security-Codes-Endpoints-5-6/validate-code.test.js"
```

## Observações

- Os testes usam autenticação real com o Supabase, obtida através do `authHelper.loginForTests()`.
- Os testes de validação de código geram um novo código antes de testá-lo, garantindo que sempre haja um código válido disponível.
- Um código só pode ser validado uma vez. Tentativas subsequentes de validar o mesmo código resultarão em uma resposta com `success: false`.
- Os testes incluem logs detalhados das respostas para facilitar a depuração e entendimento do funcionamento da API.
- Os códigos gerados têm um formato alfanumérico (exemplo: "RLOZ9494") e uma data de expiração futura.
- Ao testar falhas de autenticação, o teste faz logout temporário e depois restaura o login para não afetar outros testes. 