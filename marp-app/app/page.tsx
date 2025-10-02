'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [marpContent, setMarpContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMarpContent(data.marp);
      alert('変換完了！');
    } catch (error) {
      console.error('エラー:', error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPPT = async () => {
    if (!marpContent) {
      alert('まず変換してください');
      return;
    }

    setDownloading(true);

    try {
      const response = await fetch('/api/generate-ppt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marpContent }),
      });

      if (!response.ok) {
        throw new Error('ダウンロードに失敗しました');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.pptx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('ダウンロード完了！');
    } catch (error) {
      console.error('エラー:', error);
      alert('エラーが発生しました');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          MD→Marp変換アプリ
        </h1>

        <div className="space-y-8">
          {/* ファイル選択エリア */}
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">
              テキストを読ませるファイルを選択（.txt .md　.html）
            </label>
            <input
              type="file"
              accept=".txt,.md,.html"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
          </div>

          {/* 変換ボタン */}
          <button
            onClick={handleConvert}
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              font-semibold text-base transition-colors shadow-md
              hover:shadow-lg"
          >
            {loading ? '変換中...' : 'Marp形式に変換'}
          </button>

          {/* 変換結果表示 */}
          {marpContent && (
            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-800">変換結果:</h2>
                <pre className="text-sm whitespace-pre-wrap text-gray-600 
                  max-h-80 overflow-y-auto p-4 bg-white rounded-lg
                  border border-gray-200">
                  {marpContent}
                </pre>
              </div>

              {/* ダウンロードボタン */}
              <button
                onClick={handleDownloadPPT}
                disabled={downloading}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl
                  hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                  font-semibold text-base transition-colors
                  shadow-md hover:shadow-lg"
              >
                {downloading ? 'ダウンロード中...' : 'PowerPointをダウンロード'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}