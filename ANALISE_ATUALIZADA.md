Legenda:
Status no App:
✅ Implementado: A função para chamar o endpoint existe no código.
❌ Não Implementado: Nenhuma função foi criada para este endpoint.
Status no Script de Teste:
✅ Em Teste: O endpoint é verificado pelo script scripts/test-api.js.
❌ Não Testado: O endpoint não é coberto pelo script de teste.
Resultado do Teste:
✅ Passando: O endpoint responde com sucesso (status 2xx).
❌ Falhando: O endpoint retorna um erro.
➖ N/A: Não aplicável (pois não está no script de teste).

### Tabela de Status dos Endpoints Atualizada

| Categoria             | Endpoint                                 | Status no App | Status no Script de Teste | Resultado do Teste |
| --------------------- | ---------------------------------------- | :-----------: | :----------------------: | :----------------: |
| **Autenticação**      | `POST /auth/v1/token`                    |       ✅       |            ✅             |         ✅          |
|                       | `POST /auth/v1/signup`                   |       ❌       |            ❌             |         ➖          |
| **Código de Segurança** | `POST /validation-codes/generate`        |       ✅       |            ✅             |         ✅          |
|                       | `POST /validation-codes/validate`        |       ✅       |            ✅             |         ✅          |
| **Tickets de Suporte**| `POST /support-tickets`                  |       ✅       |            ✅             |         ✅          |
| **Transações**        | `POST /transactions`                     |       ✅       |            ❌             |         ➖          |
|                       | `GET /credentials`                       |       ✅       |            ❌             |         ➖          |
|                       | `POST /webhookfx`                        |       ❌       |            ❌             |         ➖          |
| **Subcontas**         | `POST /proxy`                            |       ❌       |            ❌             |         ➖          |
|                       | `POST /request_verification`             |       ❌       |            ❌             |         ➖          |
|                       | `POST /subconta`                         |       ✅       |            ✅             |         ❌          |
|                       | `PUT /subconta/resend_documents`         |       ✅       |            ❌             |         ➖          |
|                       | `POST /subconta/checkstatus`             |       ✅       |            ✅             |         ❌          |
|                       | `POST /subconta/check_kyc`               |       ✅       |            ❌             |         ➖          |
| **Logs e Taxas**      | `GET /audit-log`                         |       ✅       |            ✅             |         ✅          |
|                       | `POST /taxas`                            |       ✅       |            ✅             |         ❌          |
| **Chaves PIX**        | `GET /pix-key`                           |       ✅       |            ✅             |         ✅          |
|                       | `POST /pix-key`                          |       ✅       |            ✅             |         ✅          |
|                       | `PUT /pix-key/:id`                       |       ✅       |            ✅             |         ❌          |
|                       | `PATCH /pix-key/:id/approve`             |       ✅       |            ✅             |         ❌          |
| **Configurações**     | `GET /configuracoes/termos`              |       ✅       |            ✅             |         ❌          |
|                       | `PUT /configuracoes/termos`              |       ❌       |            ❌             |         ➖          |
|                       | `GET /configuracoes`                     |       ✅       |            ✅             |         ❌          |
|                       | `PUT /configuracoes`                     |       ❌       |            ❌             |         ➖          |
|                       | `GET /personalization`                   |       ✅       |            ✅             |         ✅          |
|                       | `PUT /personalization`                   |       ❌       |            ❌             |         ➖          |
|                       | `GET /config-companie-view`              |       ❌       |            ❌             |         ➖          |
|                       | `PUT /configuracoes/aceitar-termos`      |       ❌       |            ❌             |         ➖          |
|                       | `GET /configuracoes/emails`              |       ❌       |            ❌             |         ➖          |
|                       | `PUT /configuracoes/emails`              |       ❌       |            ❌             |         ➖          |
| **Rastreamento**      | `GET /pixelTracker`                      |       ❌       |            ❌             |         ➖          |
|                       | `POST /pixelTracker`                     |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /pixelTracker`                    |       ❌       |            ❌             |         ➖          |
| **Análise de Risco**  | `POST /risk`                             |       ❌       |            ❌             |         ➖          |
| **Clientes (CRM)**    | `GET /clientes`                          |       ✅       |            ✅             |         ✅          |
|                       | `POST /clientes`                         |       ❌       |            ❌             |         ➖          |
|                       | `PUT /clientes`                          |       ❌       |            ❌             |         ➖          |
|                       | `GET /clientes/:id`                      |       ❌       |            ❌             |         ➖          |
| **Link de Pagamento** | `GET /link-pagamentos`                   |       ✅       |            ✅             |         ✅          |
|                       | `POST /link-pagamentos`                  |       ✅       |            ✅             |         ✅          |
|                       | `PATCH /link-pagamentos/:id`             |       ✅       |            ✅             |         ❌          |
|                       | `GET /link-pagamento-view/:id`           |       ✅       |            ✅             |         ❌          |
| **Padrões (Admin)**   | `GET /standard`                          |       ✅       |            ✅             |         ✅          |
|                       | `PATCH /standard/last`                   |       ❌       |            ❌             |         ➖          |
| **Alertas**           | `GET /alerts`                            |       ✅       |            ✅             |         ✅          |
|                       | `POST /alerts`                           |       ❌       |            ❌             |         ➖          |
|                       | `DELETE /alerts`                         |       ❌       |            ❌             |         ➖          |
|                       | `POST /alerts/mark-viewed`               |       ❌       |            ❌             |         ➖          |
| **Dashboard**         | `POST /dados-dashboard`                  |       ✅       |            ✅             |         ❌          |
|                       | `GET /analytics-reports/top-sellers`     |       ✅       |            ✅             |         ❌          |
|                       | `POST /dados-dashboard/top-produtos`     |       ✅       |            ✅             |         ❌          |
|                       | `POST /dados-dashboard/grafico`          |       ✅       |            ✅             |         ❌          |
|                       | `POST /dados-dashboard/infos-adicionais` |       ✅       |            ✅             |         ❌          |
|                       | `POST /dados-dashboard/top-sellers`      |       ✅       |            ✅             |         ❌          |
|                       | `POST /dados-dashboard/providers`        |       ✅       |            ✅             |         ❌          |
|                       | `POST /dados-dashboard/acquirer`         |       ✅       |            ✅             |         ❌          |
|                       | `POST /faturamento-whitelabel`           |       ✅       |            ✅             |         ❌          |
|                       | `POST /whitelabel-financeiro`            |       ✅       |            ✅             |         ✅          |
| **Saques**            | `GET /saques`                            |       ✅       |            ✅             |         ✅          |
|                       | `POST /withdrawals`                      |       ✅       |            ✅             |         ❌          |
|                       | `PATCH /withdrawals/:id`                 |       ✅       |            ✅             |         ❌          |
|                       | `GET /saques/aggregates`                 |       ✅       |            ✅             |         ✅          |
| **Antecipações**      | `GET /antecipacoes/anticipations`        |       ✅       |            ✅             |         ✅          |
|                       | `POST /antecipacoes/create`              |       ✅       |            ✅             |         ❌          |
|                       | `POST /antecipacoes/approve`             |       ✅       |            ✅             |         ❌          |
|                       | `PATCH /antecipacoes/deny`               |       ✅       |            ✅             |         ❌          |
| **Usuários**          | `GET /users`                             |       ✅       |            ✅             |         ✅          |
|                       | `POST /users/create`                     |       ❌       |            ❌             |         ➖          |
|                       | `POST /users/register`                   |       ✅       |            ✅             |         ❌          |
|                       | `GET /users/:id`                         |       ✅       |            ✅             |         ✅          |
|                       | `PATCH /users/:id/edit`                  |       ❌       |            ❌             |         ➖          |
|                       | `GET /users/:id/apikey`                  |       ❌       |            ❌             |         ➖          |
|                       | `GET /users/:id/permissions`             |       ✅       |            ✅             |         ✅          |
|                       | `PATCH /users/:id/permissions`           |       ❌       |            ❌             |         ➖          |
| **Transações (Histórico)** | `GET /transacoes`                   |       ✅       |            ✅             |         ✅          |
|                       | `GET /transacoes/resumo`                 |       ✅       |            ✅             |         ✅          |
|                       | `GET /transacoes/:id`                    |       ✅       |            ✅             |         ❌          |
| **Carteira (Wallet)** | `GET /wallet`                            |       ✅       |            ✅             |         ❌          |
|                       | `POST /wallet/remove-balance`            |       ✅       |            ✅             |         ❌          |
|                       | `POST /wallet/balance-management`        |       ✅       |            ✅             |         ❌          |
|                       | `GET /extrato/:userId`                   |       ✅       |            ✅             |         ✅          |
| **Webhooks**          | `GET /webhook`                           |       ❌       |            ❌             |         ➖          |
|                       | `PUT /webhook/:webhookId`                |       ❌       |            ❌             |         ➖          |
|                       | `DELETE /webhook/:webhookId`             |       ❌       |            ❌             |         ➖          |
| **Faturas**           | `GET /billings`                          |       ✅       |            ✅             |         ✅          |
|                       | `PATCH /billings/pay`                    |       ✅       |            ✅             |         ❌          |
| **BaaS (Admin)**      | `GET /baas`                              |       ✅       |            ✅             |         ✅          |
|                       | `GET /baas/:id`                          |       ❌       |            ✅             |         ✅          |
|                       | `GET /baas/:id/taxas`                    |       ❌       |            ✅             |         ✅          |
|                       | `PATCH /baas/:id/active`                 |       ❌       |            ✅             |         ✅          |
|                       | `PATCH /baas/:id/taxa`                   |       ❌       |            ✅             |         ❌          |
| **Adquirentes (Admin)** | `GET /acquirers`                       |       ✅       |            ✅             |         ✅          |
|                       | `GET /acquirers/:id`                     |       ❌       |            ✅             |         ✅          |
|                       | `GET /acquirers/:id/taxas`               |       ❌       |            ✅             |         ✅          |
|                       | `PATCH /acquirers/:id/active`            |       ❌       |            ✅             |         ✅          |
|                       | `PATCH /acquirers/:id/taxas`             |       ❌       |            ✅             |         ❌          |
| **Empresa**           | `GET /companies`                         |       ✅       |            ✅             |         ✅          |
|                       | `GET /companies/contagem`                |       ❌       |            ❌             |         ➖          |
|                       | `GET /companies/:id`                     |       ✅       |            ❌             |         ➖          |
|                       | `GET /companies/:id/taxas`               |       ❌       |            ❌             |         ➖          |
|                       | `GET /companies/:id/reserva`             |       ❌       |            ❌             |         ➖          |
|                       | `GET /companies/:id/config`              |       ❌       |            ❌             |         ➖          |
|                       | `GET /companies/:id/docs`                |       ❌       |            ❌             |         ➖          |
|                       | `GET /companies/:id/adq`                 |       ❌       |            ❌             |         ➖          |
|                       | `GET /companies/:id/financial-info`      |       ❌       |            ❌             |         ➖          |
|                       | `POST /companies`                        |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/taxas`             |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/taxas-bulk`        |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/docs`              |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/config`            |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/config-bulk`       |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/reserva`           |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/adq`               |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/status`            |       ❌       |            ❌             |         ➖          |
|                       | `PATCH /companies/:id/reserva-bulk`      |       ❌       |            ❌             |         ➖          | 






