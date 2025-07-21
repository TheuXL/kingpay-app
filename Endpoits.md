### Arquitetura de Comunicação do App

A sua análise está correta e esta será a base da nossa exploração. A arquitetura para o seu aplicativo móvel será:

1.  **Front-end (React Native / Expo):** Onde a interface do usuário reside e as interações acontecem.
2.  **Cliente Supabase:** Inicializado no app usando as variáveis do seu `.env` (`EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`), ele gerenciará a autenticação e fará chamadas para o backend.
3.  **Backend (Supabase Edge Functions):** A `{{base_url}}` da sua coleção corresponde à `EXPO_PUBLIC_SUPABASE_URL`. O app chamará estas funções para executar a lógica de negócio de forma segura. O token de acesso obtido no login será enviado automaticamente pelo cliente Supabase em cada requisição.

---

### Análise Detalhada dos Endpoints Únicos

Vou agrupar os endpoints pela sua rota e método, ignorando duplicatas (como "Copy") e requests com URLs vazias, e numerá-los para clareza.

#### **1. Autenticação: Gerar Token de Acesso**
*   **Endpoint:** `POST /auth/v1/token`
*   **Objetivo:** Autenticar um usuário com email e senha e retornar um token de acesso (JWT) para ser usado em requisições subsequentes.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/auth/v1/token?grant_type=password`  
        A URL base (`{{base_url}}`) aponta para seu projeto Supabase. `/auth/v1/token` é o caminho padrão do serviço de autenticação (GoTrue) da Supabase. O parâmetro de query `grant_type=password` especifica que a autenticação será feita usando email e senha.
    *   **Método:** `POST`, pois está enviando dados sensíveis (credenciais) para criar uma sessão (um "recurso" no servidor).
    *   **Autenticação:** A requisição inicial para login não requer um `access_token`, mas sim uma `apikey` pública no cabeçalho.
    *   **Cabeçalhos:**
        *   `apikey`: Chave pública do Supabase (`EXPO_PUBLIC_SUPABASE_ANON_KEY`), que identifica seu projeto de forma segura.
        *   `Content-Type: application/json`: Informa que o corpo da requisição está no formato JSON.
    *   **Corpo da Requisição:**
        ```json
        {
          "email": "eubrenosantoss@gmail.com",
          "password": "100Senha2002@"
        }
        ```
        Contém as credenciais do usuário.
    *   **Uso no Aplicativo:** O seu app terá uma tela de login com campos de email e senha. Ao tocar em "Entrar", você chamará a função `supabase.auth.signInWithPassword({ email, password })`. Esta função do SDK da Supabase cuidará de fazer essa requisição `POST` para você. Se for bem-sucedida, o SDK armazenará o `access_token` retornado de forma segura no dispositivo, que será então automaticamente incluído nas chamadas futuras.

#### **2. Autenticação: Criar Nova Conta**
*   **Endpoint:** `POST /auth/v1/signup`
*   **Objetivo:** Registrar um novo usuário no sistema.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/auth/v1/signup`  
        Endpoint padrão do Supabase GoTrue para registro.
    *   **Método:** `POST`, pois está criando um novo recurso (um usuário).
    *   **Autenticação:** Similar ao login, requer a `apikey` pública no cabeçalho.
    *   **Corpo da Requisição:**
        ```json
        {
          "email": "eubrenoteste222@gmail.com",
          "password": "kdRBRMPgmjEgzJQvWgFt"
        }
        ```
        Fornece os dados necessários para o cadastro do novo usuário.
    *   **Uso no Aplicativo:** Em uma tela de cadastro, o app coletará o email e a senha do usuário e chamará a função `supabase.auth.signUp({ email, password })`.

---

### Módulo: Código de Segurança

#### **3. Geração de Código de Validação**
*   **Endpoint:** `POST /functions/v1/validation-codes/generate`
*   **Objetivo:** Gerar um código de segurança único e com tempo de expiração para um usuário autenticado, provavelmente para confirmar uma ação sensível.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/functions/v1/validation-codes/generate`  
        Chama uma Edge Function customizada chamada `validation-codes` com a sub-rota `/generate`.
    *   **Método:** `POST`, indicando a criação de um novo código.
    *   **Autenticação:** `Bearer Token`. Esta rota é protegida e exige um `access_token` válido no cabeçalho `Authorization`, significando que o usuário deve estar logado.
    *   **Corpo da Requisição:** Vazio, pois a identidade do usuário é obtida a partir do token de autenticação.
    *   **Uso no Aplicativo:** Quando o usuário for realizar uma ação que exija uma segunda camada de segurança (como uma alteração de senha financeira), o app chamará este endpoint. Por exemplo: `await supabase.functions.invoke('validation-codes/generate')`. A resposta conterá o código que poderá ser enviado ao usuário (via email, por exemplo).

#### **4. Validação de Código de Segurança**
*   **Endpoint:** `POST /functions/v1/validation-codes/validate`
*   **Objetivo:** Verificar se o código fornecido pelo usuário é válido, não expirado e corresponde ao usuário logado.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/functions/v1/validation-codes/validate`
    *   **Método:** `POST`, pois está enviando dados para validação.
    *   **Autenticação:** `Bearer Token`. O usuário precisa estar logado.
    *   **Corpo da Requisição:**
        ```json
        {
          "code": "123" 
        }
        ```
        Contém o código que o usuário digitou na interface.
    *   **Uso no Aplicativo:** Após o usuário receber o código de segurança e inseri-lo em um campo de texto no app, essa informação será enviada para este endpoint para validação: `await supabase.functions.invoke('validation-codes/validate', { body: { code: '...' } })`. Se a resposta for sucesso, a ação sensível pode prosseguir.

---

### Módulo: Tickets de Suporte

