// src/app/api/getGameIds/route.ts

import { NextResponse } from 'next/server'; // 通常の import でインポート
import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME_REDSTONE!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function GET() {
  try {
    // データベースへの接続
    const pool = await sql.connect(config);

    // クエリの実行
    const result = await pool.request().query('SELECT TOP 1000 [GameId] FROM [dbo].[USER_TABLE]');

    // データベース接続を閉じる
    await pool.close();

    // 各IDに番号を振る
    const numberedGameIds = result.recordset.map((item, index) => ({
      id: index + 1,
      gameId: item.GameId,
    }));

    // 結果を返す
    return NextResponse.json(numberedGameIds);
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
