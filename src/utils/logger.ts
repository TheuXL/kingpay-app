/**
 * 📊 Sistema de Logging Completo KingPay
 * Monitora todas as ações, requisições e respostas do app
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum LogCategory {
  AUTH = 'AUTH',
  API = 'API',
  USER_ACTION = 'USER_ACTION',
  NAVIGATION = 'NAVIGATION',
  COMPONENT = 'COMPONENT',
  PAYMENT = 'PAYMENT',
  DASHBOARD = 'DASHBOARD',
  WALLET = 'WALLET',
  SYSTEM = 'SYSTEM'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  userId?: string;
  screen?: string;
  action?: string;
  duration?: number;
  error?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Máximo de logs na memória
  private isDevelopment = __DEV__;

  /**
   * 🔐 Log de Autenticação
   */
  auth(message: string, data?: any, userId?: string) {
    this.log(LogLevel.INFO, LogCategory.AUTH, message, data, userId);
  }

  /**
   * 🌐 Log de Requisições API
   */
  apiRequest(method: string, url: string, headers?: any, body?: any, userId?: string) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    this.log(LogLevel.INFO, LogCategory.API, `🚀 [${method}] ${url}`, {
      requestId,
      method,
      url,
      headers: this.sanitizeHeaders(headers),
      body: this.sanitizeBody(body),
      startTime
    }, userId);

    return requestId;
  }

  /**
   * 🌐 Log de Respostas API
   */
  apiResponse(requestId: string, status: number, data?: any, duration?: number, userId?: string) {
    const level = status >= 200 && status < 300 ? LogLevel.SUCCESS : LogLevel.ERROR;
    const emoji = level === LogLevel.SUCCESS ? '✅' : '❌';
    
    this.log(level, LogCategory.API, `${emoji} Response [${status}]`, {
      requestId,
      status,
      data: this.sanitizeResponse(data),
      duration: duration || 0,
      success: status >= 200 && status < 300
    }, userId);
  }

  /**
   * 🖱️ Log de Ações do Usuário
   */
  userAction(action: string, screen: string, data?: any, userId?: string) {
    this.log(LogLevel.INFO, LogCategory.USER_ACTION, `👆 ${action}`, {
      action,
      screen,
      ...data
    }, userId);
  }

  /**
   * 🧭 Log de Navegação
   */
  navigation(from: string, to: string, userId?: string) {
    this.log(LogLevel.INFO, LogCategory.NAVIGATION, `🧭 ${from} → ${to}`, {
      from,
      to,
      timestamp: new Date().toISOString()
    }, userId);
  }

  /**
   * 🎯 Log de Componentes
   */
  component(component: string, action: string, data?: any, userId?: string) {
    this.log(LogLevel.DEBUG, LogCategory.COMPONENT, `🎯 ${component}: ${action}`, {
      component,
      action,
      ...data
    }, userId);
  }

  /**
   * 💳 Log de Pagamentos
   */
  payment(action: string, amount?: number, method?: string, data?: any, userId?: string) {
    this.log(LogLevel.INFO, LogCategory.PAYMENT, `💳 ${action}`, {
      action,
      amount,
      method,
      ...data
    }, userId);
  }

  /**
   * 📊 Log do Dashboard
   */
  dashboard(action: string, data?: any, userId?: string) {
    this.log(LogLevel.INFO, LogCategory.DASHBOARD, `📊 ${action}`, {
      action,
      ...data
    }, userId);
  }

  /**
   * 💰 Log da Carteira
   */
  wallet(action: string, amount?: number, data?: any, userId?: string) {
    this.log(LogLevel.INFO, LogCategory.WALLET, `💰 ${action}`, {
      action,
      amount,
      ...data
    }, userId);
  }

  /**
   * ⚙️ Log do Sistema
   */
  system(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.SYSTEM, `⚙️ ${message}`, data);
  }

  /**
   * ⚠️ Log de Avisos
   */
  warn(message: string, data?: any, userId?: string) {
    this.log(LogLevel.WARN, LogCategory.SYSTEM, `⚠️ ${message}`, data, userId);
  }

  /**
   * ❌ Log de Erros
   */
  error(message: string, error?: any, userId?: string) {
    this.log(LogLevel.ERROR, LogCategory.SYSTEM, `❌ ${message}`, {
      error: error?.message || error,
      stack: error?.stack,
      ...error
    }, userId);
  }

  /**
   * ✅ Log de Sucesso
   */
  success(message: string, data?: any, userId?: string) {
    this.log(LogLevel.SUCCESS, LogCategory.SYSTEM, `✅ ${message}`, data, userId);
  }

  /**
   * 📝 Método principal de logging
   */
  private log(level: LogLevel, category: LogCategory, message: string, data?: any, userId?: string, screen?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      userId,
      screen
    };

    // Adicionar aos logs na memória
    this.logs.push(entry);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console em desenvolvimento
    if (this.isDevelopment) {
      this.consoleLog(entry);
    }

    // TODO: Enviar para serviço de analytics em produção
    // this.sendToAnalytics(entry);
  }

  /**
   * 🖥️ Log no console (desenvolvimento)
   */
  private consoleLog(entry: LogEntry) {
    const { timestamp, level, category, message, data, userId } = entry;
    const time = new Date(timestamp).toLocaleTimeString('pt-BR');
    const userInfo = userId ? ` [User: ${userId.slice(0, 8)}...]` : '';
    
    const logMessage = `[${time}] [${level}] [${category}]${userInfo} ${message}`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data);
        break;
      case LogLevel.SUCCESS:
        console.log(`%c${logMessage}`, 'color: green', data);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, data);
        break;
      default:
        console.log(logMessage, data);
    }
  }

  /**
   * 🔒 Sanitizar headers (remover dados sensíveis)
   */
  private sanitizeHeaders(headers?: any): any {
    if (!headers) return {};
    
    const sanitized = { ...headers };
    
    // Mascarar tokens
    if (sanitized.Authorization) {
      sanitized.Authorization = sanitized.Authorization.replace(/Bearer\s+(.+)/, 'Bearer ***TOKEN***');
    }
    
    if (sanitized.apikey) {
      sanitized.apikey = '***APIKEY***';
    }
    
    return sanitized;
  }

  /**
   * 🔒 Sanitizar body (remover dados sensíveis)
   */
  private sanitizeBody(body?: any): any {
    if (!body) return {};
    
    const sanitized = { ...body };
    
    // Mascarar senhas
    if (sanitized.password) {
      sanitized.password = '***PASSWORD***';
    }
    
    // Mascarar dados bancários
    if (sanitized.account) {
      sanitized.account = '***ACCOUNT***';
    }
    
    if (sanitized.pixKey) {
      sanitized.pixKey = '***PIX_KEY***';
    }
    
    return sanitized;
  }

  /**
   * 🔒 Sanitizar respostas (remover dados sensíveis)
   */
  private sanitizeResponse(data?: any): any {
    if (!data) return {};
    
    const sanitized = { ...data };
    
    // Mascarar tokens em respostas
    if (sanitized.access_token) {
      sanitized.access_token = '***ACCESS_TOKEN***';
    }
    
    if (sanitized.refresh_token) {
      sanitized.refresh_token = '***REFRESH_TOKEN***';
    }
    
    return sanitized;
  }

  /**
   * 🆔 Gerar ID único para requisições
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 📋 Obter todos os logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * 📋 Obter logs por categoria
   */
  getLogsByCategory(category: LogCategory): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * 📋 Obter logs por usuário
   */
  getLogsByUser(userId: string): LogEntry[] {
    return this.logs.filter(log => log.userId === userId);
  }

  /**
   * 🗑️ Limpar logs
   */
  clearLogs(): void {
    this.logs = [];
    this.system('Logs limpos');
  }

  /**
   * 📊 Estatísticas dos logs
   */
  getStats() {
    const totalLogs = this.logs.length;
    const byLevel = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);
    
    const byCategory = this.logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<LogCategory, number>);

    return {
      totalLogs,
      byLevel,
      byCategory,
      memoryUsage: `${totalLogs}/${this.maxLogs}`
    };
  }
}

// Instância singleton
export const logger = new Logger();

// Exports para facilitar uso
export {
    Logger
};