#### **5. Gerenciamento de Tickets de Suporte**
*   **Endpoint:** `POST /functions/v1/support-tickets`
*   **Objetivo:** Ponto de entrada único para todas as operações relacionadas a tickets de suporte. A ação específica é determinada pelo corpo da requisição.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/functions/v1/support-tickets`
    *   **Método:** `POST`. Mesmo para operações de leitura (como listar), o método `POST` é usado para permitir o envio de um `payload` estruturado e detalhado.
    *   **Autenticação:** `Bearer Token`. Todas as operações de tickets exigem que o usuário esteja logado.
    *   **Corpo da Requisição (Estrutura Genérica):**
        ```json
        {
          "action": "ACTION_NAME",
          "payload": { ... }
        }
        ```
        A chave `"action"` é a mais importante aqui. Ela funciona como um roteador dentro da Edge Function, direcionando a lógica para o manipulador correto.

    *   **Ações Disponíveis (baseado nos exemplos):**
        *   `"action": "create_ticket"`: Cria um novo ticket de suporte.
            *   **Payload:** `{ "subject": "...", "message": "...", "attachment_url": "..." }`
        *   `"action": "list_tickets"`: Lista os tickets do usuário logado.
            *   **Payload:** `{}` (provavelmente suporta paginação, ex: `{ "page": 1, "per_page": 10 }`)
        *   `"action": "send_message"`: Adiciona uma nova mensagem a um ticket existente.
            *   **Payload:** `{ "ticket_id": "...", "message": "..." }`
        *   `"action": "get_messages"`: Lista as mensagens de um ticket específico.
            *   **Payload:** `{ "ticket_id": "...", "page": 1, "per_page": 10 }`
        *   `"action": "check_unread_messages"`: Verifica se há mensagens não lidas.
            *   **Payload:** `{}`
        *   `"action": "mark_message_read"`: Marca todas as mensagens de um ticket como lidas.
            *   **Payload:** `{ "ticket_id": "..." }`
        *   `"action": "get_ticket"`: Busca os detalhes de um único ticket.
            *   **Payload:** `{ "ticket_id": "..." }`
        *   `"action": "get_metrics"`: Obtém métricas relacionadas aos tickets (provavelmente para administradores).
            *   **Payload:** `{}`
        *   `"action": "update_status"`: Altera o status de um ticket (ex: para "closed").
            *   **Payload:** `{ "ticket_id": "...", "status": "closed" }`

    *   **Uso no Aplicativo:** O seu app terá uma seção de "Suporte". Para cada ação (criar, visualizar, responder), o app fará uma chamada à mesma Edge Function, mas com a `"action"` e `"payload"` correspondentes. Por exemplo:
        ```javascript
        // Para criar um ticket
        await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'create_ticket',
            payload: { subject, message }
          }
        });
        
        // Para listar os tickets
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'list_tickets',
            payload: {}
          }
        });
        ```

---

### Módulo: Transações Financeiras

#### **6. Criação de Transações**
*   **Endpoint:** `POST /functions/v1/transactions`
*   **Objetivo:** Endpoint principal para processar pagamentos (PIX, Cartão de Crédito).
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/functions/v1/transactions`
    *   **Método:** `POST`, pois está criando um recurso de transação.
    *   **Autenticação:** `Bearer Token` para transações em modo de desenvolvimento/logado. A requisição de produção mostra autenticação `Basic`, sugerindo que ela pode ser chamada por um sistema externo (servidor de e-commerce) usando chaves de API, e não diretamente por um usuário final.
    *   **Cabeçalhos:** `Content-Type: application/json` e `accept: application/json`.
    *   **Corpo da Requisição:** Um JSON muito rico e detalhado contendo todas as informações necessárias para uma transação.
        *   `customer`: Dados do cliente (nome, email, documento).
        *   `shipping`: Informações de entrega.
        *   `paymentMethod`: Tipo de pagamento (`PIX`, `CARD`, etc.).
        *   `card`: Dados do cartão (número, nome, validade, CVV) ou `hash` do cartão.
        *   `pix`: Configurações do PIX (como dias para expirar).
        *   `items`: Array com os produtos da compra.
        *   `amount`: Valor total em centavos.
        *   `postbackUrl`: URL para receber notificações de status da transação.
        *   `metadata`: Dados adicionais para rastreamento.
    *   **Uso no Aplicativo:** Para o aplicativo móvel, é provável que um fluxo de "Link de Pagamento" seja mais comum. Se o app permitir checkout direto, ele coletará os dados do cliente e do pagamento e enviará para este endpoint para iniciar a transação. O `access_token` será do usuário logado (cliente final) ou do vendedor que está criando a cobrança.

#### **7. Obtenção de Credenciais**
*   **Endpoint:** `GET /functions/v1/credentials`
*   **Objetivo:** Provavelmente busca as chaves de API ou credenciais de um usuário/empresa para interagir com o gateway de pagamento.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/functions/v1/credentials`
    *   **Método:** `GET`, para recuperar informações.
    *   **Autenticação:** `Bearer Token`, exigindo que o usuário (provavelmente o dono da loja/empresa) esteja logado.
    *   **Uso no Aplicativo:** Em uma seção de "Configurações" ou "Integrações", o dono da empresa poderia usar esta função para visualizar suas chaves de API para configurar seu e-commerce, por exemplo.

#### **8. Webhook de Transações**
*   **Endpoint:** `POST /functions/v1/webhookfx`
*   **Objetivo:** Receber notificações (webhooks) de um provedor de pagamento externo (BaaS) sobre mudanças de status de transações (ex: PIX recebido, estorno).
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/functions/v1/webhookfx`
    *   **Método:** `POST`, que é o padrão para recebimento de webhooks.
    *   **Autenticação:** Aparentemente `Bearer Token`. Isso é uma medida de segurança para garantir que apenas o provedor autorizado possa enviar notificações para o seu webhook. O provedor seria configurado para enviar este token a cada notificação.
    *   **Corpo da Requisição:** A estrutura do corpo é definida pelo provedor de pagamento. No exemplo, vemos um campo `event` (ex: `transaction.PixIn`) e um objeto `data` com todos os detalhes da transação.
    *   **Uso no Aplicativo:** Este endpoint **não é chamado pelo aplicativo móvel**. Ele é configurado no painel do seu provedor de pagamentos para que o provedor notifique seu backend Supabase sempre que o status de um pagamento mudar. O app, por sua vez, pode receber atualizações em tempo real sobre a transação através do Supabase Realtime, que seria acionado pela Edge Function `webhookfx` após ela processar a notificação.

---

### Módulo: Subcontas (Marketplace)

#### **9. Proxy para Operações de Marketplace**
*   **Endpoint:** `POST /proxy`
*   **Objetivo:** Funciona como um gateway seguro para um provedor de marketplace (como a Iugu). Ele evita que o app precise conhecer os detalhes da API externa.
*   **Análise Detalhada:**
    *   **URL:** `https://slsikrvjbpblioyinsxu.supabase.co/proxy`
    *   **Método:** `POST`.
    *   **Autenticação:** `Bearer Token`, para garantir que apenas usuários autorizados do seu sistema possam usar o proxy.
    *   **Corpo da Requisição:** Contém as informações que a Edge Function "proxy" usará para montar a requisição para o serviço final.
        *   `endpoint`: O caminho da API do serviço final (ex: `/v1/marketplace/create_account`).
        *   `payload`: O corpo da requisição que será enviado ao serviço final.
    *   **Uso no Aplicativo:** Ao invés de integrar diretamente com a Iugu no app, o app faz uma chamada para `/functions/v1/proxy`, passando a ação desejada. A Edge Function no Supabase então adiciona as chaves de API secretas e repassa a chamada para a Iugu, devolvendo a resposta ao app.

#### **10. Envio de Documentos (KYC) de Subconta**
*   **Endpoint:** `POST /request_verification`
*   **Objetivo:** Enviar os dados de verificação ("Know Your Customer") de um vendedor para aprovação da subconta no marketplace.
*   **Análise Detalhada:**
    *   **URL:** `http://{{base_url}}:3000/request_verification`  
        Esta URL é diferente. Parece ser uma API Route do Next.js rodando em desenvolvimento (na porta 3000). Em produção, ela estaria na mesma `base_url` do app web. É um endpoint BFF.
    *   **Corpo da Requisição:** Um JSON detalhado com os dados cadastrais da empresa (`cnpj`, `address`, `bank`, etc.) e URLs para os arquivos de documentos (`identification`, `selfie`, `social_contract`).
    *   **Uso no Aplicativo:** O aplicativo terá um fluxo de onboarding para vendedores onde eles preencherão seus dados e farão upload de documentos. No final, o app enviará este JSON completo para a API, que orquestrará o envio para o provedor de pagamentos (Iugu).

