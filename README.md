# 文化祭ゲーム CD 用ランチャー

## Getting Started

```sh
npm install
npm run tauri dev
```

## 設定

1. `src/consts/apps.prod.ts`にゲームのリストを書く
2. `src/consts/index.ts`にランチャーのタイトルを書く
3. `public/thumbnail/`に各ゲームのサムネイルを置く
4. `public/icon/`に各ゲームのアイコンを置く
5. ターミナルで`npm run tauri build`
6. `src-tauri/target/release/launcher.exe`をマスターファイルのルートに置く
7. マスターファイルに`apps/`ディレクトリを作成しゲームファイルをコピー
