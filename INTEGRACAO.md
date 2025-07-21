Exemplo de configuração dos endpoits 

```javascript
// Em algum lugar central do seu app, como 'src/lib/supabase.js'
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

### Exemplos de Código para Cada Endpoint

Aqui estão os exemplos de como chamar cada endpoint a partir do seu aplicativo React Native.

#### Módulo: Autenticação

**1. Autenticação: Gerar Token de Acesso** (`POST /auth/v1/token`)
*   **Propósito:** Fazer login de um usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const handleLogin = async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        console.log('Login bem-sucedido!', data.session.access_token);
        return data.session;
      } catch (error) {
        console.error('Erro no login:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado no `onPress` do botão de login.

**2. Autenticação: Criar Nova Conta** (`POST /auth/v1/signup`)
*   **Propósito:** Registrar um novo usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const handleSignUp = async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        console.log('Usuário registrado! Verifique seu e-mail.', data);
        return data;
      } catch (error) {
        console.error('Erro no cadastro:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado no `onPress` do botão de registro.

---

#### Módulo: Código de Segurança

**3. Geração de Código de Validação** (`POST /functions/v1/validation-codes/generate`)
*   **Propósito:** Gerar um código de uso único para ações sensíveis.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const generateSecurityCode = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('validation-codes/generate');
        if (error) throw error;
        console.log('Código gerado:', data.code);
        return data;
      } catch (error) {
        console.error('Erro ao gerar código:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado antes de exibir a tela que pede o código de segurança.

**4. Validação de Código de Segurança** (`POST /functions/v1/validation-codes/validate`)
*   **Propósito:** Validar o código inserido pelo usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const validateSecurityCode = async (code) => {
      try {
        const { data, error } = await supabase.functions.invoke('validation-codes/validate', {
          body: { code: code },
        });
        if (error) throw error;
        console.log('Validação:', data.message);
        return data.success;
      } catch (error) {
        console.error('Erro ao validar código:', error.message);
        return false;
      }
    };
    ```
*   **Uso no App:** Chamado quando o usuário submete o formulário com o código.

---

#### Módulo: Tickets de Suporte

**5. Criar Ticket de Suporte**
*   **Propósito:** Abrir um novo chamado de suporte.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const createSupportTicket = async (subject, message, attachmentUrl = '') => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'create_ticket',
            payload: { subject, message, attachment_url: attachmentUrl },
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar ticket:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de "Abrir Chamado".

**6. Listar Tickets de Suporte**
*   **Propósito:** Obter a lista de tickets do usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const listSupportTickets = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: { action: 'list_tickets', payload: {} },
        });
        if (error) throw error;
        return data; // Contém a lista de tickets
      } catch (error) {
        console.error('Erro ao listar tickets:', error.message);
      }
    };
    ```
*   **Uso no App:** Na tela de "Meus Chamados".

**7. Enviar Mensagem em um Ticket**
*   **Propósito:** Responder a um ticket existente.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const sendTicketMessage = async (ticketId, message) => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'send_message',
            payload: { ticket_id: ticketId, message: message },
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
      }
    };
    ```
*   **Uso no App:** Na interface de chat de um ticket específico.

**8. Listar Mensagens de um Ticket**
*   **Propósito:** Carregar o histórico de mensagens de um chat.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getTicketMessages = async (ticketId, page = 1, perPage = 20) => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'get_messages',
            payload: { ticket_id: ticketId, page: page, per_page: perPage },
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error.message);
      }
    };
    ```
*   **Uso no App:** Ao abrir a tela de um ticket para visualizar o chat.

**9. Verificar Mensagens Não Lidas**
*   **Propósito:** Checar se o usuário tem novas respostas de suporte.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const checkUnreadMessages = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: { action: 'check_unread_messages', payload: {} },
        });
        if (error) throw error;
        return data.hasUnread; // Ex: true ou false
      } catch (error) {
        console.error('Erro ao checar mensagens:', error.message);
      }
    };
    ```
