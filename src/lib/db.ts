import { ConnectionPool, config as SQLConfig } from 'mssql';

// データベース接続の設定
const config: SQLConfig = {
  user: process.env.DB_USER as string, // 型アサーションを使用
  password: process.env.DB_PASSWORD as string, // 型アサーションを使用
  server: process.env.DB_SERVER as string, // 型アサーションを使用
  database: process.env.DB_NAME as string, // 型アサーションを使用
  options: {
    encrypt: true, // If using Azure SQL Database
    trustServerCertificate: true // Optional, for self-signed certificates
  },
};

// プールオブジェクト
let pool: ConnectionPool | null = null;

export async function sql(query: string) {
  try {
    // プールが存在しない場合、接続を確立
    if (!pool) {
      pool = new ConnectionPool(config);
      await pool.connect();
    }

    // クエリの実行
    const result = await pool.request().query(query);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default sql;
