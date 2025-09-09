use std::process::Command;
use std::io::ErrorKind;
use std::thread;
use tauri::{AppHandle, Emitter};

#[tauri::command]
fn invoke_app(file_name: String, handle: AppHandle) -> Result<String, String> {
    let app_path = format!("./apps/{}", file_name);

    match Command::new(&app_path).spawn() {
        // プロセスの起動に成功した場合
        Ok(mut child) => {
            let success_message = format!("'{}' の起動に成功しました。", file_name);
            println!("{}", success_message);

             // アプリの終了を監視するためのスレッドを開始
            thread::spawn(move || {
                // child.wait() は同期的で、プロセスが終了するまでこのスレッドをブロックする
                let _ = child.wait();

                println!("'{}' が終了しました。", &file_name);

                // 全てのウィンドウに 'app-terminated' というイベント名で通知
                // ペイロードとして終了したファイル名を渡す
                handle.emit("app-terminated", Some(file_name)).unwrap();
            });

            Ok(success_message)
        }
        // プロセスの起動自体に失敗した場合
        Err(e) => {
            let error_message = match e.kind() {
                ErrorKind::NotFound => {
                    format!("実行ファイルが見つかりません: {}", app_path)
                }
                _ => {
                    format!("プロセスの起動に失敗しました ({}): {}", app_path, e)
                }
            };
            eprintln!("{}", error_message);
            Err(error_message)
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![invoke_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
