Autenticação

POST {{base_url}}/auth/v1/token?grant_type=password

POST {{base_url}}/auth/v1/signup

Código de Segurança

POST {{base_url}}/functions/v1/validation-codes/generate

POST {{base_url}}/functions/v1/validation-codes/validate

Tickets de Suporte

POST {{base_url}}/functions/v1/support-tickets

Transações

POST {{base_url}}/functions/v1/transactions

GET {{base_url}}/functions/v1/credentials

POST {{base_url}}/functions/v1/webhookfx

Subcontas (Marketplace)

POST {{base_url}}/proxy

POST {{base_url}}/request_verification (Nota: este endpoint parece ser parte de uma aplicação web separada)

POST {{base_url}}/functions/v1/subconta

PUT {{base_url}}/functions/v1/subconta/resend_documents

POST {{base_url}}/functions/v1/subconta/checkstatus

POST {{base_url}}/functions/v1/subconta/check_kyc

Logs e Taxas

GET {{base_url}}/functions/v1/audit-log

POST {{base_url}}/functions/v1/taxas

Chaves PIX

GET {{base_url}}/functions/v1/pix-key

POST {{base_url}}/functions/v1/pix-key

PUT {{base_url}}/functions/v1/pix-key/:id

PATCH {{base_url}}/functions/v1/pix-key/:id/approve

Configurações e Personalização

GET {{base_url}}/functions/v1/configuracoes/termos

PUT {{base_url}}/functions/v1/configuracoes/termos

GET {{base_url}}/functions/v1/configuracoes

PUT {{base_url}}/functions/v1/configuracoes

GET {{base_url}}/functions/v1/personalization

PUT {{base_url}}/functions/v1/personalization

GET {{base_url}}/functions/v1/config-companie-view

PUT {{base_url}}/functions/v1/configuracoes/acecitar-termos

GET {{base_url}}/functions/v1/configuracoes/emails

PUT {{base_url}}/functions/v1/configuracoes/emails

Rastreamento (UTM)

GET {{base_url}}/functions/v1/pixelTracker

POST {{base_url}}/functions/v1/pixelTracker

PATCH {{base_url}}/functions/v1/pixelTracker

Análise de Risco

POST {{base_url}}/functions/v1/risk

Clientes (CRM)

GET {{base_url}}/functions/v1/clientes

POST {{base_url}}/functions/v1/clientes

PUT {{base_url}}/functions/v1/clientes

GET {{base_url}}/functions/v1/clientes/:id

Link de Pagamento

GET {{base_url}}/functions/v1/link-pagamentos

POST {{base_url}}/functions/v1/link-pagamentos

PATCH {{base_url}}/functions/v1/link-pagamentos/:id

GET {{base_url}}/functions/v1/link-pagamento-view/:id

Padrões de Configuração (Admin)

GET {{base_url}}/functions/v1/standard

PATCH {{base_url}}/functions/v1/standard/last

Alertas

GET {{base_url}}/functions/v1/alerts

POST {{base_url}}/functions/v1/alerts

DELETE {{base_url}}/functions/v1/alerts

POST {{base_url}}/functions/v1/alerts/mark-viewed

Dashboard e Relatórios

POST {{base_url}}/functions/v1/dados-dashboard

GET {{base_url}}/functions/v1/analytics-reports/top-sellers/:startDate/:endDate

POST {{base_url}}/functions/v1/dados-dashboard/top-produtos

POST {{base_url}}/functions/v1/dados-dashboard/grafico

POST {{base_url}}/functions/v1/dados-dashboard/infos-adicionais

POST {{base_url}}/functions/v1/dados-dashboard/top-sellers

POST {{base_url}}/functions/v1/dados-dashboard/providers

POST {{base_url}}/functions/v1/dados-dashboard/acquirer

POST {{base_url}}/functions/v1/faturamento-whitelabel

POST {{base_url}}/functions/v1/whitelabel-financeiro

Saques

GET {{base_url}}/functions/v1/saques

POST {{base_url}}/functions/v1/withdrawals

PATCH {{base_url}}/functions/v1/withdrawals/:id

GET {{base_url}}/functions/v1/saques/aggregates

Antecipações

GET {{base_url}}/functions/v1/antecipacoes/anticipations

POST {{base_url}}/functions/v1/antecipacoes/create

POST {{base_url}}/functions/v1/antecipacoes/approve

PATCH {{base_url}}/functions/v1/antecipacoes/deny

Usuários

GET {{base_url}}/functions/v1/users

POST {{base_url}}/functions/v1/users/create

POST {{base_url}}/functions/v1/users/register

GET {{base_url}}/functions/v1/users/:id

PATCH {{base_url}}/functions/v1/users/:id/edit

GET {{base_url}}/functions/v1/users/:id/apikey

GET {{base_url}}/functions/v1/users/:id/permissions

PATCH {{base_url}}/functions/v1/users/:id/permissions

Resumo e Histórico de Transações

GET {{base_url}}/functions/v1/transacoes

GET {{base_url}}/functions/v1/transacoes/resumo

GET {{base_url}}/functions/v1/transacoes/:id

Carteira (Wallet)

GET {{base_url}}/functions/v1/wallet

POST {{base_url}}/functions/v1/wallet/remove-balance

POST {{base_url}}/functions/v1/wallet/balance-management

GET {{base_url}}/functions/v1/extrato/:userId

Webhooks (Configuração)

GET {{base_url}}/functions/v1/webhook

PUT {{base_url}}/functions/v1/webhook/:webhookId

DELETE {{base_url}}/functions/v1/webhook/:webhookId

Faturas

GET {{base_url}}/functions/v1/billings

PATCH {{base_url}}/functions/v1/billings/pay

BaaS (Banking as a Service - Admin)

GET {{base_url}}/functions/v1/baas

GET {{base_url}}/functions/v1/baas/:id

GET {{base_url}}/functions/v1/baas/:id/taxas

PATCH {{base_url}}/functions/v1/baas/:id/active

PATCH {{base_url}}/functions/v1/baas/:id/taxa

Adquirentes (Admin)

GET {{base_url}}/functions/v1/acquirers

GET {{base_url}}/functions/v1/acquirers/:id

GET {{base_url}}/functions/v1/acquirers/:id/taxas

PATCH {{base_url}}/functions/v1/acquirers/:id/active

PATCH {{base_url}}/functions/v1/acquirers/:id/taxas

Módulo: Empresa
GET {{base_url}}/functions/v1/companies
GET {{base_url}}/functions/v1/companies/contagem
GET {{base_url}}/functions/v1/companies/:id
GET {{base_url}}/functions/v1/companies/:id/taxas
GET {{base_url}}/functions/v1/companies/:id/reserva
GET {{base_url}}/functions/v1/companies/:id/config
GET {{base_url}}/functions/v1/companies/:id/docs
GET {{base_url}}/functions/v1/companies/:id/adq
GET {{base_url}}/functions/v1/companies/:id/financial-info
POST {{base_url}}/functions/v1/companies
PATCH {{base_url}}/functions/v1/companies/:id/taxas
PATCH {{base_url}}/functions/v1/companies/:id/taxas-bulk
PATCH {{base_url}}/functions/v1/companies/:id/docs
PATCH {{base_url}}/functions/v1/companies/:id/config
PATCH {{base_url}}/functions/v1/companies/:id/config-bulk
PATCH {{base_url}}/functions/v1/companies/:id/reserva
PATCH {{base_url}}/functions/v1/companies/:id/adq
PATCH {{base_url}}/functions/v1/companies/:id/status
PATCH {{base_url}}/functions/v1/companies/:id/reserva-bulk