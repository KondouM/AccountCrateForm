// src/app/api/getOnlinePlayers/route.ts

import { NextResponse } from 'next/server';
import sql from 'mssql';

// データベースの設定
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

    // SQLクエリの実行（オンラインプレイヤーの取得）
    const result = await pool.request().query('SELECT GameId FROM [dbo].[USER_TABLE] WHERE isConnect = 1');

    // データベース接続を閉じる
    await pool.close();

    // 各IDに番号を振る
    const numberedOnlinePlayers = result.recordset.map((item, index) => ({
      id: index + 1,
      gameId: item.GameId,
    }));

    // 結果を返す
    return NextResponse.json(numberedOnlinePlayers);
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
