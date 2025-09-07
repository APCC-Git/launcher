// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
use std::io::ErrorKind;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn invoke_app(file_name: &str) -> Result<String, String> {
    let app_path = format!("./apps/{}", file_name);

    // Commandの実行結果をmatchでハンドリング
    match Command::new(&app_path).status() {
        // プロセスの起動に成功した場合
        Ok(status) => {
            // プロセスが正常に終了したか（exit codeが0か）をチェック
            if status.success() {
                let success_message = format!("プロセス '{}' は正常に終了しました。", file_name);
                println!("{}", success_message);
                // 成功した場合はOk()でメッセージを返す
                Ok(success_message)
            } else {
                // 終了コードが0以外の場合（プロセス内でエラーが発生した場合）
                let error_message = format!(
                    "プロセス '{}' はエラーで終了しました。終了コード: {:?}",
                    file_name,
                    status.code()
                );
                eprintln!("{}", error_message); // エラーは標準エラー出力へ
                // 失敗した場合はErr()でエラーメッセージを返す
                Err(error_message)
            }
        }
        // プロセスの起動自体に失敗した場合
        Err(e) => {
            // エラーの種類に応じてメッセージを生成
            let error_message = match e.kind() {
                ErrorKind::NotFound => {
                    format!("実行ファイルが見つかりません: {}", app_path)
                }
                _ => {
                    format!("プロセスの起動に失敗しました ({}): {}", app_path, e)
                }
            };
            eprintln!("{}", error_message);
            // 失敗した場合はErr()でエラーメッセージを返す
            Err(error_message)
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet,invoke_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
