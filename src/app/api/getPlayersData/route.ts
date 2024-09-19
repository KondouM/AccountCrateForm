import { NextResponse } from 'next/server';
import sql from 'mssql';

// データベースの設定
const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME_AVATAR!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// グローバル接続プール
let pool: sql.ConnectionPool | null = null;

export async function GET() {
  try {
    // データベースへの接続（プールの再利用）
    if (!pool) {
      pool = await sql.connect(config);
    }

    // SQLクエリの実行（lev 昇順にソート）
    const result = await pool.request().query(`
        SELECT TOP 100 [name], [job], [lev], [login]
        FROM [Redstone_Avatar_Source].[dbo].[Avatar_Current]
        ORDER BY lev DESC
      `);

    // クエリ結果をJSON形式で返す
    const avatarData = result.recordset;

    // プレイヤーリストを返す
    return NextResponse.json(avatarData);
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}