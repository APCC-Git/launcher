import type { Game } from "../types/Game";

let GAMES: Game[];

if (import.meta.env.MODE === "development") {
  GAMES = (await import("./games.dev")).GAMES;
} else {
  GAMES = (await import("./games.prod")).GAMES;
}

const LAUNCHER_CONFIG = {
  title: "APCC 2025ゲームCDランチャー",
  dialogShowDuration: 5000, // エラーメッセージを表示する時間 (ms)
  cd: {
    // 表示するCDの設定
    image: "/CD.jpg", // CDのジャケット画像
    diameterVH: 90, // CDの直径 (vh)
    outlineWithVH: 2, // CDの外枠の透明部分の幅 (vh)
    rotationSpeed: 0.5, // スクロールに対する回転倍率
    holeSize: 120, // 中央の穴の直径 (px)
    innerHoleSize: 80, // 内側の穴の直径 (px)
    trackCount: 10, // トラックの本数
    trackOffset: 15, // 最初のトラックまでの距離 (px)
    trackSpacing: 8, // トラック間隔 (px)
    spinWhileRunning: false, // アプリ実行中に回転するかどうか
  },
};

export { GAMES, LAUNCHER_CONFIG };
