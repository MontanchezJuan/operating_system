use std::{fs::{self}, path::Path};

#[tauri::command]
pub fn upload_image(name: &str, image_data: Vec<u8>) -> Result<String, String> {
    let file_name = format!("data/{name}.png");
    
    match fs::write(&file_name, &image_data) {
        Ok(_) => Ok("Image uploaded successfully".to_string()),
        Err(_) => Err("Failed to upload image".to_string()),
    }
}


#[tauri::command]
pub fn create_directory(path: &str) -> Result<String, String> {
    let base_path = format!("data/{path}");
    // let path = Path::new(&path_name);
    let mut dir_path = Path::new(&base_path).to_path_buf();
    let mut counter = 1;

    // Incrementar el nombre si el directorio ya existe
    while dir_path.exists() {
        dir_path = Path::new(&format!("{base_path} ({counter})")).to_path_buf();
        counter += 1;
    }

    // Crear el directorio
    fs::create_dir_all(&dir_path).map_err(|e| {
        eprintln!("Failed to create directory: {e}");
        format!("Failed to create directory: {e}")
    })?;

    Ok(format!("Directory created successfully at {:?}", dir_path))
}


#[tauri::command]
pub fn create_file(path: &str, filename: &str) -> Result<String, String> {
    let path_name = format!("data/{path}");
    let dir_path = Path::new(&path_name);
    // let path_name_file = format!("data/{path}/{filename}");
    // let file_path = Path::new(&path_name_file);

    // Asegúrate de que el directorio base existe
    if !dir_path.exists() {
        fs::create_dir_all(dir_path).map_err(|e| format!("Failed to create directories: {e}"))?;
    }

    // Genera el path del archivo
    let mut file_path = dir_path.join(filename);
    let mut counter = 1;

    // Incrementar el nombre si el archivo ya existe
    while file_path.exists() {
        let stem = Path::new(filename)
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("Unnamed");
        let extension = Path::new(filename)
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| format!(".{e}"))
            .unwrap_or_default();
        let new_name = format!("{stem} ({counter}){extension}");
        file_path = dir_path.join(new_name);
        counter += 1;
    }

    // Crear el archivo
    fs::File::create(&file_path).map_err(|e| format!("Failed to create file: {e}"))?;

    Ok(format!("File created successfully at {:?}", file_path))
}


#[tauri::command]
pub fn rename_directory(path: &str, old_name: &str, new_name: &str) -> Result<String, String> {
    let path_name = format!("data/{path}");
    let dir_path = Path::new(&path_name);
    let old_dir_path = dir_path.join(old_name);
    let mut new_dir_path = dir_path.join(new_name);

    if !old_dir_path.exists() {
        return Err(format!("Directory does not exist: {:?}", old_dir_path));
    }

    let mut counter = 1;
    while new_dir_path.exists() {
        let iterated_name = format!("{new_name} ({counter})");
        new_dir_path = dir_path.join(iterated_name);
        counter += 1;
    }

    fs::rename(&old_dir_path, &new_dir_path)
        .map_err(|e| format!("Failed to rename directory: {e}"))?;

    Ok(format!("Directory renamed successfully to {:?}", new_dir_path))
}


#[tauri::command]
pub fn rename_file(path: &str, old_name: &str, new_name: &str) -> Result<String, String> {
    let path_name = format!("data/{path}");
    let dir_path = Path::new(&path_name);
    let old_file_path = dir_path.join(old_name);
    let mut new_file_path = dir_path.join(new_name);

    if !old_file_path.exists() {
        return Err(format!("File does not exist: {:?}", old_file_path));
    }

    let mut counter = 1;
    while new_file_path.exists() {
        let stem = Path::new(new_name)
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("Unnamed");
        let extension = Path::new(new_name)
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| format!(".{e}"))
            .unwrap_or_default();
        let iterated_name = format!("{stem} ({counter}){extension}");
        new_file_path = dir_path.join(iterated_name);
        counter += 1;
    }

    fs::rename(&old_file_path, &new_file_path)
        .map_err(|e| format!("Failed to rename file: {e}"))?;

    Ok(format!("File renamed successfully to {:?}", new_file_path))
}


#[tauri::command]
pub fn delete_directory(path: &str) -> Result<String, String> {
    let path_name = format!("data/{path}");
    let path = Path::new(&path_name);

    fs::remove_dir_all(path).map_err(|e| {
        eprintln!("Failed to delete directory: {e}");
        format!("Failed to delete directory: {e}")
    })?;
    Ok(format!("Directory at {:?} deleted successfully.", path))
}


#[tauri::command]
pub fn delete_file(path: &str) -> Result<String, String> {
    let path_name = format!("data/{path}");
    let file_path = Path::new(&path_name);

    if !file_path.exists() {
        return Err(format!("File does not exist: {:?}", file_path));
    }

    fs::remove_file(&file_path).map_err(|e| format!("Failed to delete file: {e}"))?;
    Ok(format!("File deleted successfully: {:?}", file_path))
}


#[tauri::command]
pub fn list_directories(username: &str) -> Result<Vec<String>, String> {
    let path = format!("data/{username}");
    let entries = fs::read_dir(&path).map_err(|e| format!("Failed to read directory: {e}"))?;

    // Convertimos los resultados en un Vec<String>
    let directories: Vec<String> = entries
        .filter_map(|entry| {
            entry.ok().and_then(|e| {
                let path = e.path();
                if path.is_dir() {
                    path.file_name()
                        .and_then(|name| name.to_str().map(|s| s.to_string()))
                } else {
                    None
                }
            })
        })
        .collect();

    Ok(directories)
}

#[derive(serde::Serialize)]
pub struct FileInfo {
    pub name: String,
    pub is_dir: bool,
    pub extension: Option<String>, 
}

#[tauri::command]
pub fn list_all_files(base_path: &str) -> Result<Vec<FileInfo>, String> {
    let path = format!("data/{base_path}");
    let entries = fs::read_dir(&path).map_err(|e| format!("Failed to read directory: {e}"))?;

    let files: Vec<FileInfo> = entries
        .filter_map(|entry| {
            entry.ok().and_then(|e| {
                let path = e.path();
                let is_dir = path.is_dir();
                path.file_name().and_then(|name| {
                    let name_str = name.to_str()?;
                    // Excluir config.txt
                    if name_str == "config.txt" {
                        return None;
                    }
                    Some(FileInfo {
                        name: name_str.to_string(),
                        is_dir,
                        extension: if is_dir {
                            None // Directorios no tienen extensión
                        } else {
                            path.extension()
                                .and_then(|ext| ext.to_str())
                                .map(|ext| ext.to_string())
                        },
                    })
                })
            })
        })
        .collect();

    Ok(files)
}

