import "./App.css";
import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import { GAMES, LAUNCHER_CONFIG } from "./consts";
import type { Game } from "./types/Game";

import { CD } from "./components/CD";
import { Background } from "./components/Background";

// 表示するフィードバックメッセージの型
interface Feedback {
  type: "success" | "error" | "info";
  message: string;
}

const CDLauncher: React.FC = () => {
  // =========== UI周りの処理  ===========

  // 選択されたアプリ (画面遷移)
  const [selectedApp, setSelectedApp] = useState<Game | null>(null);

  // ホバーしてるアプリ
  const [highlitedApp, setHightlitedApp] = useState<Game | null>(null);

  // エラーのダイアログが表示されているかどうか
  const [errorShow, setErrorShow] = useState(false);

  // アプリクリック時の処理
  const handleAppClick = (app: Game) => {
    // チェッカーの色をアプリの色に
    document.documentElement.style.setProperty("--cheker", app.color);
    setSelectedApp(app);
  };

  // 戻るボタンクリック時の処理
  const handleBackButtonClick = () => {
    if (isAppRunning || isAppLoading) return;
    setHightlitedApp(null);
    setErrorShow(false);
    // チェッカーの色を戻す
    document.documentElement.style.setProperty(
      "--cheker",
      "var(--color-gray-400)"
    );
    setSelectedApp(null);
  };

  // エラーのダイアログを表示する処理
  const showErrorDialog = () => {
    setErrorShow(true);
    setTimeout(() => {
      setErrorShow(false);
    }, LAUNCHER_CONFIG.dialogShowDuration);
  };

  // =========== Rustとやり取りするための処理 ===========

  // ローディング状態
  const [isAppLoading, setIsLoading] = useState(false);
  //起動したアプリが実行中かどうか
  const [isAppRunning, setIsAppRunning] = useState(false);
  // バックエンドからの結果
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // アプリ終了のイベントリスナーのセットアップ
  useEffect(() => {
    // 'app-terminated' イベントを購読
    const unlisten = listen<string>("app-terminated", (event) => {
      console.log(`App terminated:`, event.payload);
      // ここで終了したアプリのファイル名（event.payload）に応じてstateを更新
      setIsAppRunning(false);
      setFeedback({
        type: "info",
        message: `'${event.payload}'が終了しました。`,
      });
    });

    // コンポーネントがアンマウントされる時にリスナーを解除
    return () => {
      unlisten.then((f) => f());
    };
  }, []); // コンポーネントのマウント時に一度だけ実行

  // アプリの起動処理
  async function invokeApp(fileName: string) {
    // 既に何らかの処理が実行中の場合は何もしない
    if (isAppLoading || isAppRunning) return;

    setIsLoading(true); // ローディング状態に
    setFeedback(null); // 前回のメッセージをクリア

    try {
      // Rustのコマンドを呼び出し、成功メッセージを受け取る
      const successMessage = await invoke("invoke_app", { fileName });
      setFeedback({ type: "success", message: String(successMessage) });
      setIsAppRunning(true);
      console.log(successMessage);
    } catch (err) {
      // Rust側でErrが返された場合、catchブロックでエラーメッセージを受け取る
      setFeedback({ type: "error", message: String(err) });
      setIsAppRunning(false);
      showErrorDialog(); // エラーダイアログを表示
      console.log(err);
    } finally {
      // 成功・失敗にかかわらず、ローディング状態を解除
      setIsLoading(false);
      console.log(feedback);
    }
  }

  return (
    <div className="h-[100vh] bg-background overflow-x-hidden font-shin-retro">
      {/* 背景 - チェッカー */}
      <Background />

      {/* CD */}
      <div
        className={`fixed z-20 h-screen flex items-center justify-center pointer-events-none transition-all duration-300 ease-in-out ${
          !selectedApp
            ? "left-0 top-0 -translate-x-1/3"
            : "left-[100%] top-0 -translate-x-3/4"
        }
          `}
      >
        <CD
          config={LAUNCHER_CONFIG.cd}
          cdImage={LAUNCHER_CONFIG.cd.image}
          className={`transition-all duration-300 ease-in-out ${
            isAppRunning && LAUNCHER_CONFIG.cd.spinWhileRunning
              ? "animate-spin-slow"
              : ""
          }`}
        />
      </div>

      {/* ゲーム選択画面 */}
      <div
        className={`absolute top-0 left-0 z-10 w-full h-[100vh] duration-300 transition-opacity ${
          selectedApp ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-full h-[100vh] pl-[65vh] flex flex-col items-center justify-center gap-3 pt-[10vh] pb-[3vh]">
          <div className="text-4xl font-bold">{LAUNCHER_CONFIG.title}</div>
          <div
            className="w-full flex-1 overflow-auto overflow-x-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, black, 90%, transparent)",
            }}
          >
            <nav className="w-full flex flex-col items-center justify-center gap-6">
              <div className="h-[10px]"></div> {/* マージン用div */}
              {GAMES.map((game, index) => {
                return (
                  <div
                    key={index}
                    className={`game-card relative shadow-lg font-shin-retro font-bold shrink-0 ${
                      highlitedApp === game ? "scale-110" : "scale-100"
                    }`}
                    onClick={() => handleAppClick(game)}
                    onMouseEnter={() => setHightlitedApp(game)}
                  >
                    <h3 className="absolute left-24 text-center font-bold text-xl">
                      {game.title}
                    </h3>
                    <div
                      className="absolute top-0 left-6 w-8 h-full flex items-center"
                      style={{
                        backgroundColor: game.color ? game.color : "white",
                      }}
                    >
                      {game.icon && (
                        <img src={game.icon} alt={game.title}></img>
                      )}
                    </div>
                    <div
                      className="absolute top-0 left-16 w-2 h-full"
                      style={{
                        backgroundColor: game.color ? game.color : "white",
                      }}
                    ></div>
                  </div>
                );
              })}
              <div className="h-[50px]"></div> {/* マージン用div */}
            </nav>
          </div>
        </div>
      </div>

      {/* ゲーム詳細画面 */}
      {selectedApp && (
        <div
          className={`absolute top-0 left-0 z-40 w-full h-[100vh] duration-300 transition-opacity ${
            !selectedApp ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full h-full pr-[65vh] p-6 py-[60px]">
            <div className="w-full h-full flex flex-col gap-6">
              <header className="space-y-2">
                <h1 className="text-left text-5xl font-bold">
                  {selectedApp.title}
                </h1>
                <h4 className="text-xl">{selectedApp.describe}</h4>
              </header>
              <main className="flex-1 flex flex-col justify-between w-full overflow-x-hidden">
                <div className="w-full max-h-[60vh] ">
                  <h2 className="text-3xl font-bold">遊び方</h2>
                  <pre className="font-shin-retro">{selectedApp.usage}</pre>
                </div>
                <div className="flex gap-6">
                  <button
                    className="launch-button"
                    disabled={isAppLoading || isAppRunning}
                    onClick={() =>
                      invokeApp(selectedApp.exePath + selectedApp.exeFileName)
                    }
                  >
                    {/* isLoading中はテキストを変更 */}
                    {isAppRunning
                      ? "実行中"
                      : isAppLoading
                      ? "ロード中..."
                      : "起動する"}
                  </button>
                  <button
                    className="back-button"
                    onClick={handleBackButtonClick}
                  >
                    戻る
                  </button>
                </div>
              </main>
            </div>
          </div>
          {/* エラーメッセージ */}
          <div
            className={`absolute bottom-8 right-8 rounded-2xl p-4 bg-white/50 backdrop-blur-xl outline-2 outline-red-500 transition-opacity duration-300 ease-in-out ${
              errorShow ? "opacity-100" : "opacity-0"
            }`}
          >
            {feedback?.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default CDLauncher;
