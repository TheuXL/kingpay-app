# Testes de Endpoints de Tickets (Endpoints 7-15)

Este diretório contém testes para os endpoints relacionados à gestão de tickets de suporte na API do aplicativo, utilizando o `ticketService` para interagir com o Supabase.

## Abordagem de Testes

Estes testes seguem o princípio de utilizar exatamente os mesmos serviços que o aplicativo usa para se comunicar com o backend. Isso garante que estamos testando o comportamento real do aplicativo, não apenas a API diretamente.

### Pontos importantes:

- **Uso do `ticketService`**: Todos os testes usam o serviço oficial do app, não fazendo chamadas diretas ao Supabase
- **Autenticação via app**: A autenticação é feita usando o `authService` do app, através do helper `auth-helper.js`
- **Dados reais**: Os testes utilizam dados reais, não mockados
- **Encapsulamento**: A comunicação com o backend está totalmente encapsulada nos serviços do app

## Endpoints Testados

### 1. Criação de Ticket (create-ticket.test.js)
- **Funcionalidade**: Criar um novo ticket de suporte.
- **Service**: `ticketService.createTicket()`
- **Casos de Teste**:
  - Criar um ticket com dados válidos
  - Tentar criar um ticket sem campos obrigatórios

### 2. Listagem de Tickets (list-tickets.test.js)
- **Funcionalidade**: Listar os tickets do usuário atual.
- **Service**: `ticketService.getTickets()`
- **Casos de Teste**:
  - Obter lista de tickets e verificar a estrutura de dados

### 3. Envio de Mensagem (send-message.test.js)
- **Funcionalidade**: Enviar uma mensagem para um ticket existente.
- **Service**: `ticketService.sendMessage()`
- **Casos de Teste**:
  - Enviar mensagem válida para um ticket
  - Tentar enviar mensagem para um ticket inexistente

### 4. Listagem de Mensagens (get-messages.test.js)
- **Funcionalidade**: Listar as mensagens de um ticket específico.
- **Service**: `ticketService.getMessages()`
- **Casos de Teste**:
  - Obter mensagens de um ticket existente
  - Verificar a paginação de mensagens
  - Tentar obter mensagens de um ticket inexistente

### 5. Verificar Mensagens Não Lidas (check-unread-messages.test.js)
- **Funcionalidade**: Verificar se existem mensagens não lidas nos tickets do usuário.
- **Service**: `ticketService.checkUnreadMessages()`
- **Casos de Teste**:
  - Verificar contagem de mensagens não lidas
  - Verificar se um ticket específico aparece na lista de não lidos

### 6. Marcar Mensagens Como Lidas (mark-messages-as-read.test.js)
- **Funcionalidade**: Marcar todas as mensagens de um ticket como lidas.
- **Service**: `ticketService.markMessagesAsRead()`
- **Casos de Teste**:
  - Marcar mensagens como lidas com sucesso
  - Verificar que não existem mais mensagens não lidas após a operação

### 7. Obter Detalhes do Ticket (get-ticket.test.js)
- **Funcionalidade**: Obter detalhes completos de um ticket específico.
- **Service**: `ticketService.getTicket()`
- **Casos de Teste**:
  - Obter detalhes de um ticket existente
  - Verificar se as mensagens estão incluídas nos detalhes
  - Tentar obter detalhes de um ticket inexistente

### 8. Obter Métricas de Tickets (get-metrics.test.js)
- **Funcionalidade**: Obter estatísticas sobre os tickets do usuário.
- **Service**: `ticketService.getMetrics()`
- **Casos de Teste**:
  - Verificar a estrutura das métricas
  - Confirmar presença de tickets em cada categoria de status

### 9. Atualizar Status (update-status.test.js)
- **Funcionalidade**: Atualizar o status de um ticket (aberto, em andamento, fechado, etc).
- **Service**: `ticketService.updateStatus()`
- **Casos de Teste**:
  - Atualizar o status de um ticket existente
  - Tentar atualizar o status com um valor inválido

## Como Executar os Testes

Para executar todos os testes de tickets:

```bash
npm run test:tickets
```

Para executar um teste específico:

```bash
npm run test:ticket:create
npm run test:ticket:send-message
# etc.
```

## Estrutura de Dados

Os testes verificam se as respostas têm a estrutura correta. Por exemplo, para um ticket:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "subject": "Problema no pagamento",
  "message": "Não consegui finalizar minha compra",
  "status": "open",
  "created_at": "2025-07-10T13:25:41.290268791Z",
  "updated_at": "2025-07-10T13:30:15.123456Z"
}
```

E para uma mensagem:

```json
{
  "id": "234e5678-f90c-23e4-b567-537725285111",
  "ticket_id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Mensagem de teste",
  "is_from_support": false,
  "created_at": "2025-07-10T13:35:22.654321Z"
}
``` 