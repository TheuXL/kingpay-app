const NodeEnvironment = require('jest-environment-node').default;
const { TextEncoder, TextDecoder } = require('util');
const { URL, URLSearchParams } = require('url');
const { FormData, File, Blob } = require('formdata-node');

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    
    // Mock XMLHttpRequest
    this.global.XMLHttpRequest = class XMLHttpRequest {
      open() {}
      send() {}
      setRequestHeader() {}
    };

    // Mock Storage
    class MockStorage {
      constructor() {
        this.store = {};
      }
      
      getItem(key) {
        return this.store[key] || null;
      }
      
      setItem(key, value) {
        this.store[key] = value;
      }
      
      removeItem(key) {
        delete this.store[key];
      }
    }
    
    // Configurar ambiente global para testes
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
    this.global.URL = URL;
    this.global.URLSearchParams = URLSearchParams;
    this.global.FormData = FormData;
    this.global.File = File;
    this.global.Blob = Blob;
    this.global.localStorage = new MockStorage();
    this.global.sessionStorage = new MockStorage();

    // Importante para o Supabase
    this.global.self = this.global;
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment; 