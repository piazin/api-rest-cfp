export interface EmailService {
  sendEmail<T>(mailConfig: T): Promise<void>;
}
