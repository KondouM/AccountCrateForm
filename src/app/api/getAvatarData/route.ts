import { NextRequest } from 'next/server';
import sql from 'mssql';

// 環境変数からデータベース接続情報を設定
const defaultConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_SERVER as string,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME_AVATAR as string,
  options: {
    encrypt: false,               // サーバーの設定に応じて変更
    trustServerCertificate: true, // 証明書の検証をスキップする設定
  },
};

// GET メソッドに対する処理
export async function GET(req: NextRequest) {
  const pool = new sql.ConnectionPool(defaultConfig);

  try {
    // データベースに接続
    await pool.connect();

    // データを取得
    const result = await pool.request().query(`
      SELECT name, lev
      FROM dbo.Avatar_Current
      ORDER BY lev DESC
    `);

    // データをJSON形式でレスポンスとして送信
    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('データの取得に失敗しました。', error);
    return new Response(
      JSON.stringify({ message: 'データの取得に失敗しました。' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    // 接続を閉じる
    await pool.close();
  }
}