*   **Uso no App:** Para exibir um badge de notificação no ícone de suporte.

**10. Marcar Mensagens como Lidas**
*   **Propósito:** Limpar a notificação de novas mensagens de um ticket.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const markMessagesAsRead = async (ticketId) => {
      try {
        await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'mark_message_read',
            payload: { ticket_id: ticketId },
          },
        });
      } catch (error) {
        console.error('Erro ao marcar como lido:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado quando o usuário entra na tela de um ticket com mensagens não lidas.

**11. Buscar um Único Ticket**
*   **Propósito:** Obter detalhes de um ticket específico.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getTicketById = async (ticketId) => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: { action: 'get_ticket', payload: { ticket_id: ticketId } },
        });
        if (error) throw error;
        return data.ticket;
      } catch (error) {
        console.error('Erro ao buscar ticket:', error.message);
      }
    };
    ```
*   **Uso no App:** Para carregar os dados de cabeçalho (assunto, status) na tela do ticket.

**12. Atualizar Status de um Ticket (Admin)**
*   **Propósito:** Fechar ou alterar o status de um ticket.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const updateTicketStatus = async (ticketId, newStatus) => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: {
            action: 'update_status',
            payload: { ticket_id: ticketId, status: newStatus }, // ex: 'closed'
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar status:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No painel administrativo, para gerenciar tickets.

**13. Obter Métricas de Suporte (Admin)**
*   **Propósito:** Coletar estatísticas sobre os tickets.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getSupportMetrics = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('support-tickets', {
          body: { action: 'get_metrics', payload: {} },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar métricas:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No dashboard administrativo.

---

#### Módulo: Transações

**14. Criar Transação (PIX, Cartão)**
*   **Propósito:** Iniciar um processo de pagamento.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // transactionPayload é o objeto JSON completo visto na coleção
    const createTransaction = async (transactionPayload) => {
      try {
        const { data, error } = await supabase.functions.invoke('transactions', {
          body: transactionPayload,
        });
        if (error) throw error;
        // data conterá os dados do PIX (QR Code) ou o resultado do cartão
        return data;
      } catch (error) {
        console.error('Erro ao criar transação:', error.message);
      }
    };
    ```
*   **Uso no App:** Na etapa final do checkout.

**15. Obter Credenciais de API**
*   **Propósito:** Buscar as chaves de API do usuário logado.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getApiCredentials = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('credentials');
        if (error) throw error;
        return data; // Contém as chaves
      } catch (error) {
        console.error('Erro ao buscar credenciais:', error.message);
      }
    };
    ```
*   **Uso no App:** Em uma tela de "Configurações > Integrações" para o vendedor.

**16. Webhook de Transações (`webhookfx`)**
*   **Propósito:** Receber notificações do gateway de pagamento.
*   **Código:** Este endpoint **não é chamado pelo app**. É um webhook que o seu provedor de pagamentos chama. O app pode escutar mudanças no banco de dados (que são feitas por esta função) usando o Supabase Realtime.

---

#### Módulo: Subcontas (Marketplace)

**17. Proxy para API Externa** (`POST /proxy`)
*   **Propósito:** Fazer chamadas seguras para uma API de marketplace (ex: Iugu).
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // Exemplo: Criar uma subconta na Iugu via proxy
    const createMarketplaceAccount = async (accountName) => {
      try {
        const { data, error } = await supabase.functions.invoke('proxy', {
          body: {
            method: 'POST',
            endpoint: '/v1/marketplace/create_account',
            payload: { name: accountName },
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro no proxy:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado por funções de onboarding de vendedores.

**18. Enviar Documentos KYC** (`POST /request_verification`)
*   **Propósito:** Enviar dados e documentos para verificação de um vendedor.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // kycPayload é o objeto JSON completo com dados e URLs dos arquivos
    const submitKycVerification = async (kycPayload) => {
      try {
        // Nota: a URL original é diferente, este é um exemplo se fosse uma Edge Function
        const { data, error } = await supabase.functions.invoke('request_verification', {
          body: kycPayload,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao enviar KYC:', error.message);
      }
    };
    ```
