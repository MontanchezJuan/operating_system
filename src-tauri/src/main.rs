// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod authentication;
mod file_system;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            authentication::delete_user,
            authentication::get_config,
            authentication::get_last_user,
            authentication::get_user_by_id,
            authentication::get_users,
            authentication::login,
            authentication::register_user,
            authentication::update_config,
            authentication::update_last_user,
            authentication::update_user,
            file_system::create_directory,
            file_system::create_file,
            file_system::delete_directory,
            file_system::delete_file,
            file_system::list_all_files,
            file_system::list_directories,
            file_system::rename_directory,
            file_system::rename_file,
            file_system::upload_image,
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
