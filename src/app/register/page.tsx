'use client';
import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonColor, setButtonColor] = useState('#007bff');
  const [gameIds, setGameIds] = useState<{ id: number; gameId: string }[]>([]);
  const [avatarData, setAvatarData] = useState<{ name: string; lev: number }[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<{ id: number; gameId: string }[]>([]);
  const [loadingGameIds, setLoadingGameIds] = useState(true);
  const [loadingAvatarData, setLoadingAvatarData] = useState(true);
  const [loadingOnlinePlayers, setLoadingOnlinePlayers] = useState(true);

  // ゲームIDを取得する関数
  const fetchGameIds = async () => {
    try {
      const response = await fetch('/api/getGameIds');
      if (!response.ok) {
        throw new Error('データの取得に失敗しました。');
      }
      const data = await response.json();
      setGameIds(data);
    } catch (error) {
      console.error('データの取得に失敗しました。', error);
    } finally {
      setLoadingGameIds(false);
    }
  };

  // Avatarデータを取得する関数
  const fetchAvatarData = async () => {
    try {
      const response = await fetch('/api/getAvatarData');
      if (!response.ok) {
        throw new Error('データの取得に失敗しました。');
      }
      const data = await response.json();
      setAvatarData(data);
    } catch (error) {
      console.error('データの取得に失敗しました。', error);
    } finally {
      setLoadingAvatarData(false);
    }
  };

  // オンラインプレイヤーを取得する関数
  const fetchOnlinePlayers = async () => {
    try {
      const response = await fetch('/api/getOnlinePlayers');
      if (!response.ok) {
        throw new Error('オンラインプレイヤーの取得に失敗しました。');
      }
      const data = await response.json();
      setOnlinePlayers(data);
    } catch (error) {
      console.error('オンラインプレイヤーの取得に失敗しました。', error);
    } finally {
      setLoadingOnlinePlayers(false);
    }
  };

  useEffect(() => {
    // ゲームID、Avatarデータ、オンラインプレイヤーを10秒ごとに取得する
    const intervalId = setInterval(() => {
      fetchGameIds();
      fetchAvatarData();
      fetchOnlinePlayers();
    }, 10000); // 10000ミリ秒 = 10秒
  
    // クリーンアップ処理として、コンポーネントがアンマウントされる際にインターバルをクリア
    return () => clearInterval(intervalId);
  }, []); // 空の依存配列を使用して初回マウント時にのみインターバルを設定

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

      if (!response.ok) {
        throw new Error('ユーザーの作成に失敗しました。');
      }

      const result = await response.json();
      console.log(result);

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
        <div style={styles.gameIdContainer}>
          ※下記のID以外で登録してください。
          <div>
            登録済みユーザーID
            {loadingGameIds ? (
              <p>Loading...</p>
            ) : (
              <ul style={styles.gameIdList}>
                {gameIds.map(({ id, gameId }) => (
                  <li key={id} style={styles.gameIdItem}>
                    {id}. {gameId}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div style={styles.avatarContainer}>
          <h2>ランキング</h2>
          {loadingAvatarData ? (
            <p>Loading...</p>
          ) : (
            <ul style={styles.avatarList}>
              {avatarData.map(({ name, lev }, index) => (
                <li key={index} style={styles.avatarItem}>
                  {index + 1}. {name} - Level: {lev}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={styles.onlinePlayersContainer}>
          <h2>現在のオンラインプレイヤー</h2>
          {loadingOnlinePlayers ? (
            <p>Loading...</p>
          ) : (
            <ul style={styles.onlinePlayersList}>
              {onlinePlayers.map(({ id, gameId }) => (
                <li key={id} style={styles.onlinePlayerItem}>
                  {id}. {gameId}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row', // フォームとランキングを横に並べる
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
    marginRight: '20px', // フォームとランキングの間にマージンを追加
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
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row', // フォームとランキングを横に並べる
  },
  gameIdContainer: {
    width: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxHeight: '400px', // 最大高さを指定
    overflowY: 'auto', // 縦方向にスクロール可能
  },
  avatarContainer: {
    width: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    marginLeft: '20px', // ランキングとオンラインプレイヤーの間にマージンを追加
    maxHeight: '400px', // 最大高さを指定
    overflowY: 'auto', // 縦方向にスクロール可能
  },
  onlinePlayersContainer: {
    width: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    marginLeft: '20px', // オンラインプレイヤーとランキングの間にマージンを追加
    maxHeight: '400px', // 最大高さを指定
    overflowY: 'auto', // 縦方向にスクロール可能
  },
  gameIdList: {
    listStyle: 'none',
    padding: 0,
  },
  gameIdItem: {
    padding: '5px 0',
  },
  avatarList: {
    listStyle: 'none',
    padding: 0,
  },
  avatarItem: {
    padding: '5px 0',
  },
  onlinePlayersList: {
    listStyle: 'none',
    padding: 0,
  },
  onlinePlayerItem: {
    padding: '5px 0',
  },
};
