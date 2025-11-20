// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_store::Builder as StorePlugin;
use std::{fs, path::PathBuf};
use serde::Serialize;

#[derive(Serialize)]
struct SteamGame {
    app_id: String,
    name: String,
    install_dir: String,
    installed: bool,
}

#[tauri::command]
fn get_steam_id() -> Result<String, String> {
    let dirs = [
        "C:/Program Files (x86)/Steam/config/loginusers.vdf",
        "C:/Program Files/Steam/config/loginusers.vdf",
        "D:/Steam/config/loginusers.vdf",
        "E:/Steam/config/loginusers.vdf",
    ];

    for path in dirs {
        if std::path::Path::new(path).exists() {
            let text = std::fs::read_to_string(path).unwrap_or_default();
            let re = regex::Regex::new(r#"(\d{17})"#).unwrap();
            if let Some(cap) = re.captures(&text) {
                return Ok(cap[1].to_string());
            }
        }
    }

    Err("Steam ID not found".into())
}

// ---- Steam Scanner Command ---- //
#[tauri::command]
async fn scan_steam_games() -> Result<Vec<SteamGame>, String> {
    let steam_root = PathBuf::from(r"C:\Program Files (x86)\Steam");
    let steamapps = steam_root.join("steamapps");

    if !steamapps.exists() {
        return Err("Steam not found at default path".into());
    }

    let mut games = Vec::new();

    let entries = fs::read_dir(&steamapps).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if let Some(filename) = path.file_name().and_then(|n| n.to_str()) {
            if !filename.starts_with("appmanifest_") || !filename.ends_with(".acf") {
                continue;
            }
        } else {
            continue;
        }

        let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;

        let app_id = extract_acf_value(&content, "appid").unwrap_or_default();
        let name = extract_acf_value(&content, "name").unwrap_or_default();
        let installdir = extract_acf_value(&content, "installdir").unwrap_or_default();

        if app_id.is_empty() { continue; }

        let install_dir = steam_root
            .join("steamapps/common")
            .join(&installdir)
            .to_string_lossy()
            .to_string();
        let installed = PathBuf::from(&install_dir).exists();


        games.push(SteamGame {
            app_id,
            name,
            install_dir,
            installed,
        });
    }

    Ok(games)
}

fn extract_acf_value(content: &str, key: &str) -> Option<String> {
    let pattern = format!("\"{}\"", key);
    for line in content.lines() {
        if line.trim_start().starts_with(&pattern) {
            let parts: Vec<&str> = line.split('"').collect();
            if parts.len() >= 4 {
                return Some(parts[3].to_string());
            }
        }
    }
    None
}

#[tauri::command]
async fn launch_game(app_id: String) -> Result<(), String> {
    use std::process::Command;

    Command::new("cmd")
        .args(["/C", &format!("start steam://rungameid/{}", app_id)])
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        // Tauri Store plugin
        .plugin(StorePlugin::default().build())
        
        // Commands you expose to the frontend
        .invoke_handler(tauri::generate_handler![
            scan_steam_games,
            launch_game,
            get_steam_id
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


