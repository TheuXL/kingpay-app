# Testes de Autenticação

Este diretório contém testes para os endpoints de autenticação, utilizando o `authService` do aplicativo para interagir com o backend Supabase.

## Abordagem de Testes

Os testes seguem o princípio de utilizar os serviços do aplicativo para se comunicar com o backend:

- Uso do `authService` para todas as operações de autenticação
- Sem chamadas HTTP diretas ao Supabase
- Sem exposição de credenciais nos testes
- Uso de dados reais para garantir comportamento correto

## Endpoints Testados

1. **Login (token.test.js)**
   - **Service**: `authService.login()`
   - Testa autenticação com credenciais válidas e inválidas
   - Verifica a estrutura da resposta (access_token, refresh_token, etc.)

2. **Login Duplicado (token-copy.test.js)**
   - **Service**: `authService.login()`
   - Mesmo endpoint do anterior, duplicado na documentação
   - Testes idênticos ao primeiro endpoint

3. **Registro (signup.test.js)**
   - **Service**: `authService.signup()`
   - Testa registro com email já existente (deve falhar)
   - Testa registro com email único (deve criar usuário)

4. **Endpoint Vazio (empty-url.test.js)**
   - Documentação para um endpoint listado sem URL
   - Não executa teste real, apenas documenta a existência deste endpoint na documentação

## Estrutura das Respostas

### Login (token)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6ImRDNDRxRzBlOStDMUVRYjQiLCJ0eXAiOiJKV1QifQ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": 1752008150,
  "refresh_token": "xhpja3cgxbxr",
  "user": {
    "id": "734bb2f1-ed63-4762-ae40-64809d4c13c3",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "matheuss.devv@gmail.com",
    "email_confirmed_at": "2025-05-25T21:27:00.356757Z",
    "phone": "",
    "confirmed_at": "2025-05-25T21:27:00.356757Z",
    "last_sign_in_at": "2025-07-08T19:55:50.340164322Z",
    "app_metadata": {
      "provider": "email",
      "providers": ["email"]
    },
    "user_metadata": {
      "email": "matheuss.devv@gmail.com",
      "email_verified": true,
      "phone_verified": false,
      "sub": "734bb2f1-ed63-4762-ae40-64809d4c13c3"
    },
    "identities": [],
    "created_at": "2025-05-25T21:27:00.349509Z",
    "updated_at": "2025-07-08T19:55:50.342632Z",
    "is_anonymous": false
  }
}
```

### Erro de Login (credenciais inválidas)

```json
{
  "error": {
  "code": 400,
  "error_code": "invalid_credentials",
  "msg": "Invalid login credentials"
  }
}
```

### Erro de Registro (email já existente)

```json
{
  "error": {
  "code": 422,
  "error_code": "user_already_exists",
  "msg": "User already registered"
  }
}
```

## Como Executar os Testes

Para executar todos os testes de autenticação:

```bash
npm run test:auth
```

Para executar um teste específico:

```bash
npm test -- "__tests__/Auth-Endpoints-1-4/token.test.js"
```

## Configuração

Os testes usam:
- Jest como framework de testes
- O `authService` do aplicativo para interagir com o Supabase
- Credenciais reais do Supabase para testar os endpoints

## Observações

- Os testes usam uma conta real (matheuss.devv@gmail.com) para testar autenticação
- O teste de registro cria usuários temporários com emails únicos
- O endpoint vazio é documentado, mas não testado por falta de URL 