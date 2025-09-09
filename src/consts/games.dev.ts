import type { Game } from "../types/Game";

export const GAMES: Game[] = [
  {
    title: "マインスイーパー",
    exeFileName: "hoge.exe",
    exePath: "",
    thumbnail: "/thumbnail/minesweeper.png",
    describe:
      "隠された地雷の位置を推理しながら、安全なマスを開けていくパズルゲームです",
    usage: `左クリック：マスを開けます。
数字が表示された場合、その数字は周囲8マスにある地雷の数を示します。
地雷を開けてしまうとゲームオーバーです。

右クリック：そのマスに「旗」を立てます。
地雷があると思うマスに旗を立てて、誤って開けないようにします。
もう一度右クリックすると旗を外せます。

目標は、すべての地雷の位置を特定し、安全なマスをすべて開けることです。`,
    icon: "/icon/minesweeper.png",
    color: "orange",
  },
  {
    title: "シューティング",
    exeFileName: "ShootingGame.exe",
    exePath: "Shooting/Build_exe/",
    thumbnail: "/thumbnail/shooting.png",
    describe:
      "タイムアタックのシューティングゲームです。すべての敵を倒すまでの時間を競います。",
    usage: `移動: WASD
射撃: 左クリック
照準: 右クリック
視点: マウス
ダッシュ: Shift
ジャンプ: Space
ジェットパック: Space2回押し
ポーズ: Tab
    `,
    icon: "/icon/shooting.png",
    color: "limegreen",
  },
  {
    title: "escape",
    exeFileName: "main.exe",
    exePath: "escape/escape/",
    thumbnail: "/thumbnail/escape.png",
    describe: "逃げるゲームです",
    usage: `上/下/左/右キーで迫ってくる敵から逃げてください。
自分は青、敵は赤です。
緑は障害物なので避けてください。
    `,
    icon: "/icon/escape.png",
    color: "#f54263",
  },
  {
    title: "落ちもの",
    exeFileName: "otimono_simple.exe",
    exePath: "落ちもの/otimono_simple/",
    thumbnail: "/thumbnail/otimono.png",
    describe: "どこかで見たことあるような、落ちものパズルです",
    usage: `Aボタン：ホールド
Sボタン：左回転
Dボタン：右回転
↑：一気に落ちるやつ
←：左に移動
↓：一段落とす
→：右に移動
下のほうにあるピース：ホールド中のピース
右のほうにあるピース：(灰色のピース:今降っているピース(blachout))
それ以外：次以降降ってくるピース`,
    icon: "/icon/otimono.png",
    color: "#ec42f5",
  },
  {
    title: "EQUALIZE",
    exeFileName: "equalize.exe",
    exePath: "EQUALIZE/",
    thumbnail: "/thumbnail/otimono.png",
    describe: "数字や記号を選んで数式を完成させるパズルゲームです。",
    usage: `マスは、上下左右に隣接したマスのみ選択できます。
各ステージで指定された数だけマスを選びましょう。
計算式に「+」「−」と「×」「÷」の両方が含まれる場合、
「×」「÷」の計算が優先されます。
正しい計算式を完成させると、そのステージはクリアとなります。
5ステージすべてをクリアすると、ゲームクリアです。`,
    icon: "/icon/equalize.png",
    color: "#00ff99",
  },
];
