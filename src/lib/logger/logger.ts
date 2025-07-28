
import { Platform } from 'react-native';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
type LogContext = Record<string, any>;

const BASH_COLORS = {
  RESET: '\x1b[0m',
  // Estilos
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  ITALIC: '\x1b[3m',
  UNDERLINE: '\x1b[4m',
  // Cores de Texto
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  // Cores de Fundo
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',
};

const LOG_LEVEL_CONFIG = {
  DEBUG: {
    color: BASH_COLORS.DIM + BASH_COLORS.CYAN,
    consoleMethod: console.debug,
    prefix: '🐛',
  },
  INFO: {
    color: BASH_COLORS.BLUE,
    consoleMethod: console.log,
    prefix: '⚙️',
  },
  WARN: {
    color: BASH_COLORS.YELLOW,
    consoleMethod: console.warn,
    prefix: '⚠️',
  },
  ERROR: {
    color: BASH_COLORS.RED,
    consoleMethod: console.error,
    prefix: '❌',
  },
  SUCCESS: {
    color: BASH_COLORS.GREEN,
    consoleMethod: console.log,
    prefix: '✅',
  },
};

class Logger {
  private static instance: Logger;
  private userId: string | null = null;
  private requestId: string | null = null;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setUserId(userId: string | null) {
    this.userId = userId;
  }

  public setRequestId(requestId: string | null) {
    this.requestId = requestId;
  }

  private formatMessage(
    level: LogLevel,
    category: string,
    message: string,
    context?: LogContext
  ) {
    const { color, prefix } = LOG_LEVEL_CONFIG[level];
    const timestamp = new Date().toISOString();
    
    let baseLog = `${prefix} [${level}] [${category}]`;
    if (this.userId) {
      baseLog += ` [User: ${this.userId.substring(0, 8)}...]`;
    }
    if (this.requestId) {
        baseLog += ` [Req: ${this.requestId}]`;
    }

    baseLog += ` ${message}`;

    if (Platform.OS === 'web' || process.env.NODE_ENV !== 'production') {
      return {
        formattedLog: `${color}${baseLog}${BASH_COLORS.RESET}`,
        context,
      };
    }
    
    return {
        formattedLog: baseLog,
        context: context ? JSON.stringify(context) : '',
    };
  }

  private log(
    level: LogLevel,
    category: string,
    message: string,
    context?: LogContext
  ) {
    const { consoleMethod } = LOG_LEVEL_CONFIG[level];
    const { formattedLog, context: formattedContext } = this.formatMessage(
      level,
      category,
      message,
      context
    );
    
    if (formattedContext) {
      consoleMethod(formattedLog, formattedContext);
    } else {
      consoleMethod(formattedLog);
    }
  }

  public debug(category: string, message: string, context?: LogContext) {
    this.log('DEBUG', category, message, context);
  }

  public info(category: string, message: string, context?: LogContext) {
    this.log('INFO', category, message, context);
  }

  public warn(category: string, message: string, context?: LogContext) {
    this.log('WARN', category, message, context);
  }

  public error(category: string, message: string, context?: LogContext | Error) {
    if (context instanceof Error) {
        const errorContext: LogContext = {
            name: context.name,
            message: context.message,
            stack: context.stack,
        };
        this.log('ERROR', category, message, errorContext);
    } else {
        this.log('ERROR', category, message, context);
    }
  }

  public success(category: string, message: string, context?: LogContext) {
    this.log('SUCCESS', category, message, context);
  }
}

export const logger = Logger.getInstance(); 