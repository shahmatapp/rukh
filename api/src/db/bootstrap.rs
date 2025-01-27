use sqlx::{Pool, Sqlite};
use std::fs;
use std::path::Path;

/// Bootstraps the SQLite database by creating the directory and required tables.
pub async fn bootstrap_db(pool: &Pool<Sqlite>, db_path: &str) -> Result<(), sqlx::Error> {
    // Ensure the directory exists
    let db_dir = Path::new(db_path).parent().unwrap();
    if !db_dir.exists() {
        fs::create_dir_all(db_dir).expect("Failed to create database directory");
    }

    // Create the required tables
    let query = r#"
        CREATE TABLE IF NOT EXISTS books (
            id varchar PRIMARY KEY,
            name varchar NOT NULL,
            description TEXT,
            perspective varchar(1) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS moves (
            id varchar PRIMARY KEY,
            bookId varchar,
            fen varchar NOT NULL,
            isMe boolean NOT NULL,
            parent varchar,
            move TEXT Not null
        );

    "#;

    sqlx::query(query)
        .execute(pool)
        .await?;

    Ok(())
}
