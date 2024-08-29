'use client';
import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonColor, setButtonColor] = useState('#007bff');
  const [gameIds, setGameIds] = useState<{ id: number; gameId: string }[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameIds();
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
      <div style={styles.gameIdContainer}>
        {loading ? (
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
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column', // flexDirectionに適切な値を設定
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px', // px単位で設定
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '300px',
    marginBottom: '20px', // フォームの下にマージンを追加
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
  gameIdContainer: {
    width: '300px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  gameIdList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  gameIdItem: {
    padding: '5px 0',
  },
};
