# Testes de Endpoint de Taxas (35)

Este diretório contém testes para o endpoint de cálculo de taxas do aplicativo KingPay.

## Estrutura dos Testes

Os testes estão organizados em um arquivo:

1. `calculate-taxes.test.js` - Testes para o endpoint de cálculo de taxas (Endpoint 35)

## Helpers Utilizados

Os testes utilizam dois helpers principais:

1. `auth-helper.js` - Para gerenciar a autenticação nos testes
2. `tax-helper.js` - Para simular cálculos de taxas e validar os resultados

## Abordagem de Testes

Os testes seguem uma abordagem híbrida:

1. Tentam usar o serviço real do app (que pode falhar se as funções Edge do Supabase não estiverem configuradas)
2. Usam simulações para validar a lógica de negócio

## Endpoint Testado

### Endpoint 35: Calcular Taxas
- Método: POST
- URL: https://{{base_url}}/functions/v1/taxas
- Funcionalidade: Calcula as taxas de uma transação
- Payload: JSON contendo:
  - company_id: ID da companhia que receberá a transação
  - valor: Valor da transação
  - payment_method: Método de pagamento
  - parcelas: Número de parcelas

## Cenários Testados

1. Cálculo de taxas para pagamento com cartão de crédito em 1 parcela
2. Cálculo de taxas para pagamento com cartão de crédito em múltiplas parcelas
3. Cálculo de taxas para pagamento com PIX
4. Tentativa de cálculo de taxas usando o serviço do app
5. Falhas ao calcular taxas com dados inválidos:
   - Valor negativo ou zero
   - Método de pagamento vazio
   - Número de parcelas zero ou negativo

## Executando os Testes

Para executar os testes de taxas:

```bash
npm test -- __tests__/Taxas-Endpoint-35
```

Para executar um teste específico:

```bash
npm test -- __tests__/Taxas-Endpoint-35/calculate-taxes.test.js
```

## Observações

- Os testes são projetados para funcionar mesmo sem as funções Edge do Supabase configuradas
- Quando as funções Edge não estão disponíveis, os testes usam simulações para validar a lógica de negócio
- Os testes incluem verificações de casos de erro (dados inválidos) 