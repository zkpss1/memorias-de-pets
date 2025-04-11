import { config } from 'dotenv';
import { ConnectionConfiguration } from 'tedious';

config();

export const dbConfig: ConnectionConfiguration = {
  server: process.env.AZURE_SQL_SERVER || '',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.AZURE_SQL_USER || '',
      password: process.env.AZURE_SQL_PASSWORD || ''
    }
  },
  options: {
    encrypt: true,
    database: process.env.AZURE_SQL_DATABASE || '',
    trustServerCertificate: false
  }
};
