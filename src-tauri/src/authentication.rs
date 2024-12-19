use std::{fs::{self, File, OpenOptions}, io::{BufRead, BufReader, BufWriter, Write}, path::Path};
use bcrypt::{hash, verify, DEFAULT_COST};
use serde::Serialize;

use crate::file_system;

#[derive(Serialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password: String,
    pub role: String,
    pub photo: String,
    pub background: String,
}

#[derive(Serialize)]
pub struct Config {
    is_dark_mode: bool,
    color: String,
    language: String,
}

#[tauri::command]
pub fn get_config(id: &str) -> Result<Config, String> {
    let config_path = format!("data/{}/config.txt", id);

    // Verificar si el archivo existe
    if !Path::new(&config_path).exists() {
        return Err("Config file not found".to_string());
    }

    let file = File::open(&config_path).map_err(|_| "Failed to open config file")?;
    let reader = BufReader::new(file);

    // Leer la primera línea del archivo
    if let Some(Ok(line)) = reader.lines().next() {
        let parts: Vec<&str> = line.split(':').collect();
        if parts.len() == 3 {
            let is_dark_mode = parts[0].trim().parse::<bool>().unwrap_or(false); // Asumiendo 'true' o 'false' en la primera línea
            let color = parts[1].trim().to_string();
            let language = parts[2].trim().to_string();

            return Ok(Config {
                is_dark_mode,
                color,
                language,
            });
        }
    }

    Err("Invalid config file format".to_string())
}

#[tauri::command]
pub fn update_config(
    id: &str,
    new_is_dark_mode: &str,
    new_color: &str,
    new_language: &str,
) -> Result<String, String> {
    let config_path = format!("data/{}/config.txt", id);

    // Verificar si el archivo existe
    if !Path::new(&config_path).exists() {
        return Err("Config file not found".to_string());
    }

    // Abrir el archivo para lectura
    let file = File::open(&config_path).map_err(|_| "Failed to open config file")?;
    let mut reader = BufReader::new(file);
    
    // Leer solo la primera línea del archivo
    let mut line = String::new();
    if let Err(_) = reader.read_line(&mut line) {
        return Err("Failed to read config file".to_string());
    }

    // Abrir el archivo en modo escritura y sobrescribir solo la primera línea
    let file = OpenOptions::new()
        .write(true)
        .truncate(true) // Elimina todo el contenido previo
        .open(&config_path)
        .map_err(|_| "Failed to open config file for writing")?;
    let mut writer = BufWriter::new(file);

    // Escribir la línea actualizada
    writeln!(writer, "{}:{}:{}", new_is_dark_mode.to_string(), new_color.to_string(), new_language.to_string())
        .map_err(|_| "Failed to write to config file")?;

    Ok("Config updated successfully".to_string())
}

#[tauri::command]
pub fn login(username: &str, password: &str) -> Result<String, String> {
    let file_path = "data/user_data.txt";
    let file_exists = Path::new(file_path).is_file();

    if !file_exists {
        File::create(file_path).expect("Failed to create file");
    }

    if let Ok(data) = fs::read_to_string(file_path) {
        for line in data.lines() {
            let parts = line.split(':').collect::<Vec<&str>>();
            let user = parts[1];
            let pass = parts[2];
            let role = parts[3];
            if user == username {
                if verify(password, pass).expect("failed to verify the password") {
                    return Ok(role.to_string());
                }
            }
        }
    }

    Err("Password is incorrect".to_string())
}

#[tauri::command]
pub fn get_users() -> Vec<User> {
    let mut users = Vec::new();

    let file = File::open("data/user_data.txt").expect("failed to open file");
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("failed to read line");
        let parts = line.split(':').collect::<Vec<&str>>();

        let id = parts[0].to_string();
        let username = parts[1].to_string();
        let password = parts[2].to_string();
        let role = parts[3].to_string();
        let photo = parts[4].to_string();
        let background = parts[5].to_string();

        let user = User { id, username, password, role, photo, background };

        users.push(user);
    }

    users
}

#[tauri::command]
pub fn get_user_by_id(id: &str) -> Result<User, String> {
    let users = get_users();

    for user in users {
        if user.id == id {
            return Ok(user);
        }
    }

    Err("User not found".to_string())
}


#[tauri::command]
pub fn register_user(
    id: &str,
    username: &str,
    password: &str,
    role: &str,
    photo_path: Option<&str>,
    background_path: Option<&str>,
) -> Result<String, String> {
    let users = get_users();  // Suponiendo que tienes una función para obtener usuarios
    for user in users {
        if user.username == username {
            return Err("Username already exists".to_string());
        }
    }

    // Validar la existencia de la foto si se proporciona
    if let Some(photo) = &photo_path {
        let photo_full_path = format!("data/images/{}", photo);  // Concatenar correctamente el path
        if !Path::new(&photo_full_path).exists() {
            return Err("Photo file does not exist".to_string());
        }
    }

    // Validar la existencia del fondo si se proporciona
    if let Some(background) = &background_path {
        let background_full_path = format!("data/images/{}", background);  // Concatenar correctamente el path
        if !Path::new(&background_full_path).exists() {
            return Err("Background file does not exist".to_string());
        }
    }

    // Guardar datos del usuario en user_data.txt
    let mut file = File::options()
        .write(true)
        .append(true)
        .open("data/user_data.txt")
        .expect("Failed to open user data file");

    // Hashear la contraseña
    let hashed_password = hash(password, DEFAULT_COST).expect("Failed to hash password");

    // Escribir los datos del usuario en el archivo
    writeln!(
        file,
        "{}:{}:{}:{}:{}:{}",
        id,
        username,
        hashed_password,
        role,
        photo_path.unwrap_or("no_photo"),
        background_path.unwrap_or("no_background")
    )
    .expect("Failed to write user data");

    if let Err(err) = file_system::create_directory(id) {
        // Si ocurre un error, revertir todo
        revert_changes(id);
        return Err(format!("Failed to create user directory: {}", err));
    }

    // Crear subcarpetas
    let subdirectories = ["Desktop", "Documents", "Music", "Pictures", "Videos"];
    for subdirectory in subdirectories.iter() {
        let subdirectory_path = format!("{}/{}", id, subdirectory);
        if let Err(err) = file_system::create_directory(&subdirectory_path) {
            // Si ocurre un error, revertir todo
            revert_changes(&id);
            return Err(format!("Failed to create subdirectory {}: {}", subdirectory, err));
        }
    }

    // Crear el archivo config.txt
    let config_path = format!("data/{}/config.txt", id);
    let mut config_file = File::create(&config_path)
        .expect("Failed to create config.txt");

    // Escribir en config.txt con el formato deseado
    writeln!(config_file, "true:green:en")
        .expect("Failed to write to config.txt");

    Ok("User registered successfully".to_string())
}