#### **11. Gerenciamento de Webhooks (Iugu)**
*   **Endpoint:** `POST /v1/web_hooks`
*   **Objetivo:** Criar e listar webhooks no provedor de pagamentos (Iugu).
*   **Análise Detalhada:**
    *   **URL:** A URL base parece ser `api.iugu.com` (ocultada pela `{{base_url}}`), com a chave da API passada como query param.
    *   **Importante:** Essas requisições são para a API da Iugu diretamente. Elas provavelmente seriam feitas **apenas pelo administrador do sistema** através de uma interface de admin ou de uma Edge Function, e não pelo aplicativo móvel.

#### **12. Gerenciamento de Subcontas no Backend**
*   **Endpoint:** `POST /functions/v1/subconta`
*   **Objetivo:** Orquestrar o processo completo de criação de subconta e envio de KYC, abstraindo a complexidade para o cliente.
*   **Análise Detalhada:**
    *   **Corpo da Requisição:** Pede o `companyId` do seu sistema e os dados da conta.
    *   **Uso no Aplicativo:** Este seria o endpoint principal que o app chamaria. O app envia os dados simplificados e a Edge Function se encarrega de:
        1.  Chamar o provedor (Iugu) para criar a subconta (usando a Rota Proxy).
        2.  Receber os IDs da subconta.
        3.  Salvar esses IDs no seu banco de dados.
        4.  Preparar e enviar os documentos para verificação (usando a rota `/request_verification`).

#### **13. Reenvio de Documentos (KYC)**
*   **Endpoint:** `PUT /functions/v1/subconta/resend_documents`
*   **Objetivo:** Permitir o reenvio de um documento específico caso ele tenha sido recusado na análise inicial do KYC.
*   **Uso no Aplicativo:** Se o status do KYC de um vendedor voltar como "rejeitado com motivo X", o app pode oferecer a ele a opção de reenviar o documento. Esta função seria chamada para atualizar a URL do arquivo no provedor.

#### **14. Verificação de Status da Subconta**
*   **Endpoint:** `POST /functions/v1/subconta/checkstatus`
*   **Objetivo:** Consultar o status atual de uma subconta no provedor de pagamento.
*   **Uso no Aplicativo:** O app pode usar essa função para atualizar o status do onboarding do vendedor em tempo real ou sob demanda, mostrando se a conta está "em análise", "aprovada" ou "rejeitada".

#### **15. Verificação de Status do KYC**
*   **Endpoint:** `POST /functions/v1/subconta/check_kyc`
*   **Objetivo:** Focado especificamente em consultar o status da verificação de documentos (KYC).
*   **Uso no Aplicativo:** Similar ao `checkstatus`, mas mais granular, permitindo ao app mostrar ao vendedor exatamente qual etapa da verificação está pendente ou foi recusada.

---

### Módulo: Logs e Taxas

#### **16. Visualização de Logs de Auditoria**
*   **Endpoint:** `GET /functions/v1/audit-log`
*   **Objetivo:** Recuperar um registro de ações importantes realizadas no sistema.
*   **Uso no Aplicativo:** Esta funcionalidade é tipicamente para administradores. Em um app móvel, poderia haver uma seção de "Log de Atividades" em uma área administrativa para monitorar ações de usuários.

#### **17. Cálculo de Taxas**
*   **Endpoint:** `POST /functions/v1/taxas`
*   **Objetivo:** Calcular o valor final de uma transação, incluindo taxas, com base no valor, método de pagamento e número de parcelas.
*   **Uso no Aplicativo:** Extremamente útil na tela de checkout ou em uma calculadora de taxas. Antes de o cliente finalizar a compra, o app envia os dados da transação para este endpoint e exibe o valor das taxas e o total a ser pago, ou o valor líquido que o vendedor receberá, proporcionando transparência.

---

### Módulo: Administração de Chaves PIX

#### **18. Listagem de Chaves PIX (Admin)**
*   **Endpoint:** `GET /functions/v1/pix-key`
*   **Objetivo:** Para um administrador, listar todas as chaves PIX cadastradas no sistema. Para um usuário comum (passando `user_id` na query), listar suas próprias chaves.
*   **Uso no Aplicativo:**
    *   **Visão do Usuário:** Numa tela de "Minha Conta > Chaves PIX", o app chamaria este endpoint para exibir as chaves que o usuário já cadastrou, permitindo que ele gerencie-as.
    *   **Visão do Admin:** Em uma interface administrativa, este endpoint preencheria uma tabela de todas as chaves pendentes de aprovação ou já aprovadas.

#### **19. Aprovação/Reprovação de Chave PIX**
*   **Endpoint:** `PATCH /functions/v1/pix-key/:id/approve`
*   **Objetivo:** Ação exclusiva de administrador para aprovar ou reprovar uma chave PIX submetida por um usuário.
*   **Uso no Aplicativo:** Esta funcionalidade seria exclusiva da versão administrativa do app. O administrador veria a lista de chaves pendentes e, ao tocar em "Aprovar" ou "Reprovar", o app chamaria este endpoint com o ID da chave e o novo status (`"v": true` ou `"v": false`).

#### **20. Criação de Chave PIX**
*   **Endpoint:** `POST /functions/v1/pix-key`
*   **Objetivo:** Permitir que um usuário logado cadastre uma nova chave PIX para recebimento de saques.
*   **Uso no Aplicativo:** Na tela de "Adicionar Chave PIX", o usuário preencheria um formulário com a chave, tipo e descrição. O app enviaria esses dados para este endpoint.

#### **21. Atualização de Chave PIX**
*   **Endpoint:** `PUT /functions/v1/pix-key/:id`
*   **Objetivo:** Permitir que um usuário edite os dados de uma chave PIX já cadastrada.
*   **Uso no Aplicativo:** Ao lado de cada chave listada, haveria um botão "Editar". Ao ser pressionado, um formulário pré-preenchido apareceria, e ao salvar, o app faria uma chamada `PUT` para este endpoint com o ID da chave e os dados atualizados.

---

### Módulo: Configurações e Personalização

#### **22. Gestão de Termos de Uso**
*   **Endpoints:**
    *   `GET /functions/v1/configuracoes/termos`
    *   `PUT /functions/v1/configuracoes/termos`
*   **Objetivo:** O `GET` busca o conteúdo atual dos termos de uso. O `PUT` permite que um administrador atualize esse conteúdo.
*   **Uso no Aplicativo:**
    *   `GET`: O app chamaria este endpoint para exibir os termos de uso em uma tela dedicada ou em um modal durante o cadastro.
    *   `PUT`: Ação exclusiva de um painel administrativo, não seria usada no app do usuário final.

#### **23. Gestão de Configurações Gerais da Plataforma**
*   **Endpoints:**
    *   `GET /functions/v1/configuracoes`
    *   `PUT /functions/v1/configuracoes`