*   **Uso no App:** Ao final do formulário de cadastro de vendedor.

**19. Criar Subconta e Enviar KYC (Orquestrado)** (`POST /functions/v1/subconta`)
*   **Propósito:** Endpoint unificado para criar e iniciar a verificação de uma subconta.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const onboardSubaccount = async (companyId, accountDetails) => {
      try {
        const { data, error } = await supabase.functions.invoke('subconta', {
          body: {
            companyId: companyId,
            ...accountDetails, // subconta_nome, banco, agencia, etc.
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro no onboarding:', error.message);
      }
    };
    ```
*   **Uso no App:** A principal função a ser chamada no fluxo de onboarding do vendedor.

**20. Reenviar Documentos KYC** (`PUT /functions/v1/subconta/resend_documents`)
*   **Propósito:** Enviar um novo arquivo de documento se o anterior foi recusado.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const resendKycDocument = async (subAccountId, subAccountToken, newDocumentUrl) => {
      try {
        const { data, error } = await supabase.functions.invoke('subconta/resend_documents', {
          method: 'PUT', // Especifica o método
          body: {
            sub_account_id: subAccountId,
            sub_account_live_token: subAccountToken,
            identification: newDocumentUrl, // ou outro campo de documento
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao reenviar documento:', error.message);
      }
    };
    ```
*   **Uso no App:** Em uma tela que mostra o status do KYC com uma opção para "Reenviar Documento".

**21. Verificar Status da Subconta** (`POST /functions/v1/subconta/checkstatus`)
*   **Propósito:** Consultar o status atual de uma subconta.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const checkSubaccountStatus = async (subAccountId, subAccountToken) => {
      try {
        const { data, error } = await supabase.functions.invoke('subconta/checkstatus', {
          body: {
            sub_account_id: subAccountId,
            sub_account_live_token: subAccountToken,
          },
        });
        if (error) throw error;
        return data; // ex: { status: 'approved' }
      } catch (error) {
        console.error('Erro ao checar status:', error.message);
      }
    };
    ```
*   **Uso no App:** Para atualizar a interface do vendedor com o status do seu cadastro.

**22. Verificar Status do KYC** (`POST /functions/v1/subconta/check_kyc`)
*   **Propósito:** Consultar especificamente o status da verificação dos documentos.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const checkKycStatus = async (subAccountToken) => {
      try {
        const { data, error } = await supabase.functions.invoke('subconta/check_kyc', {
          body: { sub_account_live_token: subAccountToken },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao checar KYC:', error.message);
      }
    };
    ```
*   **Uso no App:** Para dar um feedback mais detalhado sobre a verificação.

---

#### Módulo: Logs, Taxas e Risco

**23. Obter Logs de Auditoria (Admin)** (`GET /functions/v1/audit-log`)
*   **Propósito:** Visualizar o log de atividades do sistema.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getAuditLog = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('audit-log');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar logs:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Na tela de auditoria do painel administrativo.

**24. Calcular Taxas de Transação** (`POST /functions/v1/taxas`)
*   **Propósito:** Simular o cálculo de taxas para uma venda.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const calculateFees = async (companyId, amount, paymentMethod, installments) => {
      try {
        const { data, error } = await supabase.functions.invoke('taxas', {
          body: {
            company_id: companyId,
            valor: amount,
            payment_method: paymentMethod, // 'PIX', 'CARD'
            parcelas: installments,
          },
        });
        if (error) throw error;
        return data; // Contém o valor das taxas e o valor líquido
      } catch (error) {
        console.error('Erro ao calcular taxas:', error.message);
      }
    };
    ```
*   **Uso no App:** Na tela "Calculadora de Taxas" do vendedor.

**25. Análise de Risco** (`POST /functions/v1/risk`)
*   **Propósito:** Avaliar o risco de uma operação.
*   **Código:** Este endpoint provavelmente é chamado internamente por outras funções (como a de saque) e não diretamente pelo app.

---

#### Módulo: Chaves PIX (Admin e Usuário)

**26. Listar Todas Chaves PIX (Admin)** (`GET /functions/v1/pix-key`)
*   **Propósito:** Ver todas as chaves PIX cadastradas.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getAllPixKeys = async (page = 1, limit = 20) => {
      try {
        const { data, error } = await supabase.functions.invoke(`pix-key?limit=${limit}&offset=${(page - 1) * limit}`);
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar chaves PIX:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Para popular a lista de chaves a serem aprovadas.

**27. Aprovar/Reprovar Chave PIX (Admin)** (`PATCH /functions/v1/pix-key/:id/approve`)
*   **Propósito:** Alterar o status de verificação de uma chave.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const approvePixKey = async (keyId, shouldApprove) => {
      try {
        const { data, error } = await supabase.functions.invoke(`pix-key/${keyId}/approve`, {
          method: 'PATCH',
          body: { v: shouldApprove }, // v: true para aprovar, false para reprovar
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao aprovar chave:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Nos botões "Aprovar" / "Reprovar" da lista de chaves.

**28. Criar Chave PIX (Usuário)** (`POST /functions/v1/pix-key`)
*   **Propósito:** Permitir que um usuário adicione uma nova chave PIX.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const createPixKey = async (key, type, description) => {
      try {
        const { data, error } = await supabase.functions.invoke('pix-key', {
          body: { key, type, description },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar chave:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de "Adicionar Chave PIX" na conta do usuário.

**29. Atualizar Chave PIX (Usuário)** (`PUT /functions/v1/pix-key/:id`)
*   **Propósito:** Editar uma chave PIX existente.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const updatePixKey = async (keyId, key, type, description) => {
      try {
        const { data, error } = await supabase.functions.invoke(`pix-key/${keyId}`, {
          method: 'PUT',
          body: { key, type, description },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar chave:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de edição de uma chave PIX.

---

#### Módulo: Configurações e Personalização

**30. Obter Termos de Uso** (`GET /functions/v1/configuracoes/termos`)
*   **Propósito:** Buscar o texto dos Termos de Uso.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getTermsOfUse = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('configuracoes/termos');
        if (error) throw error;
        return data.termos;
      } catch (error) {
        console.error('Erro ao buscar termos:', error.message);
      }
    };
    ```
*   **Uso no App:** Para exibir em uma tela de "Termos de Uso".

**31. Atualizar Termos de Uso (Admin)** (`PUT /functions/v1/configuracoes/termos`)
*   **Propósito:** Alterar o texto dos Termos de Uso.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const updateTermsOfUse = async (newTerms) => {
      try {
        await supabase.functions.invoke('configuracoes/termos', {
          method: 'PUT',
          body: { termos: newTerms },
        });
      } catch (error) {
        console.error('Erro ao atualizar termos:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Em um editor de texto no painel administrativo.

**32. Obter Configurações da Plataforma** (`GET /functions/v1/configuracoes`)
*   **Propósito:** Carregar as regras de negócio globais.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getPlatformConfig = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('configuracoes');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar config:', error.message);
      }
    };
    ```
*   **Uso no App:** Pode ser usado para habilitar/desabilitar features na UI com base nas regras.

**33. Atualizar Configurações da Plataforma (Admin)** (`PUT /functions/v1/configuracoes`)
*   **Propósito:** Salvar novas regras de negócio.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // configPayload é o objeto JSON completo com todas as configurações
    const updatePlatformConfig = async (configPayload) => {
      try {
        await supabase.functions.invoke('configuracoes', {
          method: 'PUT',
          body: configPayload,
        });
      } catch (error) {
        console.error('Erro ao atualizar config:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No formulário de configurações gerais do sistema.

**34. Obter Personalização Visual** (`GET /functions/v1/personalization`)
*   **Propósito:** Carregar o tema (cores, logos) da plataforma.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getTheme = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('personalization');
        if (error) throw error;
        // Retorna o primeiro item, pois deve haver apenas um registro de tema
        return data.data[0]; 
      } catch (error) {
        console.error('Erro ao buscar tema:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado na inicialização do app para configurar o provedor de tema (ex: React Navigation Theme, Styled Components ThemeProvider).

**35. Atualizar Personalização Visual (Admin)** (`PUT /functions/v1/personalization`)
*   **Propósito:** Salvar um novo tema visual.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // themePayload é o objeto JSON completo com todas as cores, logos, etc.
    const updateTheme = async (themePayload) => {
      try {
        await supabase.functions.invoke('personalization', {
          method: 'PUT',
          body: themePayload,
        });
      } catch (error) {
        console.error('Erro ao atualizar tema:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Em um formulário de personalização de marca (whitelabel).

**36. Aceitar Termos de Uso** (`PUT /functions/v1/configuracoes/acecitar-termos`)
*   **Propósito:** Registrar que o usuário aceitou os termos.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const acceptTerms = async () => {
      try {
        await supabase.functions.invoke('configuracoes/acecitar-termos', {
          method: 'PUT',
        });
      } catch (error) {
        console.error('Erro ao aceitar termos:', error.message);
      }
    };
    ```
*   **Uso no App:** No `onPress` do botão "Aceito" na tela de Termos de Uso.

---

#### Módulo: Clientes (CRM)

**37. Listar Clientes** (`GET /functions/v1/clientes`)
*   **Propósito:** Obter a lista de clientes de um vendedor.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getClients = async ({ page = 1, limit = 20, name = '', taxid = '' }) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `clientes?limit=${limit}&offset=${(page - 1) * limit}&name=${name}&taxid=${taxid}`
        );
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao listar clientes:', error.message);
      }
    };
    ```
*   **Uso no App:** Na tela de "Meus Clientes", com suporte a busca e paginação.

**38. Buscar Cliente por ID** (`GET /functions/v1/clientes/:id`)
*   **Propósito:** Obter os detalhes de um cliente específico.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getClientById = async (clientId) => {
      try {
        const { data, error } = await supabase.functions.invoke(`clientes/${clientId}`);
        if (error) throw error;
        return data.client;
      } catch (error) {
        console.error('Erro ao buscar cliente:', error.message);
      }
    };
    ```
*   **Uso no App:** Ao clicar em um cliente da lista para ver sua página de detalhes.

**39. Criar Cliente** (`POST /functions/v1/clientes`)
*   **Propósito:** Adicionar um novo cliente ao CRM do vendedor.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // clientPayload contém name, taxid, email, etc.
    const createClient = async (clientPayload) => {
      try {
        const { data, error } = await supabase.functions.invoke('clientes', {
          body: clientPayload,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar cliente:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de "Novo Cliente".

**40. Editar Cliente** (`PUT /functions/v1/clientes`)
*   **Propósito:** Atualizar os dados de um cliente existente.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // clientPayload deve incluir o 'id' do cliente a ser atualizado
    const updateClient = async (clientPayload) => {
      try {
        const { data, error } = await supabase.functions.invoke('clientes', {
          method: 'PUT',
          body: clientPayload,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error.message);
      }
    };
    ```
*   **Uso no App:** Ao salvar o formulário de edição de um cliente.

---

#### Módulo: Link de Pagamento

**41. Listar Links de Pagamento** (`GET /functions/v1/link-pagamentos`)
*   **Propósito:** Obter a lista de links criados pelo vendedor.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getPaymentLinks = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('link-pagamentos');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar links:', error.message);
      }
    };
    ```
*   **Uso no App:** Na tela de "Links de Pagamento".

**42. Criar Link de Pagamento** (`POST /functions/v1/link-pagamentos`)
*   **Propósito:** Gerar um novo link de pagamento.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // linkPayload contém nome, valor, formas_de_pagamento, etc.
    const createPaymentLink = async (linkPayload) => {
      try {
        const { data, error } = await supabase.functions.invoke('link-pagamentos', {
          body: linkPayload,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar link:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de "Criar Link".

**43. Editar Link de Pagamento** (`PATCH /functions/v1/link-pagamentos/:id`)
*   **Propósito:** Atualizar um link de pagamento existente.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const updatePaymentLink = async (linkId, updatedPayload) => {
      try {
        const { data, error } = await supabase.functions.invoke(`link-pagamentos/${linkId}`, {
          method: 'PATCH',
          body: updatedPayload,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao editar link:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de edição de um link.

**44. Visualizar Link de Pagamento (Público)** (`GET /functions/v1/link-pagamento-view/:id`)
*   **Propósito:** Buscar os dados para renderizar a página de checkout.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getPaymentLinkView = async (linkId) => {
      try {
        // Esta função pode ser chamada sem autenticação se a política de RLS permitir
        const { data, error } = await supabase.functions.invoke(`link-pagamento-view/${linkId}`);
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao carregar link:', error.message);
      }
    };
    ```
*   **Uso no App/Web:** Na tela que o cliente final vê para realizar o pagamento.

---

#### Módulo: Padrões de Configuração (Admin)

**45. Obter Configurações Padrão** (`GET /functions/v1/standard`)
*   **Propósito:** Listar os "templates" de configuração para novas empresas.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getStandardConfigs = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('standard');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar padrões:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Para exibir os templates de configuração existentes.

**46. Atualizar Última Configuração Padrão** (`PATCH /functions/v1/standard/last`)
*   **Propósito:** Editar o template de configuração padrão.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // standardPayload é o objeto completo com todas as taxas e regras padrão
    const updateStandardConfig = async (standardPayload) => {
      try {
        await supabase.functions.invoke('standard/last', {
          method: 'PATCH',
          body: standardPayload,
        });
      } catch (error) {
        console.error('Erro ao atualizar padrão:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No formulário de edição do template padrão.

---

#### Módulo: Alertas e Notificações

**47. Listar Alertas** (`GET /functions/v1/alerts`)
*   **Propósito:** Obter a lista de notificações para o usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getAlerts = async (page = 1, limit = 10) => {
      try {
        const { data, error } = await supabase.functions.invoke(`alerts?limit=${limit}&offset=${(page - 1) * limit}`);
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar alertas:', error.message);
      }
    };
    ```
*   **Uso no App:** Para popular a central de notificações (o "sininho").

**48. Criar Alerta (Admin)** (`POST /functions/v1/alerts`)
*   **Propósito:** Enviar uma notificação global ou para um grupo de usuários.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const createAlert = async (title, body, isCheckoutAlert = false) => {
      try {
        await supabase.functions.invoke('alerts', {
          body: { title, body, checkout: isCheckoutAlert },
        });
      } catch (error) {
        console.error('Erro ao criar alerta:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No painel de administração para enviar comunicados.

**49. Marcar Alerta como Visualizado** (`POST /functions/v1/alerts/mark-viewed`)
*   **Propósito:** Indicar que o usuário leu uma notificação.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const markAlertAsViewed = async (alertId) => {
      try {
        await supabase.functions.invoke('alerts/mark-viewed', {
          body: { id: alertId },
        });
      } catch (error) {
        console.error('Erro ao marcar alerta:', error.message);
      }
    };
    ```
*   **Uso no App:** Chamado quando o usuário clica em uma notificação na lista.

**50. Deletar Alerta (Admin)** (`DELETE /functions/v1/alerts`)
*   **Propósito:** Remover uma notificação do sistema.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const deleteAlert = async (alertId) => {
      try {
        await supabase.functions.invoke('alerts', {
          method: 'DELETE',
          body: { id: alertId },
        });
      } catch (error) {
        console.error('Erro ao deletar alerta:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No painel de gerenciamento de alertas.

---

#### Módulo: Configurações de Administrador

**51. Obter Templates de Email**
*   **Endpoint:** Usa o mesmo `GET /functions/v1/configuracoes/termos` da coleção, mas o ideal seria um endpoint dedicado como `GET /functions/v1/configuracoes/emails`.
*   **Propósito:** Carregar os modelos de email para edição.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getEmailTemplates = async () => {
      try {
        // Supondo um endpoint dedicado
        const { data, error } = await supabase.functions.invoke('configuracoes/emails');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar templates:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Para popular a lista de templates de email editáveis.

**52. Atualizar Template de Email** (`PUT /functions/v1/configuracoes/emails`)
*   **Propósito:** Salvar as alterações em um modelo de email.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const updateEmailTemplate = async (templateId, subject, body, senderName) => {
      try {
        await supabase.functions.invoke('configuracoes/emails', {
          method: 'PUT',
          body: {
            id: templateId,
            assunto: subject,
            remetente_nome: senderName,
            email_body: body,
          },
        });
      } catch (error) {
        console.error('Erro ao atualizar template:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Ao salvar o formulário de edição de um template.

---

#### Módulo: Dashboard e Relatórios

**53. Obter Dados do Dashboard** (`POST /functions/v1/dados-dashboard`)
*   **Propósito:** Buscar todos os KPIs e métricas para a tela principal.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getDashboardData = async (startDate, endDate) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `dados-dashboard?start_date=${startDate}&end_date=${endDate}`,
          { method: 'POST' } // Método POST mesmo sem corpo, conforme coleção
        );
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error.message);
      }
    };
    ```
*   **Uso no App:** Principal chamada na tela de Dashboard para preencher todos os cartões e gráficos.

**54. Obter Relatório de Top Sellers** (`GET /functions/v1/analytics-reports/top-sellers/...`)
*   **Propósito:** Listar as empresas que mais venderam em um período.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getTopSellers = async (startDate, endDate) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `analytics-reports/top-sellers/${startDate}/${endDate}`
        );
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro no relatório de top sellers:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Para gerar o relatório de melhores vendedores.

**55. Obter Relatório de Top Produtos** (`POST /functions/v1/dados-dashboard/top-produtos`)
*   **Propósito:** Listar os produtos mais vendidos.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getTopProducts = async (startDate, endDate) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `dados-dashboard/top-produtos?start_date=${startDate}&end_date=${endDate}`,
          { method: 'POST' }
        );
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro no relatório de top produtos:', error.message);
      }
    };
    ```
*   **Uso no App:** Para exibir a lista de produtos mais vendidos no dashboard.

**56. Obter Dados para Gráfico de Faturamento** (`POST /functions/v1/dados-dashboard/grafico`)
*   **Propósito:** Buscar dados agregados por período (dia/mês) para plotar um gráfico.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getChartData = async (startDate, endDate) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `dados-dashboard/grafico?start_date=${startDate}&end_date=${endDate}`,
          { method: 'POST' }
        );
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error.message);
      }
    };
    ```
*   **Uso no App:** Para alimentar bibliotecas de gráficos como `react-native-chart-kit`.

---

#### Módulo: Carteira, Saques e Antecipações

**57. Solicitar Saque** (`POST /functions/v1/withdrawals`)
*   **Propósito:** Iniciar uma solicitação de retirada de saldo.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const requestWithdrawal = async (pixKeyId, amountInCents, description) => {
      try {
        const { data, error } = await supabase.functions.invoke('withdrawals', {
          body: {
            pixkeyid: pixKeyId,
            requestedamount: amountInCents,
            description: description,
            isPix: true,
          },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao solicitar saque:', error.message);
      }
    };
    ```
*   **Uso no App:** No formulário de "Solicitar Saque".

**58. Gerenciar Saques (Admin)** (`PATCH /functions/v1/withdrawals/:id`)
*   **Propósito:** Aprovar, negar ou marcar um saque como pago manualmente.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // status pode ser 'approved', 'cancelled', 'done_manual'
    const manageWithdrawal = async (withdrawalId, status, reason = '') => {
      try {
        const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawalId}`, {
          method: 'PATCH',
          body: { status, reason_for_denial: reason },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao gerenciar saque:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Nos botões de ação da lista de saques pendentes.

**59. Solicitar Antecipação** (`POST /functions/v1/antecipacoes/create`)
*   **Propósito:** Solicitar a antecipação de todos os recebíveis de cartão.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const requestAnticipation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('antecipacoes/create');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao solicitar antecipação:', error.message);
      }
    };
    ```
*   **Uso no App:** No botão "Antecipar Saldo" na tela de recebíveis.

**60. Aprovar Antecipação (Admin)** (`POST /functions/v1/antecipacoes/approve`)
*   **Propósito:** Aprovar uma solicitação de antecipação.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const approveAnticipation = async (anticipationId) => {
      try {
        await supabase.functions.invoke('antecipacoes/approve', {
          body: { anticipationId },
        });
      } catch (error) {
        console.error('Erro ao aprovar antecipação:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No botão "Aprovar" da lista de solicitações.

**61. Negar Antecipação (Admin)** (`PATCH /functions/v1/antecipacoes/deny`)
*   **Propósito:** Recusar uma solicitação de antecipação com um motivo.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const denyAnticipation = async (anticipationId, reason) => {
      try {
        await supabase.functions.invoke('antecipacoes/deny', {
          method: 'PATCH',
          body: { anticipationId, reason },
        });
      } catch (error) {
        console.error('Erro ao negar antecipação:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** No botão "Recusar", que abriria um modal para inserir o motivo.

**62. Gerenciar Saldo Manualmente (Admin)** (`POST /functions/v1/wallet/balance-management`)
*   **Propósito:** Adicionar ou remover saldo da carteira de um usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    // operation pode ser 'add' ou 'remove'
    const manageBalance = async (userId, amount, type, reason, operation) => {
      try {
        await supabase.functions.invoke('wallet/balance-management', {
          body: {
            userId,
            amount,
            type, // 'pix', 'card', etc.
            motivo: reason,
            operation,
          },
        });
      } catch (error) {
        console.error('Erro ao gerenciar saldo:', error.message);
      }
    };
    ```
*   **Uso no App (Admin):** Em uma ferramenta de "Ajuste de Saldo" no painel do usuário.

**63. Consultar Carteira (Wallet)** (`GET /functions/v1/wallet`)
*   **Propósito:** Obter o resumo financeiro da carteira de um usuário.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getWalletSummary = async (userId) => {
      try {
        // userId é opcional, a função de backend deve pegar o do usuário logado se não for admin
        const { data, error } = await supabase.functions.invoke(`wallet?userId=${userId}`);
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar carteira:', error.message);
      }
    };
    ```
*   **Uso no App:** Na tela principal ou na seção "Carteira".

**64. Consultar Extrato** (`GET /functions/v1/extrato/:userId`)
*   **Propósito:** Obter o histórico de movimentações da carteira.
*   **Código:**
    ```javascript
    import { supabase } from '../lib/supabase';

    const getStatement = async (userId, page = 1, limit = 20) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `extrato/${userId}?limit=${limit}&offset=${(page - 1) * limit}`
        );
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar extrato:', error.message);
      }
    };
    ```
*   **Uso no App:** Para popular a lista na tela de "Extrato".

**65. Consultar Valores a Receber (Antecipáveis)**
*   **Propósito:** Obter a lista de recebíveis de cartão que podem ser antecipados.
*   **Endpoint:** A coleção não possui um endpoint dedicado, mas a função `GET /wallet` provavelmente já retorna essa informação.
*   **Uso no App:** Para exibir o valor "disponível para antecipação" e a lista de transações que compõem esse valor.