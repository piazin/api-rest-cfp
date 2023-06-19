export interface RequestEmail {
  user_email: string;
  user_name: string;
  code: number;
}

export interface mailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}