*   **Objetivo:** Gerenciar configurações globais do sistema, como regras de chargeback, taxas de saque, se contas de pessoa física são permitidas, etc.
*   **Uso no Aplicativo:** O `GET` pode ser usado pelo app para buscar regras de negócio que afetam a UI (ex: se a calculadora de taxas está ativa). O `PUT` é uma operação estritamente administrativa.

#### **24. Gestão da Personalização Visual (Whitelabel)**
*   **Endpoints:**
    *   `GET /functions/v1/personalization`
    *   `PUT /functions/v1/personalization`
*   **Objetivo:** Buscar e definir as configurações de aparência da plataforma (cores, logos, fontes).
*   **Uso no Aplicativo:** O `GET` é fundamental. Ao iniciar, o app chamaria este endpoint para buscar o tema visual (cores primárias, secundárias, logos) e aplicá-lo dinamicamente a toda a interface, garantindo que o app reflita a identidade visual do whitelabel. O `PUT` é uma operação administrativa.

#### **25. Visualização de Configurações da Empresa**
*   **Endpoint:** `GET /functions/v1/config-companie-view`
*   **Objetivo:** Obter uma visão consolidada e pública das configurações aplicáveis a uma empresa.
*   **Uso no Aplicativo:** Útil para exibir ao usuário logado quais configurações estão ativas para sua conta (ex: "Transferência automática: Ativada").

---

### Módulo: Clientes (CRM)

#### **26. Gerenciamento de Clientes**
*   **Endpoints:**
    *   `GET /functions/v1/clientes` (com queries para filtrar/paginar)
    *   `GET /functions/v1/clientes/:id`
    *   `POST /functions/v1/clientes`
    *   `PUT /functions/v1/clientes`
*   **Objetivo:** Um CRUD completo para a entidade "Cliente". Permite criar, listar, buscar por ID e atualizar clientes associados a uma empresa.
*   **Uso no Aplicativo:** O app teria uma seção "Clientes".
    *   `GET /.../clientes`: Para listar todos os clientes em uma lista paginada, com uma barra de busca que adicionaria a query `taxid` ou `name`.
    *   `POST /.../clientes`: Para o formulário de "Adicionar Novo Cliente".
    *   `GET /.../clientes/:id`: Ao tocar em um cliente da lista, o app buscaria seus detalhes completos para exibir em uma tela de perfil.
    *   `PUT /.../clientes`: Para salvar as alterações feitas no formulário de edição do perfil do cliente.

---

### Módulo: Link de Pagamento

#### **27. Gerenciamento de Links de Pagamento**
*   **Endpoints:**
    *   `GET /functions/v1/link-pagamentos` (listar com filtros)
    *   `GET /functions/v1/link-pagamentos?id=:id` (buscar por ID)
    *   `POST /functions/v1/link-pagamentos` (criar)
    *   `PATCH /functions/v1/link-pagamentos/:id` (editar)
*   **Objetivo:** CRUD para criar e gerenciar links de pagamento reutilizáveis.
*   **Uso no Aplicativo:** O app teria uma seção "Links de Pagamento".
    *   `GET` (listar): Exibiria a lista de links criados pelo usuário.
    *   `POST`: Formulário para "Criar Novo Link", onde o vendedor define nome, valor, métodos de pagamento, etc.
    *   `PATCH`: Para a tela de edição de um link existente.
    *   `GET` (por ID): Para visualizar os detalhes de um link específico antes de editar.

#### **28. Visualização Pública de Link de Pagamento**
*   **Endpoint:** `GET /functions/v1/link-pagamento-view/:id`
*   **Objetivo:** Endpoint público (ou que requer apenas o ID) para buscar os dados de um link a ser renderizado na página de checkout.
*   **Uso no Aplicativo:** Quando um cliente final abre um link de pagamento (compartilhado via WhatsApp, por exemplo), o app (ou uma webview dentro do app) usaria este endpoint para buscar os detalhes do produto/serviço (nome, valor, logo) e renderizar a tela de pagamento.

---

### Módulo: Padrões e Configurações de Empresa

#### **29. Gestão de Configurações Padrão**
*   **Endpoints:**
    *   `GET /functions/v1/standard`
    *   `PATCH /functions/v1/standard/last`
*   **Objetivo:** Definir e buscar os "templates" ou configurações padrão que são aplicadas a novas empresas criadas.
*   **Uso no Aplicativo:** Funcionalidade exclusivamente administrativa. Não seria usada no app do cliente final.

---

### Módulo: Usuários e Permissões

#### **30. Gerenciamento de Usuários (Admin)**
*   **Endpoints:**
    *   `GET /functions/v1/users` (listar todos)
    *   `GET /functions/v1/users/:id` (buscar por ID)
    *   `GET /functions/v1/users/:id/apikey` (obter chave de API)
    *   `GET /functions/v1/users/:id/permissions` (ver permissões)
    *   `POST /functions/v1/users/create` (criar usuário)
    *   `PATCH /functions/v1/users/:id/edit` (editar perfil)
    *   `POST /functions/v1/users/register` (criar usuário + empresa)
*   **Objetivo:** CRUD completo para gerenciamento de usuários.
*   **Uso no Aplicativo:**
    *   **Visão de Usuário:** O usuário logado usaria o endpoint de edição (`/edit`) para atualizar seu próprio perfil (nome, telefone, foto).
    *   **Visão de Admin:** A maioria desses endpoints seria usada em um painel administrativo no app para listar, criar, editar e gerenciar permissões de todos os usuários da plataforma.

#### **31. Gerenciamento de Permissões de Usuário**
*   **Endpoint:** `PATCH /functions/v1/users/:id/permissions`
*   **Objetivo:** Atualizar o nível de acesso (se é admin) e as permissões específicas de um usuário.
*   **Uso no Aplicativo:** Ação exclusiva de um painel de administração, onde o admin poderia marcar checkboxes de permissões para um determinado usuário e, ao salvar, o app faria a chamada para este endpoint.

---

### Módulo: Financeiro (Carteira, Saques, Antecipações)

#### **32. Consulta de Carteira (Wallet)**
*   **Endpoint:** `GET /functions/v1/wallet`
*   **Objetivo:** Obter o resumo financeiro da carteira de um usuário, incluindo saldos disponíveis, a receber e reserva financeira.
*   **Uso no Aplicativo:** Essencial para a tela principal ou para a seção "Carteira" do app. O app chamaria este endpoint para exibir os saldos do usuário logado (`?userId=...` seria o ID do próprio usuário).

#### **33. Consulta de Extrato**
*   **Endpoint:** `GET /functions/v1/extrato/:userId`
*   **Objetivo:** Obter o histórico de movimentações financeiras (entradas e saídas) da conta de um usuário.
*   **Uso no Aplicativo:** Preencheria a lista de transações na tela de "Extrato" do app, com suporte a paginação (`limit` e `offset`).

#### **34. Solicitação de Antecipação**
*   **Endpoint:** `POST /functions/v1/antecipacoes/create`
*   **Objetivo:** Permitir que um usuário solicite a antecipação de seus recebíveis de cartão de crédito.
*   **Uso no Aplicativo:** Na tela de "Valores a Receber", haveria um botão "Antecipar Saldo". Ao ser pressionado, o app faria a chamada para este endpoint.

