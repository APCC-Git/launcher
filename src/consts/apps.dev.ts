import type { App } from "../types/App";

export const apps: App[] = [
  {
    title: "マインスイーパー",
    exeFileName: "hoge.exe",
    exePath: "",
    thumbnail: "/thumbnail/minesweeper.png",
    describe: "hogehogehoge",
    usage: "",
    icon: "/icon/minesweeper.png",
    color: "orange",
  },
  {
    title: "escape",
    exeFileName: "main.exe",
    exePath: "escape/escape/",
    thumbnail: "/thumbnail/escape.png",
    describe: "fugafugafuga",
    usage: "",
    icon: "/icon/escape.png",
    color: "#f54263",
  },
  {
    title: "落ちもの",
    exeFileName: "otimono_simple.exe",
    exePath: "落ちもの/otimono_simple/",
    thumbnail: "/thumbnail/otimono.png",
    describe: "上から降ってくるピースを一列揃えて消し続けるゲームです。",
    usage: `Aボタン：ホールド
Sボタン：左回転
Dボタン：右回転
↑：一気に落ちるやつ
←：左に移動
↓：一段落とす
→：右に移動
下のほうにあるピース：ホールド中のピース
右のほうにあるピース：(灰色のピース:今降っているピース(blachout))
           それ以外：次以降降ってくるピース
blackoutについて
Wボタン：10回押すと画面がもとに戻ります。`,
    icon: "/icon/otimono.png",
    color: "#ec42f5",
  },
  {
    title: "EQUALIZE",
    exeFileName: "equalize.exe",
    exePath: "EQUALIZE/",
    thumbnail: "/thumbnail/otimono.png",
    describe: "fugafugafuga",
    usage: "",
    icon: "/icon/equalize.png",
    color: "#00ff99",
  },
  {
    title: "シューティング",
    exeFileName: "ShootingGame.exe",
    exePath: "Shooting/Build_exe/",
    thumbnail: "/thumbnail/shooting.png",
    describe: "fugafugafuga",
    usage: "",
    icon: "/icon/shooting.png",
    color: "limegreen",
  },
];
