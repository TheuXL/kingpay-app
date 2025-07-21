#!/usr/bin/env node

/**
 * 🚀 RUNNER DE TESTES PARA EDGE FUNCTIONS
 * ======================================
 * 
 * Script para executar testes de Edge Functions com diferentes configurações
 * 
 * Uso:
 * - npm run test:edge-runner
 * - node scripts/run-edge-tests.js [opções]
 * 
 * Opções:
 * - --quick: Executa apenas testes básicos
 * - --full: Executa todos os testes incluindo performance
 * - --jest: Executa apenas testes Jest
 * - --standalone: Executa apenas testes standalone
 * - --report: Gera relatório detalhado
 * - --verbose: Modo verboso
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class EdgeTestRunner {
  constructor() {
    this.args = process.argv.slice(2);
    this.options = this.parseArgs();
    this.results = {
      standalone: null,
      jest: null,
      startTime: Date.now(),
      endTime: null
    };
    
    console.log('🚀 EDGE FUNCTIONS TEST RUNNER');
    console.log('=============================\n');
  }

  parseArgs() {
    const options = {
      quick: this.args.includes('--quick'),
      full: this.args.includes('--full'),
      jest: this.args.includes('--jest'),
      standalone: this.args.includes('--standalone'),
      report: this.args.includes('--report'),
      verbose: this.args.includes('--verbose'),
      ci: this.args.includes('--ci')
    };

    // Default: executar tudo se nenhuma opção específica
    if (!options.jest && !options.standalone) {
      options.jest = true;
      options.standalone = true;
    }

    return options;
  }

  async runStandaloneTests() {
    console.log('🧪 EXECUTANDO TESTES STANDALONE');
    console.log('-------------------------------');
    
    try {
      const output = execSync('node tests/edgeFunctions.test.js', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      this.results.standalone = {
        success: true,
        output: output,
        duration: this.extractDuration(output)
      };

      if (this.options.verbose) {
        console.log(output);
      } else {
        console.log('✅ Testes standalone concluídos com sucesso');
      }

    } catch (error) {
      this.results.standalone = {
        success: false,
        error: error.message,
        output: error.stdout || error.message
      };

      console.error('❌ Testes standalone falharam:');
      if (this.options.verbose) {
        console.error(error.stdout || error.message);
      }
    }
  }

  async runJestTests() {
    console.log('\n🧪 EXECUTANDO TESTES JEST');
    console.log('-------------------------');
    
    try {
      const jestCommand = this.options.ci 
        ? 'npx jest tests/edgeFunctions.jest.test.js --ci --passWithNoTests'
        : 'npx jest tests/edgeFunctions.jest.test.js --verbose';

      const output = execSync(jestCommand, {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      this.results.jest = {
        success: true,
        output: output,
        duration: this.extractJestDuration(output)
      };

      if (this.options.verbose) {
        console.log(output);
      } else {
        console.log('✅ Testes Jest concluídos com sucesso');
      }

    } catch (error) {
      this.results.jest = {
        success: false,
        error: error.message,
        output: error.stdout || error.message
      };

      console.error('❌ Testes Jest falharam:');
      if (this.options.verbose) {
        console.error(error.stdout || error.message);
      }
    }
  }

  extractDuration(output) {
    // Tentar extrair duração do output
    const durationMatch = output.match(/(\d+(?:\.\d+)?)\s*ms/);
    return durationMatch ? parseFloat(durationMatch[1]) : null;
  }

  extractJestDuration(output) {
    // Extrair duração dos testes Jest
    const timeMatch = output.match(/Time:\s*(\d+(?:\.\d+)?)\s*s/);
    return timeMatch ? parseFloat(timeMatch[1]) * 1000 : null;
  }

  generateReport() {
    this.results.endTime = Date.now();
    const totalDuration = this.results.endTime - this.results.startTime;

    console.log('\n📊 RELATÓRIO FINAL');
    console.log('==================');
    console.log(`⏱️  Duração Total: ${totalDuration}ms`);
    
    if (this.results.standalone) {
      const icon = this.results.standalone.success ? '✅' : '❌';
      console.log(`${icon} Testes Standalone: ${this.results.standalone.success ? 'SUCESSO' : 'FALHOU'}`);
      if (this.results.standalone.duration) {
        console.log(`   └─ Duração: ${this.results.standalone.duration}ms`);
      }
    }

    if (this.results.jest) {
      const icon = this.results.jest.success ? '✅' : '❌';
      console.log(`${icon} Testes Jest: ${this.results.jest.success ? 'SUCESSO' : 'FALHOU'}`);
      if (this.results.jest.duration) {
        console.log(`   └─ Duração: ${this.results.jest.duration}ms`);
      }
    }

    // Calcular estatísticas
    const totalTests = (this.results.standalone ? 1 : 0) + (this.results.jest ? 1 : 0);
    const passedTests = (this.results.standalone?.success ? 1 : 0) + (this.results.jest?.success ? 1 : 0);
    const successRate = (passedTests / totalTests) * 100;

    console.log(`\n📈 Taxa de Sucesso: ${successRate.toFixed(1)}% (${passedTests}/${totalTests})`);

    // Recomendações
    if (successRate < 100) {
      console.log('\n💡 RECOMENDAÇÕES:');
      console.log('-----------------');
      console.log('1. Verificar conectividade de rede');
      console.log('2. Confirmar variáveis de ambiente');
      console.log('3. Validar status das Edge Functions');
      console.log('4. Executar com --verbose para mais detalhes');
    }

    return {
      totalDuration,
      successRate,
      details: this.results
    };
  }

  async saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      options: this.options,
      results: this.results,
      summary: {
        totalDuration: this.results.endTime - this.results.startTime,
        standalone: this.results.standalone?.success || false,
        jest: this.results.jest?.success || false
      }
    };

    const reportPath = path.join(process.cwd(), 'edge-functions-test-report.json');
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n💾 Relatório salvo em: ${reportPath}`);
    } catch (error) {
      console.error('❌ Erro ao salvar relatório:', error.message);
    }
  }

  async run() {
    try {
      if (this.options.standalone) {
        await this.runStandaloneTests();
      }

      if (this.options.jest) {
        await this.runJestTests();
      }

      const report = this.generateReport();

      if (this.options.report) {
        await this.saveReport();
      }

      // Exit code baseado no sucesso
      const allPassed = (!this.results.standalone || this.results.standalone.success) &&
                       (!this.results.jest || this.results.jest.success);
      
      process.exit(allPassed ? 0 : 1);

    } catch (error) {
      console.error('💥 Erro geral no runner:', error);
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
🚀 EDGE FUNCTIONS TEST RUNNER

Uso: node scripts/run-edge-tests.js [opções]

Opções:
  --quick      Executa apenas testes básicos
  --full       Executa todos os testes incluindo performance
  --jest       Executa apenas testes Jest
  --standalone Executa apenas testes standalone
  --report     Gera relatório detalhado em JSON
  --verbose    Modo verboso com output completo
  --ci         Modo CI com configurações otimizadas
  --help       Mostra esta ajuda

Exemplos:
  node scripts/run-edge-tests.js --jest --verbose
  node scripts/run-edge-tests.js --standalone --report
  node scripts/run-edge-tests.js --full --ci

`);
  }
}

// Verificar se é help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  const runner = new EdgeTestRunner();
  runner.showHelp();
  process.exit(0);
}

// Executar runner
const runner = new EdgeTestRunner();
runner.run();

module.exports = EdgeTestRunner; 