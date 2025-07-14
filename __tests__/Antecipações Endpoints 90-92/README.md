# Testes de Endpoints de Antecipações (90-92)

Este diretório contém os testes para os endpoints de antecipações.

## Endpoints Testados

1.  **`GET /antecipacoes/anticipations` (Endpoint 90)**:
    - `get-anticipations.test.js`
    - Testa a listagem de antecipações com e sem filtros (limite, offset, status).

2.  **`PATCH /antecipacoes/deny` (Endpoint 91)**:
    - `deny-anticipation.test.js`
    - Testa a negação de um pedido de antecipação.
    - Valida as regras de negócio, como a exigência de um motivo para a recusa.

3.  **`POST /antecipacoes/approve` (Endpoint 92)**:
    - `approve-anticipation.test.js`
    - Testa a aprovação de um pedido de antecipação.
    - Valida as transições de status permitidas.

## Estrutura

-   **`helpers/`**: Contém `anticipation-helper.js` para gerar dados de teste e `anticipation-cleanup-mock.js` para simular a limpeza de dados.
-   **Arquivos de Teste**: Cada arquivo corresponde a um endpoint e contém casos de teste para vários cenários de sucesso e falha.

## Mocks

Os testes utilizam um mock global para o cliente Supabase (`__mocks__/@supabase/supabase-js.js`) para evitar chamadas de rede reais e garantir um ambiente de teste estável e isolado. 