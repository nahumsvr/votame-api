declare module "bun" {
  interface Env {
    DATABASE_URL: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
  }
}
