# 文化祭ゲーム CD 用ランチャー

## Getting Started

```sh
npm install
npm run dev
```

## 設定

1. `src/consts/apps.prod.ts`にゲームのリストを書く
2. `src/consts/index.ts`にランチャーのタイトルを書く
3. `public/thumbnail/`に各ゲームのサムネイルを置く
4. ターミナルで`npm run tauri build`
5. `src-tauri/target/release/launcher.exe`をマスターファイルのルートに置く
6. マスターファイルに`apps/`ディレクトリを作成しゲームファイルをコピー
