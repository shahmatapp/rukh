use serde_json::{json, Value};
use sqlx::SqlitePool;
use crate::db::{books, models::{Book, CreateBookInput}};
use crate::handlers::types::{AppState, WsResponse};
use crate::parse_or_error;

async fn create_book(pool: SqlitePool,correlation_id:String, payload: Value) -> WsResponse {
    let input = parse_or_error!(payload, CreateBookInput);
    let book = Book::create(input);
    match books::create_book(&pool, &book).await {
        Ok(_) => WsResponse::Ok {
            data: "done".into(),
            correlation_id
        },
        Err(_) => WsResponse::Error {
            message: "Couldn't create book".into(),
        },
    }
}

async fn list_books(pool: SqlitePool, correlation_id:String) -> WsResponse {
    match books::get_books(&pool).await {
        Ok(book_vec) => WsResponse::Ok {
            data: json!(book_vec),
            correlation_id
        },
        Err(e) => WsResponse::Error {
            message: format!("Could not list books: {e}"),
        },
    }
}

async fn get_book(pool: SqlitePool, correlation_id:String, payload: Value) -> WsResponse {
    // We expect payload to have { "id": "<book-id>" }
    #[derive(serde::Deserialize)]
    struct BookId {
        id: String,
    }
    let data = parse_or_error!(payload,  BookId);
    match books::get_book(&pool, &data.id).await {
        Ok(book) => WsResponse::Ok { data: json!(book), correlation_id },
        Err(_) => WsResponse::Error {
            message: String::from("Could not find book"),
        },
    }
}

async fn update_book(pool: SqlitePool, correlation_id:String, payload: Value) -> WsResponse {
    // We expect payload to have { "id": "some-id", "title": "...", "author": "..." }
    // or it might be a full Book struct
    let book = parse_or_error!(payload, Book);
    match books::update_book(&pool, &book).await {
        Ok(_) => WsResponse::Ok {
            data: json!("Book updated successfully"),
            correlation_id
        },
        Err(_) => WsResponse::Error {
            message: String::from("Failed to update book"),
        },
    }
}

async fn delete_book(pool: SqlitePool, correlation_id:String, payload: Value) -> WsResponse {
    #[derive(serde::Deserialize)]
    struct BookId {
        id: String,
    }
    let data = parse_or_error!(payload, BookId);

    match books::delete_book(&pool, &data.id).await {
        Ok(_) => WsResponse::Ok {
            data: json!("Book deleted"),
            correlation_id
        },
        Err(_) => WsResponse::Error {
            message: String::from("Failed to delete book"),
        },
    }
}

pub async fn process(correlation_id:String, action: String, payload: Value, state: AppState) -> WsResponse {
    match action.as_str() {
        "create" => create_book(state.db_pool.clone(), correlation_id, payload).await,
        "list" => list_books(state.db_pool.clone(), correlation_id).await,
        "get" => get_book(state.db_pool.clone(), correlation_id, payload).await,
        "update" => update_book(state.db_pool.clone(), correlation_id, payload).await,
        "delete" => delete_book(state.db_pool.clone(), correlation_id, payload).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}