/// Función para revertir los cambios realizados en caso de error
fn revert_changes(id: &str) {
    // Eliminar el usuario de user_data.txt
    let user_data_path = "data/user_data.txt";
    let result = remove_user_from_file(user_data_path, id);

    if let Err(err) = result {
        eprintln!("Failed to remove user from user_data.txt: {}", err);
    }

    // Eliminar la carpeta del usuario y su contenido
    let user_path = format!("data/{}", id);
    if let Err(err) = fs::remove_dir_all(&user_path) {
        eprintln!("Failed to remove user directory: {}", err);
    }
}

/// Eliminar al usuario del archivo user_data.txt
fn remove_user_from_file(file_path: &str, id: &str) -> std::io::Result<()> {
    let content = fs::read_to_string(file_path)?;
    let updated_content: Vec<String> = content
        .lines()
        .filter(|line| !line.starts_with(id))  // Filtramos la línea que contiene el usuario
        .map(|line| line.to_string())
        .collect();

    let mut file = File::create(file_path)?;
    for line in updated_content {
        writeln!(file, "{}", line)?;
    }

    Ok(())
}

#[tauri::command]
pub fn update_user(
    id: &str,
    new_username: Option<&str>,
    new_password: Option<&str>,
    new_role: Option<&str>,
    new_photo_path: Option<&str>,
    new_background_path: Option<&str>,
) -> Result<String, String> {
    let file_path = "data/user_data.txt";
    let mut users = get_users();

    let user_index = users.iter().position(|u| u.id == id);
    if let Some(index) = user_index {
        let user = &mut users[index];

        // Validar la ruta de la nueva foto
        if let Some(photo_path) = new_photo_path {
            if photo_path != "no_photo" {
                let photo_full_path = format!("data/images/{}", photo_path);
                if !Path::new(&photo_full_path).exists() {
                    return Err("Photo file does not exist or is invalid".to_string());
                }
            }
            user.photo = photo_path.to_string();
        }

        // Validar la ruta del nuevo fondo
        if let Some(background_path) = new_background_path {
            if background_path != "no_background" {
                let background_full_path = format!("data/images/{}", background_path);
                if !Path::new(&background_full_path).exists() {
                    return Err("Background file does not exist or is invalid".to_string());
                }
            }
            user.background = background_path.to_string();
        }

        // Actualizar la contraseña si se proporciona
        if let Some(password) = new_password {
            user.password = hash(password, DEFAULT_COST).expect("Failed to hash password");
        }

        // Actualizar el name si se proporciona
        if let Some(username) = new_username {
            user.username = username.to_string();
        }

        // Actualizar el rol si se proporciona
        if let Some(role) = new_role {
            user.role = role.to_string();
        }

        // Reescribir todos los usuarios en el archivo
        let mut file = File::create(file_path).expect("Failed to open user data file");
        for user in users {
            writeln!(
                file,
                "{}:{}:{}:{}:{}:{}",
                user.id, user.username, user.password, user.role, user.photo, user.background
            )
            .expect("Failed to write user data");
        }

        Ok("User updated successfully".to_string())
    } else {
        Err("User not found".to_string())
    }
}

#[tauri::command]
pub fn delete_user(id: &str) -> Result<String, String> {
    let file_path = "data/user_data.txt";
    let mut users = get_users();

    let user_index = users.iter().position(|u| u.id == id);
    if let Some(index) = user_index {
        if let Err(err) = file_system::delete_directory(id) {
            return Err(format!("Failed to delete directory for user {}: {}", id, err));
        }

        users.remove(index);

        let mut file = File::create(file_path).expect("failed to open file");
        for user in users {
            writeln!(
                file,
                "{}:{}:{}:{}:{}:{}",
                user.id, user.username, user.password, user.role, user.photo, user.background
            ).expect("failed to write in the file");
        }

        Ok("User deleted successfully".to_string())
    } else {
        Err("User not found".to_string())
    }
}

#[tauri::command]
pub fn get_last_user() -> Result<User, String> {
    let file_path = "data/last_user.txt";

    if !Path::new(file_path).is_file() {
        return Err("last_user.txt not found".to_string());
    }

    let data = fs::read_to_string(file_path).map_err(|_| "Failed to read last_user.txt")?;
    let id = data.trim();

    get_user_by_id(id)
}

#[tauri::command]
pub fn update_last_user(
        id: &str,
    ) -> Result<String, String> {
    let file_path = "data/last_user.txt";

    let mut file = File::create(file_path).expect("Failed to open last_user.txt");

    writeln!(file,"{}",id).expect("failed to write in the file");

    Ok("Last user updated successfully".to_string())
}