#### **35. Gerenciamento de Antecipações (Admin)**
*   **Endpoints:**
    *   `GET /functions/v1/antecipacoes/anticipations`
    *   `POST /functions/v1/antecipacoes/approve`
    *   `PATCH /functions/v1/antecipacoes/deny`
*   **Objetivo:** Listar, aprovar e negar solicitações de antecipação.
*   **Uso no Aplicativo:** Funcionalidade exclusiva de um painel de administração para gerenciar o fluxo de aprovação das antecipações solicitadas pelos usuários.

#### **36. Solicitação de Saque**
*   **Endpoint:** `POST /functions/v1/withdrawals`
*   **Objetivo:** Permitir que um usuário solicite a retirada do seu saldo disponível para sua chave PIX cadastrada.
*   **Uso no Aplicativo:** Na tela da "Carteira", o usuário digitaria o valor, selecionaria a chave PIX e confirmaria. O app então chamaria este endpoint para registrar a solicitação de saque.

#### **37. Gerenciamento de Saques (Admin)**
*   **Endpoints:**
    *   `GET /functions/v1/saques`
    *   `PATCH /functions/v1/withdrawals/:id` (com status `approved`, `cancelled`, `done_manual`)
*   **Objetivo:** Listar, aprovar, negar e marcar saques como pagos manualmente.
*   **Uso no Aplicativo:** Funcionalidade exclusiva do painel de administração para processar os pedidos de saque dos usuários.

#### **38. Gestão Manual de Saldo (Admin)**
*   **Endpoints:**
    *   `POST /functions/v1/wallet/remove-balance`
    *   `POST /functions/v1/wallet/balance-management`
*   **Objetivo:** Permitir que um administrador adicione ou remova saldo manualmente da carteira de um usuário, com um motivo.
*   **Uso no Aplicativo:** Ferramenta administrativa para correções de saldo ou ajustes manuais, acessível apenas por administradores.

---

### Módulo: Empresa

#### **39. Gerenciamento de Empresas (Admin)**
*   **Endpoints:**
    *   `GET /functions/v1/companies` (listar todas)
    *   `GET /functions/v1/companies/contagem` (contar)
    *   `GET /functions/v1/companies/:id` (buscar por ID)
    *   `POST /functions/v1/companies` (criar)
    *   `PATCH /functions/v1/companies/:id/status` (bloquear/aprovar/negar)
    *   `PATCH /functions/v1/companies/:id/taxas` (atualizar taxas individuais)
    *   `PATCH /functions/v1/companies/:id/taxas-bulk` (atualizar taxas em massa)
    *   `PATCH /functions/v1/companies/:id/config` (atualizar permissões)
    *   `PATCH /functions/v1/companies/:id/config-bulk` (atualizar permissões em massa)
    *   `PATCH /functions/v1/companies/:id/reserva` (atualizar reserva)
    *   `PATCH /functions/v1/companies/:id/adq` (atualizar adquirente)
    *   `PATCH /functions/v1/companies/:id/docs` (atualizar documentos)
*   **Objetivo:** CRUD completo e gerenciamento de configurações para a entidade "Empresa".
*   **Uso no Aplicativo:** A maioria esmagadora dessas rotas é para o painel administrativo. O app de um usuário final (vendedor) usaria:
    *   `GET /companies/:id`: Para buscar os dados da sua própria empresa e exibir no perfil.
    *   `GET /companies/:id/taxas`: Para exibir as taxas atuais da sua conta.
    *   `GET /companies/:id/config`: Para verificar suas permissões (ex: se pode antecipar).
    *   `PATCH /companies/:id/docs`: Para o fluxo de envio e atualização de documentos de KYC.

---
### Módulo: Adquirentes

#### **40. Gerenciamento de Adquirentes (Admin)**
*   **Endpoints:**
    *   `GET /functions/v1/acquirers` (listar)
    *   `GET /functions/v1/acquirers/:id` (buscar por ID)
    *   `GET /functions/v1/acquirers/:id/taxas` (ver taxas)
    *   `PATCH /functions/v1/acquirers/:id/active` (ativar/desativar)
    *   `PATCH /functions/v1/acquirers/:id/taxas` (editar taxas)
*   **Objetivo:** Gerenciamento completo dos gateways de pagamento integrados.
*   **Uso no Aplicativo:** Exclusivamente para o painel de administração, permitindo configurar quais adquirentes estão ativos e suas taxas base.

---
### Módulo: BaaS (Banking as a Service)

#### **41. Gerenciamento de BaaS (Admin)**
*   **Endpoints:**
    *   `GET /functions/v1/baas` (listar)
    *   `GET /functions/v1/baas/:id` (buscar por ID)
    *   `GET /functions/v1/baas/:id/taxas` (ver taxas)
    *   `PATCH /functions/v1/baas/:id/active` (ativar/desativar)
    *   `PATCH /functions/v1/baas/:id/taxa` (editar taxas)
*   **Objetivo:** Gerenciar os provedores de Banking as a Service.
*   **Uso no Aplicativo:** Exclusivamente para o painel de administração.

---

### Módulo: Dashboard e Relatórios

#### **42. Agregação de Dados para Dashboard**
*   **Endpoints:**
    *   `POST /functions/v1/dados-dashboard`
    *   `GET /functions/v1/analytics-reports/top-sellers/...`
    *   `POST /functions/v1/dados-dashboard/top-produtos`
    *   `POST /functions/v1/dados-dashboard/grafico`
    *   `POST /functions/v1/dados-dashboard/infos-adicionais`
    *   `POST /functions/v1/dados-dashboard/top-sellers`
    *   `POST /functions/v1/dados-dashboard/providers`
    *   `POST /functions/v1/dados-dashboard/acquirer`
*   **Objetivo:** Conjunto de endpoints otimizados para buscar dados agregados e prontos para serem exibidos em gráficos e cartões no dashboard.
*   **Uso no Aplicativo:** O app usará intensivamente esses endpoints para construir a tela de dashboard, tanto para o usuário final (vendedor, vendo seus próprios dados) quanto para o administrador (vendo dados de toda a plataforma). Cada endpoint corresponde a um componente visual específico (gráfico de faturamento, lista de produtos mais vendidos, etc.).

---
### Módulo: Análise de Risco

#### **43. Execução de Análise de Risco**
*   **Endpoint:** `POST /functions/v1/risk`
*   **Objetivo:** Realizar uma análise de risco sobre uma operação, como um saque.
*   **Uso no Aplicativo:** Esta função provavelmente é chamada internamente por outra Edge Function (como a de "Criar Saque") como parte do fluxo de processamento, e não diretamente pelo app. Ela centraliza as regras de negócio para aprovação ou negação automática de operações baseadas em risco.
---

### Módulo: Faturas

