# Testes de Configurações do Administrador (Endpoints 75-77)

Este diretório contém os testes para os endpoints de Configurações do Administrador no aplicativo KingPay.

## Endpoints Testados

### 1. GET /configuracoes/termos (Endpoint 75)
- **Arquivo de teste**: `get-email-templates.test.js`
- **Funcionalidade**: Listar os templates de email
- **Método HTTP**: GET
- **Regras de Negócio**:
  - Verifica se o usuário tem permissão para visualizar os templates
  - Retorna as informações para o usuário

### 2. PUT /configuracoes/emails (Endpoint 76)
- **Arquivo de teste**: `update-email-template.test.js`
- **Funcionalidade**: Atualizar um template de Email
- **Método HTTP**: PUT
- **Payload**: JSON contendo as informações a serem alteradas
- **Regras de Negócio**:
  - Apenas administradores têm acesso a essa funcionalidade
  - Valida os dados que serão salvos no banco

### 3. PUT /configuracoes/acecitar-termos (Endpoint 77)
- **Arquivo de teste**: `aceitar-termos.test.js`
- **Funcionalidade**: Aceitar os termos de uso, atualizando a informação no banco de dados
- **Método HTTP**: PUT
- **Regras de Negócio**:
  - Atualiza os valores no banco de dados

## Estrutura dos Testes

Os testes estão organizados em três arquivos principais:

1. **get-email-templates.test.js**: Testa a obtenção dos templates de email
   - Testa a obtenção via serviço do app
   - Tenta obter diretamente da API
   - Testa falha de autenticação
   - Testa com dados mockados quando a API não está disponível

2. **update-email-template.test.js**: Testa a atualização de templates de email
   - Testa a atualização via serviço do app
   - Tenta atualizar diretamente via API
   - Testa falha de autenticação
   - Testa falha com dados inválidos

3. **aceitar-termos.test.js**: Testa a aceitação dos termos de uso
   - Testa a aceitação via serviço do app
   - Tenta aceitar diretamente via API
   - Testa falha de autenticação

## Helpers

Os testes utilizam o helper `email-templates-helper.js` que fornece funções para:
- Obter os templates de email
- Atualizar templates de email
- Aceitar termos de uso
- Validar a estrutura dos templates

## Como Executar os Testes

Para executar os testes de configurações do administrador, use o seguinte comando:

```bash
npm test -- -t "Email Templates Service"
```

Para executar um teste específico:

```bash
# Teste de obtenção de templates
npm test -- -t "Get Email Templates"

# Teste de atualização de templates
npm test -- -t "Update Email Template"

# Teste de aceitação de termos
npm test -- -t "Aceitar Termos"
```

## Notas Importantes

1. Os testes estão preparados para lidar com falhas nas funções Edge, que são esperadas em ambientes de desenvolvimento local.

2. Os testes incluem verificações de autenticação para garantir que apenas usuários autorizados possam acessar essas funcionalidades.

3. O helper fornece dados mockados para permitir testes mesmo quando a API não está disponível. 