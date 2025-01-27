use crate::db::models::Book;
use sqlx::{Pool, Sqlite};


pub async fn create_book(pool: &Pool<Sqlite>, book: &Book) -> Result<(), sqlx::Error> {
    sqlx::query(r#"
        INSERT INTO books (id, name, description, perspective)
        VALUES (?, ?, ?, ?)
        "#)
        .bind(&book.id.to_string())
        .bind(&book.name)
        .bind(&book.description)
        .bind(&book.perspective)
        .execute(pool).await?;
        Ok(())
   
}

pub async fn get_books(pool: &Pool<Sqlite>) -> Result<Vec<Book>, sqlx::Error> {
    sqlx::query_as(
        r#"
        SELECT id, name, description, perspective FROM books
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_book(pool: &Pool<Sqlite>, id: &str) -> Result<Book, sqlx::Error> {
    sqlx::query_as(
        r#"
        SELECT id, name, description, perspective FROM books WHERE id = ?
        "#)
    .bind(id.to_string())
    .fetch_one(pool)
    .await
}

pub async fn update_book(pool: &Pool<Sqlite>, book: &Book) -> Result<(), sqlx::Error> {
    let id_str = book.id.to_string();
    sqlx::query!(
        r#"
        UPDATE books SET name = ?, description = ? WHERE id = ?
        "#,
        book.name,
        book.description,
        id_str
    )
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn delete_book(pool: &Pool<Sqlite>, id: &str) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        DELETE FROM books WHERE id = ?
        "#,
        id
    )
    .execute(pool)
    .await?;
    Ok(())
}

// Add similar CRUD functions for `moves`...