#### **44. Listar Faturas**
*   **Endpoint:** `GET /functions/v1/billings`
*   **Objetivo:** Obter o histórico de faturas de um usuário ou de todas as empresas (se for um administrador). Essas faturas provavelmente se referem a cobranças de mensalidade, taxas de serviço da plataforma ou outros encargos.
*   **Análise Detalhada:**
    *   **URL:** `https://{{base_url}}/functions/v1/billings`
    *   **Método:** `GET`, ideal para recuperar uma lista de recursos.
    *   **Autenticação:** `Bearer Token`. A requisição exige que o usuário esteja logado. A Edge Function no backend deve filtrar as faturas para retornar apenas as do usuário autenticado, a menos que o usuário seja um administrador.
    *   **Parâmetros de Query (prováveis):** Embora não estejam na URL de exemplo, endpoints de listagem como este geralmente suportam `limit` e `offset` para paginação, e filtros como `status` (`paid`, `pending`) e por período (`startDate`, `endDate`).
    *   **Uso no Aplicativo:** O app teria uma seção "Minhas Faturas" ou "Cobranças". Ao entrar nessa tela, o app faria a chamada para este endpoint para popular uma lista, onde cada item mostraria o valor, data de vencimento e status da fatura.

#### **45. Marcar Fatura como Paga**
*   **Endpoint:** `PATCH /functions/v1/billings/pay`
*   **Objetivo:** Atualizar o status de uma fatura específica para "paga". Esta é uma ação tipicamente administrativa.
*   **Análise Detalhada:**
    *   **URL:** `https://{{base_url}}/functions/v1/billings/pay`. O caminho `/pay` indica uma ação específica sobre o recurso de faturas.
    *   **Método:** `PATCH`, apropriado para uma atualização parcial de um recurso (neste caso, apenas o status).
    *   **Autenticação:** `Bearer Token`. A lógica na Edge Function certamente restringiria esta ação a usuários com permissões de administrador.
    *   **Corpo da Requisição:**
        ```json
        {
          "billingId": "401ba635-681c-439e-b084-7a37d4cc7814"
        }
        ```
        Identifica qual fatura deve ser atualizada.
    *   **Uso no Aplicativo:** Esta funcionalidade seria implementada em uma versão administrativa do app. Um administrador, ao confirmar um pagamento manual (ex: transferência bancária), usaria uma interface para selecionar a fatura e marcá-la como paga, o que acionaria esta chamada. Não seria acessível ao usuário final.

---

### Módulo: BaaS (Banking as a Service)

Este módulo inteiro é destinado à configuração do backend e seria utilizado apenas em um painel administrativo do app.

#### **46. Listar Provedores BaaS**
*   **Endpoint:** `GET /functions/v1/baas`
*   **Objetivo:** Obter a lista de todos os provedores de "Banking as a Service" configurados na plataforma.
*   **Uso no Aplicativo (Admin):** Em uma tela de "Configurações > Integrações BaaS", o app chamaria este endpoint para exibir os provedores disponíveis.

#### **47. Buscar Provedor BaaS por ID**
*   **Endpoint:** `GET /functions/v1/baas/:id`
*   **Objetivo:** Recuperar os detalhes de configuração de um provedor BaaS específico.
*   **Uso no Aplicativo (Admin):** Ao selecionar um provedor da lista, o app chamaria este endpoint para preencher um formulário de edição com as informações atuais.

#### **48. Consultar Taxas do BaaS**
*   **Endpoint:** `GET /functions/v1/baas/:id/taxas`
*   **Objetivo:** Obter a estrutura de taxas associada a um provedor BaaS.
*   **Uso no Aplicativo (Admin):** Na tela de detalhes do provedor, esta chamada preencheria a seção de taxas e tarifas.

#### **49. Ativar/Desativar BaaS**
*   **Endpoint:** `PATCH /functions/v1/baas/:id/active`
*   **Objetivo:** Ativar ou desativar a integração com um provedor BaaS.
*   **Uso no Aplicativo (Admin):** Um switch ou botão na tela de detalhes do BaaS permitiria ao administrador ativar/desativar o serviço, acionando esta chamada.

#### **50. Alterar Taxa do BaaS**
*   **Endpoint:** `PATCH /functions/v1/baas/:id/taxa`
*   **Objetivo:** Atualizar o valor de uma taxa específica do provedor BaaS.
*   **Uso no Aplicativo (Admin):** O administrador editaria o valor da taxa em um campo de texto e, ao salvar, o app enviaria o novo valor no corpo da requisição para este endpoint.

---

### Módulo: Adquirentes (Gateways de Pagamento)

Assim como o módulo BaaS, este é um módulo de configuração administrativa.

#### **51. Listar Adquirentes**
*   **Endpoint:** `GET /functions/v1/acquirers`
*   **Objetivo:** Obter a lista de todos os gateways de pagamento (adquirentes) integrados à plataforma.
*   **Uso no Aplicativo (Admin):** Preencheria uma lista na seção "Configurações > Gateways de Pagamento".

#### **52. Buscar Adquirente por ID**
*   **Endpoint:** `GET /functions/v1/acquirers/:id`
*   **Objetivo:** Obter os detalhes completos de um adquirente específico.
*   **Uso no Aplicativo (Admin):** Usado para popular a tela de edição de um adquirente selecionado.

#### **53. Consultar Taxas do Adquirente**
*   **Endpoint:** `GET /functions/v1/acquirers/:id/taxas`
*   **Objetivo:** Recuperar todas as taxas configuradas para um adquirente (taxas de PIX, boleto, MDR de cartão para 1 a 12 parcelas).
*   **Uso no Aplicativo (Admin):** Na tela de edição do adquirente, esta chamada preencheria todos os campos de taxas.

#### **54. Ativar/Desativar Métodos de Pagamento do Adquirente**
*   **Endpoint:** `PATCH /functions/v1/acquirers/:id/active`
*   **Objetivo:** Habilitar ou desabilitar o processamento de PIX, Boleto e/ou Cartão para um adquirente específico em toda a plataforma.
*   **Uso no Aplicativo (Admin):** O administrador usaria checkboxes ou toggles para cada método de pagamento (PIX, Boleto, Cartão) e, ao salvar, o app enviaria o estado (`true`/`false`) para este endpoint.

#### **55. Alterar Taxas do Adquirente**
*   **Endpoint:** `PATCH /functions/v1/acquirers/:id/taxas`
*   **Objetivo:** Atualizar a tabela de taxas (MDRs, taxas fixas, etc.) de um adquirente.
*   **Uso no Aplicativo (Admin):** O administrador preencheria um formulário complexo com todas as taxas e, ao salvar, o app enviaria o corpo JSON completo para este endpoint.

---

### Módulo: Empresa

Este módulo gerencia as contas dos vendedores/lojistas na plataforma.

#### **56. Listar Todas as Empresas**
*   **Endpoint:** `GET /functions/v1/companies`
*   **Objetivo:** Obter uma lista paginada de todas as empresas cadastradas, com a possibilidade de filtrar por status.
*   **Uso no Aplicativo (Admin):** Endpoint central para o painel de administração, para listar todas as empresas em abas como "Aprovadas", "Pendentes", "Recusadas". O app implementaria paginação e filtros com base nos parâmetros de query.

#### **57. Obter Contagem de Empresas**
*   **Endpoint:** `GET /functions/v1/companies/contagem`
*   **Objetivo:** Obter a contagem total de empresas, provavelmente agrupadas por status.
*   **Uso no Aplicativo (Admin):** Útil para exibir badges ou contadores no painel administrativo (ex: "15 empresas pendentes de aprovação").

