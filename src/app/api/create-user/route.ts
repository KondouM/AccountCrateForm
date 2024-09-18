import { NextResponse } from 'next/server';
import sql from 'mssql';

const defaultConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_SERVER as string,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME_REDSTONE as string,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const redgemConfig = {
  user: 'sa',
  password: 'Redstone2024',
  server: '220.153.168.131',
  port: 50605,
  database: 'redgem',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const avatarConfig = {
  ...defaultConfig,
  database: process.env.DB_NAME_AVATAR as string,
};

export async function POST(req: Request) {
  try {
    const { userID, password } = await req.json();

    if (!userID || !password) {
      return NextResponse.json({ error: 'UserID and Password are required' }, { status: 400 });
    }

    // Redstone データベースへの接続
    const pool = await sql.connect(defaultConfig);

    // ユーザーIDの存在確認
    const existingUserResult = await pool.request()
      .input('I_GAMEID', sql.NVarChar(50), userID)
      .query('SELECT COUNT(*) AS userCount FROM [RedStone_ID_Source].[dbo].[USER_TABLE] WHERE [GameId] = @I_GAMEID'); // 列名を修正

    if (existingUserResult.recordset[0].userCount > 0) {
      await pool.close();
      return NextResponse.json({ error: '既に登録されているIDです。' }, { status: 400 });
    }

    // ユーザー作成のためのストアドプロシージャの実行
    const result = await pool.request()
      .input('I_GAMEID', sql.NVarChar(50), userID)
      .input('I_GAMEPW', sql.NVarChar(24), password)
      .input('I_BIRTH', sql.DateTime, new Date('1990-01-01T00:00:00'))
      .input('I_GENDER', sql.VarChar(1), 'M')
      .output('O_RESULT', sql.Int)
      .execute('spRS_USER_CREATE');

    console.log('Result from spRS_USER_CREATE:', result.output.O_RESULT);
    await pool.close();

    // redgem データベースへの接続
    const redgemPool = await sql.connect(redgemConfig);

    // 接続確認: 現在のデータベース名を取得
    const dbNameResult = await redgemPool.request().query('SELECT DB_NAME() AS databaseName');
    console.log('Connected to database:', dbNameResult.recordset[0].databaseName);

    // redgem データベースでのユーザー情報の挿入または更新
    await redgemPool.request()
      .input('YhUserID', sql.VarChar(20), userID)
      .input('YhUserQue', sql.VarChar(255), 'who are you?')
      .input('YhUserAns', sql.VarChar(255), 'empty')
      .input('YhUserName', sql.VarChar(12), 'empty')
      .input('YhUserPrivCode', sql.VarChar(13), 'empty')
      .input('YhUserPwd', sql.NVarChar(24), password)
      .input('YhUserPost', sql.VarChar(9), 'empty')
      .input('YhUserAddr1', sql.VarChar(255), 'empty')
      .input('YhUserAddr2', sql.VarChar(255), 'empty')
      .input('YhUserTel', sql.VarChar(14), 'empty')
      .input('YhUserHP', sql.VarChar(13), 'empty')
      .input('YhUserEMail', sql.VarChar(255), 'empty')
      .input('YhUserNewsYN', sql.Bit, 0)
      .input('YhUserURL', sql.VarChar(255), 'discord')
      .input('EnrollFlag', sql.VarChar(13), 'INSERT')
      .execute('RgameJH.SP_Yh_User_Overwrite');

    // redgem データベースでの GEM 付与
    await redgemPool.request()
      .input('uid', sql.VarChar(20), userID)
      .query`UPDATE [dbo].[AcTb] SET mp = mp + 99999 WHERE uid = @uid`;
    await redgemPool.close();

    // Avatar データベースへの接続
    const AvatarPool = await sql.connect(avatarConfig);

    // Redstone_Avatar_Source データベースでの OP 権限付与
    await AvatarPool.request()
      .input('name', sql.NVarChar(50), userID)
      .query`UPDATE [dbo].[Avatar_Current] SET isOper = 5 WHERE name = @name`;
    await AvatarPool.close();
    
    return NextResponse.json({ message: 'User created and updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database operation failed:', error);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}
