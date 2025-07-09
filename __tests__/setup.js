// Configurações globais para testes
require('dotenv').config();

// Configurar tempo limite maior para os testes de API
jest.setTimeout(30000); // 30 segundos

// Polyfills para o ambiente Node.js
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.FormData = require('form-data');

// Polyfill para WebSocket
global.WebSocket = require('ws');

// Configuração para o ambiente de teste
process.env.NODE_ENV = 'test';

// Suprimir logs durante os testes (descomente se necessário)
// console.log = jest.fn();
// console.error = jest.fn();
// console.warn = jest.fn(); 