#### **58. Buscar Detalhes de uma Empresa**
*   **Endpoint:** `GET /functions/v1/companies/:id`
*   **Objetivo:** Obter todos os dados cadastrais de uma empresa específica.
*   **Uso no Aplicativo:**
    *   **Admin:** Ao selecionar uma empresa da lista, o app chamaria este endpoint para exibir todos os seus detalhes em uma tela de visualização/gerenciamento.
    *   **Usuário Final:** O usuário logado usaria este endpoint para carregar os dados de sua própria empresa na tela "Meu Perfil" ou "Dados da Empresa".

#### **59. Gerenciar Configurações, Taxas e Documentos da Empresa**
*   **Endpoints:**
    *   `GET /functions/v1/companies/:id/taxas` (Ver taxas)
    *   `GET /functions/v1/companies/:id/reserva` (Ver regras de reserva)
    *   `GET /functions/v1/companies/:id/config` (Ver permissões e limites)
    *   `GET /functions/v1/companies/:id/docs` (Ver URLs dos documentos)
    *   `GET /functions/v1/companies/:id/adq` (Ver adquirentes configurados)
    *   `GET /functions/v1/companies/:id/financial-info` (Ver resumo financeiro)
    *   `PATCH /functions/v1/companies/:id/taxas` (Atualizar taxas)
    *   `PATCH /functions/v1/companies/:id/reserva` (Atualizar reserva)
    *   `PATCH /functions/v1/companies/:id/config` (Atualizar permissões)
    *   `PATCH /functions/v1/companies/:id/adq` (Atualizar adquirentes)
    *   `PATCH /functions/v1/companies/:id/docs` (Atualizar URLs de documentos)
*   **Objetivo:** Fornecem um controle granular sobre todos os aspectos de uma conta de empresa.
*   **Uso no Aplicativo:**
    *   **Usuário Final:** Usaria o `GET /.../docs` e `PATCH /.../docs` para o fluxo de envio de documentos. Usaria os outros `GET` para visualizar suas configurações atuais.
    *   **Admin:** Usaria todos os `GET` e `PATCH` para gerenciar completamente uma conta de cliente a partir de um painel detalhado no app administrativo. Por exemplo, poderia ajustar as taxas de um cliente específico, alterar suas regras de reserva ou configurar um adquirente diferente para ele.

#### **60. Atualizar Configurações/Taxas em Massa**
*   **Endpoints:**
    *   `PATCH /functions/v1/companies/:id/taxas-bulk`
    *   `PATCH /functions/v1/companies/:id/config-bulk`
*   **Objetivo:** Aplicar um conjunto de taxas ou configurações a *todas* as empresas de uma vez. O `:id` na URL parece ser um resquício e talvez não seja utilizado, pois a ação é em massa.
*   **Uso no Aplicativo (Admin):** Ferramenta poderosa no painel de administração para aplicar reajustes de taxas ou novas regras de negócio para todos os clientes da plataforma simultaneamente.

#### **61. Alterar Status da Empresa**
*   **Endpoint:** `PATCH /functions/v1/companies/:id/status`
*   **Objetivo:** Aprovar, negar ou bloquear uma empresa.
*   **Uso no Aplicativo (Admin):** Na tela de detalhes de uma empresa pendente, o administrador teria os botões "Aprovar" e "Recusar". Se recusar, um modal pediria o motivo. O app então chamaria este endpoint com o `status` apropriado e, se aplicável, o `reason`.

#### **62. Criar Nova Empresa**
*   **Endpoint:** `POST /functions/v1/companies`
*   **Objetivo:** Criar um novo registro de empresa (um vendedor/lojista) na plataforma. Esta é uma ação fundamentalmente administrativa ou parte de um fluxo de cadastro inicial.
*   **Análise Detalhada:**
    *   **URL:** `https://{{base_url}}/functions/v1/companies`. Chama a Edge Function `companies` para executar a lógica de criação.
    *   **Método:** `POST`, semanticamente correto para a criação de um novo recurso no sistema.
    *   **Autenticação:** `Bearer Token`. A requisição deve ser autenticada. A lógica no backend determinará quem pode criar uma empresa (geralmente um administrador ou um usuário recém-registrado que ainda não possui uma empresa vinculada).
    *   **Corpo da Requisição:** Um objeto JSON completo com todos os dados cadastrais da empresa.
        ```json
        {
          "name": "Empresa criada de teste",
          "taxid": "22236522545",
          "website": "https://www.techsolutions.com",
          "postalcode": "12345-678",
          "address": "Avenida Principal, 500",
          "city": "São Paulo",
          // ...outros campos cadastrais
          "creator": "dfd5ebb3-6fd0-44a6-abe4-87a26f3347ab" // ID do usuário que está criando
        }
        ```
    *   **Uso no Aplicativo:**
        1.  **Fluxo de Onboarding do Usuário:** Este endpoint é a etapa final do processo de cadastro de um novo vendedor. Após o usuário criar sua conta de login (`POST /users/register`), o app apresentaria um formulário para ele preencher os dados da sua empresa. Ao submeter este formulário, o app chamaria este endpoint.
        2.  **Painel Administrativo:** Um administrador poderia ter uma função no app para cadastrar uma nova empresa manualmente, usando um formulário idêntico.

#### **63. Calcular Taxas de Transação**
*   **Endpoint:** `POST /functions/v1/taxas`
*   **Objetivo:** Fornecer um cálculo preciso das taxas que serão aplicadas a uma transação com base no valor, método de pagamento e número de parcelas, para uma empresa específica.
*   **Análise Detalhada:**
    *   **URL:** `https://{{base_url}}/functions/v1/taxas`.
    *   **Método:** `POST`, utilizado para enviar um conjunto de parâmetros de cálculo no corpo, o que é mais limpo do que usar uma longa string de query em uma requisição `GET`.
    *   **Autenticação:** `Bearer Token`. O usuário precisa estar logado para que o sistema possa identificar a empresa e aplicar suas taxas customizadas.
    *   **Corpo da Requisição:**
        ```json
        {
          "company_id": "d94f8d44-5ae6-4a29-8d7c-f9b394c56490",
          "valor": 100.50,
          "payment_method": "CARD",
          "parcelas": 1
        }
        ```
        Contém todas as variáveis necessárias para a Edge Function consultar as regras de taxas da empresa e retornar o valor exato.
    *   **Uso no Aplicativo:** Essencial para a experiência do vendedor. O app teria uma seção "Calculadora de Taxas" onde o vendedor poderia simular uma venda para entender seu lucro líquido. Ele inseriria o valor, o método e as parcelas, e o app chamaria este endpoint, exibindo o resultado formatado na tela.

