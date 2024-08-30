'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function PassphrasePage() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const correctPassphrase = 'reredstone'; // 合言葉をここに設定

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passphrase === correctPassphrase) {
      // 合言葉が正しければHomePageへ遷移
      setError(''); // エラーをクリア
      // 通常のフォームの代わりにリンクを表示
    } else {
      setError('合言葉が正しくありません。');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="passphrase" style={styles.label}>合言葉:</label>
          <input
            type="password"
            id="passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {!error && passphrase === correctPassphrase && (
          <Link href="/register" passHref>
            <button type="button" style={styles.button}>ホームページへ移動</button>
          </Link>
        )}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '300px',
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
    backgroundColor: '#007bff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};