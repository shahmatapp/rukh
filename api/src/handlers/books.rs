use serde_json::{json, Value};
use sqlx::SqlitePool;

use crate::db::{books, models::Book};
use crate::handlers::types::{AppState, WsResponse};
use crate::parse_or_error;

async fn create_book(pool: SqlitePool, payload: Value) -> WsResponse {
    let book = parse_or_error!(payload, Book);
    match books::create_book(&pool, &book).await {
        Ok(_) => WsResponse::Ok {
            data: "done".into(),
        },
        Err(_) => WsResponse::Error {
            message: "Couldn't create book".into(),
        },
    }
}

async fn list_books(pool: SqlitePool) -> WsResponse {
    match books::get_books(&pool).await {
        Ok(book_vec) => WsResponse::Ok {
            data: json!(book_vec),
        },
        Err(_) => WsResponse::Error {
            message: String::from("Could not list books"),
        },
    }
}

async fn get_book(pool: SqlitePool, payload: Value) -> WsResponse {
    // We expect payload to have { "id": "<book-id>" }
    #[derive(serde::Deserialize)]
    struct BookId {
        id: String,
    }
    let data = parse_or_error!(payload, BookId);
    match books::get_book(&pool, &data.id).await {
        Ok(book) => WsResponse::Ok { data: json!(book) },
        Err(_) => WsResponse::Error {
            message: String::from("Could not find book"),
        },
    }
}

async fn update_book(pool: SqlitePool, payload: Value) -> WsResponse {
    // We expect payload to have { "id": "some-id", "title": "...", "author": "..." }
    // or it might be a full Book struct
    let book = parse_or_error!(payload, Book);
    match books::update_book(&pool, &book).await {
        Ok(_) => WsResponse::Ok {
            data: json!("Book updated successfully"),
        },
        Err(_) => WsResponse::Error {
            message: String::from("Failed to update book"),
        },
    }
}

async fn delete_book(pool: SqlitePool, payload: Value) -> WsResponse {
    #[derive(serde::Deserialize)]
    struct BookId {
        id: String,
    }
    let data = parse_or_error!(payload, BookId);

    match books::delete_book(&pool, &data.id).await {
        Ok(_) => WsResponse::Ok {
            data: json!("Book deleted"),
        },
        Err(_) => WsResponse::Error {
            message: String::from("Failed to delete book"),
        },
    }
}

pub async fn process(action: &str, payload: Value, state: AppState) -> WsResponse {
    match action {
        "create" => create_book(state.db_pool.clone(), payload).await,
        "list" => list_books(state.db_pool.clone()).await,
        "get" => get_book(state.db_pool.clone(), payload).await,
        "update" => update_book(state.db_pool.clone(), payload).await,
        "delete" => delete_book(state.db_pool.clone(), payload).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}
