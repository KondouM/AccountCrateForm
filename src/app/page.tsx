'use client';
import React, { useState, useEffect } from 'react';

// ランプのスタイル
const lampStyles = {
  green: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'green' },
  gray: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'gray' },
};

interface Player {
  name: string;
  job: number;  // job を数値型に変更
  lev: number;
  login: number;
}

export default function HomePage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonColor, setButtonColor] = useState('#007bff');
  const [gameIds, setGameIds] = useState<{ id: number; gameId: string }[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // プレイヤーデータを取得する関数
  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/getPlayersData');
      if (!response.ok) {
        throw new Error('プレイヤーデータの取得に失敗しました。');
      }
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('プレイヤーデータの取得に失敗しました。', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    // プレイヤーデータを2秒ごとに取得する
    const intervalId = setInterval(() => {
      fetchPlayers();
    }, 2000); // 2000ミリ秒 = 2秒
  
    // クリーンアップ処理として、コンポーネントがアンマウントされる際にインターバルをクリア
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError(''); // エラーをリセット

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'ユーザーの作成に失敗しました。');
      }

      // アラートを表示
      alert('完了しました。');

      // 入力内容をクリア
      setUserID('');
      setPassword('');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="userID" style={styles.label}>User ID:</label>
          <input
            type="text"
            id="userID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button
          type="submit"
          style={{ ...styles.button, backgroundColor: buttonColor }}
          onMouseEnter={() => setButtonColor('#0056b3')}
          onMouseLeave={() => setButtonColor('#007bff')}
        >
          ユーザーを作成する
        </button>
      </form>
      <div style={styles.content}>
        <div style={styles.playersContainer}>
          <h2>Players List</h2>
          {loadingPlayers ? (
            <p>Loading...</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'separate', borderSpacing: '0 2px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '5px' }}>Rank</th>
                    <th style={{ padding: '5px' }}>Name</th>
                    <th style={{ padding: '5px' }}>Job</th>
                    <th style={{ padding: '5px' }}>Level</th>
                    <th style={{ padding: '5px' }}>Login Status</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={index}>
                      <td style={{ padding: '5px' }}>{index + 1}</td> {/* インデックス番号を表示 */}
                      <td style={{ padding: '5px' }}>{player.name}</td>
                      <td style={{ padding: '5px' }}>
                        {/* job番号に応じた画像を表示 */}
                        <img
                          src={`/images/${player.job}.gif`}
                          alt={`Job ${player.job}`}
                          style={{ width: '30px', height: '20px', borderRadius: '10%' }}
                        />
                      </td>
                      <td style={{ padding: '5px' }}>{player.lev}</td>
                      <td style={{ padding: '5px', textAlign: 'center' }}>
                        {/* ログインステータスの中央にランプを配置 */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <div style={player.login === 1 ? lampStyles.green : lampStyles.gray}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row', // フォームとゲームIDリストを横に並べる
    alignItems: 'flex-start',
    height: '100vh',
    width: '100vw', // 横幅を画面全体に設定
    backgroundColor: '#f0f2f5',
    backgroundImage: 'url("/images/background.jpg")',
    backgroundSize: 'cover', // 画像をコンテナ全体にフィットさせる
    backgroundPosition: 'center', // 画像をコンテナの中央に配置
    backgroundRepeat: 'no-repeat', // 画像の繰り返しを防ぐ
    padding: '20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '300px',
    marginRight: '20px', // フォームとゲームIDリストの間にマージンを追加
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  content: {
    flexGrow: 1,
  },
  gameIdContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
  },
  gameIdList: {
    listStyleType: 'none',
    padding: '0',
  },
  gameIdItem: {
    padding: '5px 0',
  },
  playersContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
    marginLeft: '20px', // プレイヤーリストとゲームIDリストの間にマージンを追加
  },
};
