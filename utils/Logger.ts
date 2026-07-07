type LogLevel = 'info' | 'warn' | 'error';

function writeLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
  if (context) {
    console[level](`[YUMMY:${level}] ${message}`, context);
    return;
  }

  console[level](`[YUMMY:${level}] ${message}`);
}

export const Logger = {
  info(message: string, context?: Record<string, unknown>) {
    writeLog('info', message, context);
  },
  warn(message: string, context?: Record<string, unknown>) {
    writeLog('warn', message, context);
  },
  error(message: string, context?: Record<string, unknown>) {
    writeLog('error', message, context);
  },
};