#### **64. Aceitar Termos de Uso**
*   **Endpoint:** `PUT /functions/v1/configuracoes/acecitar-termos`
*   **Objetivo:** Registrar no banco de dados que o usuário logado leu e concordou com os Termos de Uso da plataforma.
*   **Análise Detalhada:**
    *   **URL:** `https://{{base_url}}/functions/v1/configuracoes/acecitar-termos`. A URL é bem específica sobre a ação que realiza.
    *   **Método:** `PUT` (ou `PATCH`), pois está modificando um estado associado ao perfil do usuário/empresa.
    *   **Autenticação:** `Bearer Token`. A identidade do usuário que está aceitando os termos é obtida a partir do token de acesso.
    *   **Corpo da Requisição:** Geralmente vazio. A própria chamada ao endpoint já significa a aceitação.
    *   **Uso no Aplicativo:** Durante o primeiro login ou quando os termos forem atualizados, o app deve exibir uma tela modal ou uma página bloqueando o acesso ao resto do aplicativo até que os termos sejam aceitos. O botão "Eu li e aceito" nesta tela acionaria a chamada a este endpoint. Uma vez bem-sucedida, o app poderia salvar um indicador localmente (ex: no `AsyncStorage`) para não exibir a tela novamente.

Com certeza. Vamos retomar a análise minuciosa a partir do endpoint #65, que é o último da coleção, e fornecer um resumo final com as principais observações para a construção do seu aplicativo.

---

### Módulo: Empresa (Continuação)

#### **65. Atualizar Configurações de Reserva Financeira em Massa**
*   **Endpoint:** `PATCH /functions/v1/companies/:id/reserva-bulk`
*   **Objetivo:** Aplicar um novo conjunto de regras de reserva financeira (dias de retenção e percentual) para **todas as empresas da plataforma** de uma só vez. Esta é uma poderosa ferramenta administrativa para aplicar políticas de risco ou financeiras de forma global.
*   **Análise Detalhada:**
    *   **URL:** `https://{{base_url}}/functions/v1/companies/d94f8d44-5ae6-4a29-8d7c-f9b394c56490/reserva-bulk`.  
        Esta URL chama a Edge Function `companies` com as sub-rotas `/reserva-bulk`. É importante notar que, apesar de haver um `:id` de empresa na URL, a natureza "bulk" (em massa) da operação sugere que a Edge Function provavelmente ignora este ID e aplica a atualização a todas as empresas. Isso é um detalhe de implementação a ser confirmado, mas é a interpretação mais lógica.
    *   **Método:** `PATCH`, pois está atualizando parcialmente (apenas os campos de reserva) múltiplos recursos (todas as empresas).
    *   **Autenticação:** `Bearer Token`. Esta é uma ação crítica que deve ser rigorosamente protegida e acessível apenas a usuários com permissões de administrador mestre.
    *   **Corpo da Requisição:**
        ```json
        {
            "reservedaysanticipation": 180,
            "reservedaysboleto": 180,
            "reservedayspix": 180,
            "reservepercentageanticipation": 15,
            "reservepercentageboleto": 15,
            "reservepercentagepix": 17
        }
        ```
        O corpo define as novas regras de reserva:
        *   `reservedays...`: O número de dias que um valor ficará retido na reserva financeira antes de ser liberado, por tipo de transação.
        *   `reservepercentage...`: O percentual do valor da transação que será alocado para a reserva financeira.
    *   **Uso no Aplicativo:** Esta funcionalidade é **exclusiva para um aplicativo ou painel administrativo**. Não haveria interface para isso no app do usuário final (vendedor). No app de admin, haveria uma seção de "Configurações Globais de Risco" ou "Financeiro", onde o administrador poderia definir esses valores e clicar em um botão como "Aplicar a Todas as Empresas", que dispararia esta requisição. É uma ferramenta para aplicar políticas de forma ampla e instantânea.

---
### Conclusão e Recomendações para o Desenvolvimento do App

A análise completa desta coleção revela uma arquitetura de backend bem estruturada, baseada em Edge Functions, que é ideal para ser consumida por um aplicativo móvel. Aqui estão os pontos-chave e um plano de ação sugerido para o seu projeto:

**1. Padrões de Arquitetura Identificados:**

*   **Backend como Serviço (BaaS):** O uso do Supabase para autenticação, banco de dados e Edge Functions simplifica enormemente o desenvolvimento, pois você não precisa gerenciar sua própria infraestrutura de servidor.
*   **Lógica de Negócio Centralizada:** Quase toda a lógica está encapsulada nas Edge Functions. Isso é excelente, pois o seu aplicativo móvel só precisará se preocupar em chamar a função correta, sem precisar replicar regras de negócio, cálculos de taxas ou validações complexas.
*   **Modelo de "Roteador" em Funções:** Endpoints como `/support-tickets` usam um campo `"action"` no corpo da requisição para decidir qual operação executar. Ao construir seu app, você criará funções de serviço que chamam o mesmo endpoint, mas com `"action"` diferentes, mantendo o código organizado.
*   **Clara Separação de Papéis:** Há uma distinção nítida entre endpoints para usuários finais (vendedores/clientes) e endpoints para administradores da plataforma (gestão de taxas, aprovações, configurações globais).

**2. Plano de Ação para o Desenvolvimento do App Móvel (React Native/Expo):**

Com base nesta análise, a construção do seu aplicativo pode seguir os seguintes passos:

1.  **Configuração Inicial:**
    *   Configure o cliente Supabase no seu projeto React Native usando as variáveis de ambiente do seu `.env` (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`). Crie um arquivo central para isso (ex: `src/lib/supabase.js`).

2.  **Módulo de Autenticação (Primeira Prioridade):**
    *   Crie as telas de Login, Cadastro e Recuperação de Senha.
    *   Utilize as funções `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`, etc. Elas correspondem diretamente aos endpoints `/auth/v1/token` e `/auth/v1/signup`.
    *   Gerencie a sessão do usuário para mantê-lo logado e redirecioná-lo para a tela principal após o login bem-sucedido.

3.  **Criação de Serviços de API:**
    *   Para cada módulo da API (Tickets, Transações, Empresa, etc.), crie um arquivo de serviço correspondente (ex: `src/services/TicketService.js`, `src/services/CompanyService.js`).
    *   Dentro de cada serviço, crie funções que encapsulem as chamadas às Edge Functions. Isso abstrai a complexidade para os componentes de UI.
        ```javascript
        // Exemplo em src/services/TicketService.js
        import { supabase } from '../lib/supabase';

        export const createTicket = async (subject, message) => {
          const { data, error } = await supabase.functions.invoke('support-tickets', {
            body: {
              action: 'create_ticket',
              payload: { subject, message }
            }
          });
          if (error) throw error;
          return data;
        };

        export const listTickets = async () => {
          // ...
        };
        ```

4.  **Desenvolvimento das Telas (Features):**
    *   Desenvolva as telas do aplicativo módulo por módulo, seguindo a estrutura da coleção:
        *   **Dashboard:** Use os endpoints do módulo "Dashboard" para buscar os dados agregados e exibi-los em gráficos e cartões.
        *   **Carteira e Extrato:** Utilize os endpoints `wallet` e `extrato` para mostrar saldos e histórico de transações.
        *   **Saques e Antecipações:** Crie os fluxos de solicitação usando os endpoints correspondentes.
        *   **Gestão de Empresa:** Crie a tela "Meu Perfil" ou "Minha Empresa" para exibir e editar dados usando os endpoints do módulo "Empresa".
        *   **Tickets de Suporte:** Construa a interface de chat/suporte chamando o endpoint `support-tickets` com as diferentes ações.

