# Serviços de API - KingPay App

Este diretório contém os serviços que se comunicam com a API do Supabase.

## Estrutura dos Serviços

Cada serviço segue uma estrutura padrão:

```typescript
import { supabase } from './supabase';

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export const serviceName = {
  method1: async (params): Promise<ServiceResponse<T>> => {
    try {
      const { data, error } = await supabase.functions.invoke('endpoint', {
        method: 'METHOD',
        body: params
      });
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
};
```

## Lista de Serviços

- `authService`: Autenticação de usuários
- `securityCodeService`: Gerenciamento de códigos de segurança
- `ticketService`: Gerenciamento de tickets de suporte
- `transactionService`: Processamento de transações (PIX, cartão)
- `withdrawalService`: Gerenciamento de saques
- `companyService`: Gerenciamento de empresas
- `taxService`: Cálculo de taxas
- `walletService`: Gerenciamento de carteiras
- `billingService`: Gerenciamento de faturas
- `webhookService`: Gerenciamento de webhooks
- `baasService`: Serviços de Banking as a Service
- `acquirersService`: Gerenciamento de adquirentes
- `userService`: Gerenciamento de usuários
- `financialService`: Operações financeiras
- `dashboardService`: Dados para dashboard
- `pixKeyService`: Gerenciamento de chaves PIX
- `linkPagamentosService`: Gerenciamento de links de pagamento
- `clientesService`: Gerenciamento de clientes
- `utmfyService`: Serviços de rastreamento UTM
- `configuracoesService`: Configurações gerais
- `subAccountService`: Gerenciamento de subcontas
- `anticipationService`: Antecipação de recebíveis

## Como usar os serviços

1. Importe o serviço necessário:

```typescript
import { authService } from '../services';
```

2. Utilize as funções do serviço em componentes assíncronos:

```typescript
const handleLogin = async () => {
  try {
    const result = await authService.login(email, password);
    if (result.error) {
      console.error('Erro no login:', result.error);
      return;
    }
    
    console.log('Logado com sucesso!', result);
  } catch (error) {
    console.error('Erro inesperado:', error);
  }
};
```

3. Trate os erros e respostas adequadamente:

```typescript
const response = await ticketService.getTickets();
if (response.success) {
  setTickets(response.data);
} else {
  setError(response.error.message);
}
```

## Endpoints API

Os endpoints estão definidos no arquivo `src/constants/api.ts` e são organizados por categoria:

- Auth (Endpoints 1-4)
- Códigos de Segurança (Endpoints 5-6)
- Tickets (Endpoints 7-15)
- Transações (Endpoints 16-23)
- etc.

## Tratamento de Erros

Todos os serviços seguem um padrão consistente de tratamento de erros:

1. Erros de API retornam `{ success: false, error: { message: 'Mensagem de erro' } }`
2. Exceções inesperadas são capturadas e convertidas para o mesmo formato
3. Logs detalhados são gerados no console para facilitar a depuração

## Adicionando Novos Serviços

1. Crie um novo arquivo `nomeDoServicoService.ts`
2. Defina interfaces necessárias
3. Implemente as funções do serviço usando o cliente Supabase
4. Exporte o serviço no arquivo `index.ts`
5. Adicione os endpoints no arquivo `api.ts`

## Teste de API

Use a tela de teste de API (`/api-test`) para verificar se as conexões com a API estão funcionando corretamente. 