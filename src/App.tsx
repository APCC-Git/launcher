import "./App.css";
import React, { useState, useEffect } from "react";
import { apps, launcherSettings } from "./consts";
import { App } from "./types/App";
import { invoke } from "@tauri-apps/api/core";

// 表示するフィードバックメッセージの型
interface Feedback {
  type: "success" | "error";
  message: string;
}

// 定数
const CONFIG = {
  cd: {
    diameterVH: 90, // CDの直径 (vh)
    rotationSpeed: 0.5, // スクロールに対する回転倍率
    holeSize: 120, // 中央の穴の直径 (px)
    innerHoleSize: 80, // 内側の穴の直径 (px)
    trackCount: 10, // トラックの本数
    trackOffset: 15, // 最初のトラックまでの距離 (px)
    trackSpacing: 8, // トラック間隔 (px)
  },
  layout: {
    centerOffsetXRatio: 0.15, // 中心Xのオフセット (画面左端からの割合)
    angleRangeDeg: 50, // アプリ配置の角度範囲（度数）
    cardLeftOffset: 40, // 各カードのCDの周からのオフセット
    cardSpacing: 120, // カード同士の弧の距離 (px)
    startAngleDeg: -40, // 並べ始める基準角度（左端）
  },
};

const CDLauncher: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAppClick = (app: App) => {
    document.documentElement.style.setProperty("--cheker", app.color);
    setSelectedApp(app);
  };

  const handleBackButtonClick = () => {
    document.documentElement.style.setProperty(
      "--cheker",
      "var(--color-gray-400)"
    );
    setSelectedApp(null);
  };

  // ローディング状態を管理するためのstate
  const [isLoading, setIsLoading] = useState(false);
  // バックエンドからの結果を表示するためのstate
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function invokeApp(fileName: string) {
    // 既に何らかの処理が実行中の場合は何もしない
    if (isLoading) return;

    setIsLoading(true);
    setFeedback(null); // 前回のメッセージをクリア

    try {
      // Rustのコマンドを呼び出し、成功メッセージを受け取る
      const successMessage = await invoke("invoke_app", { fileName });
      setFeedback({ type: "success", message: String(successMessage) });
    } catch (errorMessage) {
      // Rust側でErrが返された場合、catchブロックでエラーメッセージを受け取る
      setFeedback({ type: "error", message: String(errorMessage) });
    } finally {
      // 成功・失敗にかかわらず、ローディング状態を解除
      setIsLoading(false);
    }
  }

  // CDの回転角度を計算
  const cdRotation = scrollY * CONFIG.cd.rotationSpeed;

  return (
    <div className="h-[100vh] bg-background overflow-x-hidden font-shin-retro">
      {/* 背景 */}
      <div className="absolute flex flex-col items-center justify-between top-0 left-0 w-full h-full">
        <div
          className="w-full"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        >
          <div className="w-full h-[60px] bg-checker"></div>
          <div className="w-full h-[60px] checker"></div>
        </div>
        <div
          className="w-full"
          style={{
            maskImage: "linear-gradient(to top, black 20%, transparent 90%)",
          }}
        >
          <div className="w-full h-[60px] checker"></div>
          <div className="w-full h-[60px] bg-checker"></div>
        </div>
      </div>
      {/* CD */}
      <div
        className={`fixed z-20 h-screen flex items-center justify-center pointer-events-none transition-all duration-300 ease-in-out ${
          !selectedApp
            ? "left-0 top-0 -translate-x-1/3"
            : "left-[100%] top-0 -translate-x-3/4"
        }
          `}
      >
        <div className="relative">
          {/* CDの外側 */}
          <div
            className="rounded-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 shadow-2xl"
            style={{
              width: `${CONFIG.cd.diameterVH}vh`,
              height: `${CONFIG.cd.diameterVH}vh`,
              transform: `rotate(${cdRotation}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* CD中央の穴 */}
            <div
              className="absolute top-1/2 left-1/2 bg-black rounded-full shadow-inner"
              style={{
                width: CONFIG.cd.holeSize,
                height: CONFIG.cd.holeSize,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="absolute top-1/2 left-1/2 bg-gray-300 rounded-full"
                style={{
                  width: CONFIG.cd.innerHoleSize,
                  height: CONFIG.cd.innerHoleSize,
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>

            {/* CDの反射効果 */}
            <div className="absolute inset-0 rounded-full bg-gradient-conic from-transparent via-white/20 to-transparent opacity-60"></div>

            {/* CDのトラック線 */}
            {Array.from({ length: CONFIG.cd.trackCount }).map((_, i) => {
              const offset = CONFIG.cd.trackOffset + i * CONFIG.cd.trackSpacing;
              return (
                <div
                  key={i}
                  className="absolute border border-gray-400/30 rounded-full"
                  style={{
                    top: offset,
                    left: offset,
                    right: offset,
                    bottom: offset,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ジャケット */}
      <div
        className={`absolute top-0 left-0 h-[95vh] w-[15vh] bg-white rounded-r-md z-100 mt-[2.5vh] transition-all duration-300 ease-in-out ${
          selectedApp ? "-translate-x-[100%]" : "translate-x-0"
        }`}
        onClick={() => setSelectedApp(null)}
      ></div>

      {/* ゲーム選択 */}
      <div
        className={`absolute top-0 left-0 z-10 flex items-center justify-center w-full h-[100vh] duration-300 transition-opacity ${
          selectedApp ? "opacity-0" : "opacity-100"
        }`}
      >
        <nav className="w-full h-[100vh] pl-[65vh] flex flex-col items-center justify-center gap-6 py-6">
          {apps.map((app, index) => {
            return (
              <div
                key={index}
                className="game-card relative shadow-lg font-shin-retro font-bold"
                onClick={() => handleAppClick(app)}
              >
                <h3 className="absolute left-24 text-center font-bold text-xl">
                  {app.title}
                </h3>
                <div
                  className="absolute top-0 left-6 w-8 h-full flex items-center"
                  style={{
                    backgroundColor: app.color ? app.color : "white",
                  }}
                >
                  {app.icon && <img src={app.icon} alt={app.title}></img>}
                </div>
                <div
                  className="absolute top-0 left-16 w-2 h-full"
                  style={{
                    backgroundColor: app.color ? app.color : "white",
                  }}
                ></div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* 詳細 */}
      {selectedApp && (
        <div
          className={`absolute top-0 left-0 z-10 w-full h-[100vh] duration-300 transition-opacity ${
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
              <main className="flex-1 flex flex-col justify-between w-full">
                <div className="w-full">
                  <h2 className="text-3xl font-bold">遊び方</h2>
                  <pre className="font-shin-retro">{selectedApp.usage}</pre>
                </div>
                <div className="flex gap-6">
                  <button
                    className="launch-button"
                    // isLoadingがtrueの間はボタンを無効化する
                    disabled={isLoading}
                    onClick={() =>
                      invokeApp(selectedApp.exePath + selectedApp.exeFileName)
                    }
                  >
                    {/* isLoading中はテキストを変更 */}
                    {isLoading ? "起動中" : "起動する"}
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
        </div>
      )}
    </div>
  );
};

export default CDLauncher;
