const fs = require('fs');
const path = require('path');

// Diretório de testes
const testDir = path.join(__dirname, '__tests__');

// Mapeamento de nomes antigos para novos nomes
const dirMapping = {
  'Clientes (Endpoints 55-59)': 'Clientes-Endpoints-55-59',
  'Análise de Risco (Endpoint 54)': 'Analise-Risco-Endpoint-54',
  'UtmFy (Endpoints 51-53)': 'UtmFy-Endpoints-51-53',
  'Configurações (Endpoints 44-50)': 'Configuracoes-Endpoints-44-50',
  'Taxas (Endpoint 35)': 'Taxas-Endpoint-35',
  'Subconta (Endpoints 38-43)': 'Subconta-Endpoints-38-43',
  'Auth (Endpoints 1-4)': 'Auth-Endpoints-1-4',
  'Security Codes (Endpoints 5-6)': 'Security-Codes-Endpoints-5-6',
  'Tickets (Endpoints 7-15)': 'Tickets-Endpoints-7-15',
  'Transações (Endpoints 16-23)': 'Transacoes-Endpoints-16-23',
  'SUBCONTAS (Endpoints 24-28)': 'Subcontas-Endpoints-24-28'
};

console.log('Iniciando renomeação de diretórios de teste...');

// Verificar e renomear diretórios
fs.readdirSync(testDir).forEach(dir => {
  const oldPath = path.join(testDir, dir);
  
  // Verificar se é um diretório
  if (fs.statSync(oldPath).isDirectory()) {
    // Verificar se o diretório está no mapeamento
    if (dirMapping[dir]) {
      const newPath = path.join(testDir, dirMapping[dir]);
      
      // Verificar se o novo diretório já existe
      if (!fs.existsSync(newPath)) {
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`Renomeado: ${dir} -> ${dirMapping[dir]}`);
        } catch (error) {
          console.error(`Erro ao renomear ${dir}:`, error);
        }
      } else {
        console.log(`Diretório ${dirMapping[dir]} já existe, pulando...`);
      }
    }
  }
});

console.log('Renomeação concluída!'); 