export type AppErrorCode =
  | 'validation/error'
  | 'firebase/configuration'
  | 'firebase/unknown'
  | 'auth/no-current-user'
  | 'auth/email-not-verified'
  | 'repository/not-implemented'
  | 'network/unavailable';

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
