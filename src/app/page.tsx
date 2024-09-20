'use client';
import React, { useState, useEffect } from 'react';

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
  const [buttonColor, setButtonColor] = useState('bg-blue-500');
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
    <div className="flex flex-col items-start h-screen w-screen bg-gray-100 bg-cover bg-center bg-no-repeat p-5" style={{ backgroundImage: 'url("/images/background.jpg")' }}>
      {/* ナビゲーションバー */}
      <nav className="flex justify-around bg-gray-200 p-2 rounded-lg shadow-md w-full mb-5">
        <a href="#top" className="text-blue-500 font-bold p-2">TOP</a>
        <a href="/filedownload" className="text-blue-500 font-bold p-2">ダウンロード</a>
        <a href="#server-info" className="text-blue-500 font-bold p-2">サーバー情報</a>
      </nav>

      <div className="flex w-full">
        <form onSubmit={handleSubmit} className="bg-gray-200 p-5 rounded-lg shadow-md w-1/3 mr-5 mb-0">
          <div className="mb-4">
            <label htmlFor="userID" className="block mb-1 font-bold">User ID:</label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-bold">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            className={`w-full p-2 text-white rounded ${buttonColor}`}
            onMouseEnter={() => setButtonColor('bg-blue-700')}
            onMouseLeave={() => setButtonColor('bg-blue-500')}
          >
            ユーザーを作成する
          </button>
        </form>

        <div className="flex-grow">
          <div className="bg-gray-200 p-5 rounded-lg shadow-md w-full ml-5">
            <h2>Players List</h2>
            {loadingPlayers ? (
              <p>Loading...</p>
            ) : (
              <div className="max-h-96 overflow-y-auto border border-gray-300 p-2 bg-gray-200">
                <table className="w-full text-center border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="p-2">Rank</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Job</th>
                      <th className="p-2">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr key={index} className="bg-gray-200">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{player.name}</td>
                        <td className="p-2">
                          <img
                            src={`/images/${player.job}.gif`}
                            alt={`Job ${player.job}`}
                            className="w-8 h-5 rounded"
                          />
                        </td>
                        <td className="p-2">{player.lev}</td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center items-center h-full">
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
    </div>
  );
}