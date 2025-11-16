use std::io::Write;
use std::process::Command;
use tauri::{Manager, Runtime, Webview};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_updater::UpdaterExt;
use tempfile::NamedTempFile;
use url::Url;

#[derive(serde::Serialize)]
struct UpdateResult {
    rid: u32,
    version: String,
    date: String,
    body: String,
    raw_json: String,
}

#[tauri::command]
async fn check_updates<R: Runtime>(
    webview: Webview<R>,
    base_url: String,
) -> Result<Option<UpdateResult>, String> {
    let update_url = format!("{}/v1/frontend-update", base_url);
    let update_url = Url::parse(&update_url).map_err(|e| e.to_string())?;

    let update = webview
        .updater_builder()
        .endpoints(vec![update_url])
        .map_err(|e| e.to_string())?
        .build()
        .map_err(|e| e.to_string())?
        .check()
        .await
        .map_err(|e| e.to_string())?;

    let result = update.map(|u| {
        let rid = webview.resources_table().add(u.clone());
        UpdateResult {
            rid,
            version: u.version.to_string(),
            date: u.date.map_or(String::new(), |d| d.to_string()),
            body: u.body.unwrap_or_default(),
            raw_json: u.raw_json.to_string(),
        }
    });

    Ok(result)
}

#[tauri::command]
fn get_env_var(key: String) -> Option<String> {
    std::env::var(key).ok()
}

#[tauri::command]
async fn kill_process(pid: u32) -> Result<(), String> {
    // Kill the process with the given PID and its sub-process
    #[cfg(target_os = "windows")]
    let output = Command::new("taskkill")
        .args(&["/PID", &pid.to_string(), "/F", "/T"])
        .output()
        .map_err(|e| e.to_string())?;

    #[cfg(any(target_os = "linux", target_os = "macos"))]
    let output = Command::new("kill")
        .args(&["-9", &pid.to_string()])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to kill process: {}", stderr))
    }
}

#[tauri::command]
async fn run_cmd_script(script: String) -> Result<String, String> {
    let mut temp = NamedTempFile::new().map_err(|e| e.to_string())?;
    write!(temp, "{}", script).map_err(|e| e.to_string())?;

    let path = temp.path().to_str().ok_or("Invalid path")?;

    let output = Command::new("cmd")
        .args(["/C", path])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if cfg!(dev) {
        std::env::set_var("TAURI_DEBUG", "true");
    } else {
        std::env::set_var("TAURI_DEBUG", "false");
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {
            // Handle when a second instance is launched (optional)
        }))
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_app_exit::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .max_file_size(100_000_000 /* bytes */)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            kill_process,
            run_cmd_script,
            get_env_var,
            check_updates
        ])
        .setup(|app| {
            #[cfg(desktop)]
            app.deep_link().register_all()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
