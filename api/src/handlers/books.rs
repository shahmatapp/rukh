use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait};
use serde_json::{json, Value};
use crate::handlers::types::{AppState, WsResponse};
use crate::parse_or_error;
use crate::entities::books as book;


async fn create_book(conn: DatabaseConnection,correlation_id:String, payload: Value) -> WsResponse {
    let input = parse_or_error!(payload, book::InsertModel);
    let active: book::ActiveModel = input.to_active_model();
    match book::Entity::insert(active).exec(&conn).await {
        Ok(_) => WsResponse::Ok {
            data: "done".into(),
            correlation_id
        },
        Err(_) => WsResponse::Error {
            message: "Couldn't create book".into(),
        },
    }
}

async fn list_books(conn: DatabaseConnection, correlation_id:String) -> WsResponse {
    match book::Entity::find().all(&conn).await {
        Ok(book_vec) => WsResponse::Ok {
            data: json!(book_vec),
            correlation_id
        },
        Err(e) => WsResponse::Error {
            message: format!("Could not list books: {e}"),
        },
    }
}

async fn get_book(conn: DatabaseConnection, correlation_id:String, payload: Value) -> WsResponse {
    // We expect payload to have { "id": "<book-id>" }
    #[derive(serde::Deserialize)]
    struct BookId {
        id: String,
    }
    let data = parse_or_error!(payload,  BookId);
    match book::Entity::find_by_id(data.id).one(&conn).await {
        Ok(book) => WsResponse::Ok { data: json!(book), correlation_id },
        Err(_) => WsResponse::Error {
            message: String::from("Could not find book"),
        },
    }
}

async fn update_book(conn: DatabaseConnection, correlation_id:String, payload: Value) -> WsResponse {
    // We expect payload to have { "id": "some-id", "title": "...", "author": "..." }
    // or it might be a full Book struct
    let book = parse_or_error!(payload, book::Model);
    let active_model: book::ActiveModel = book.into();
    match active_model.update(&conn).await {
        Ok(_) => WsResponse::Ok {
            data: json!("OK"),
            correlation_id
        },
        Err(_) => WsResponse::Error {
            message: String::from("Failed to update book"),
        },
    }
}

async fn delete_book(conn: DatabaseConnection, correlation_id:String, payload: Value) -> WsResponse {
    #[derive(serde::Deserialize)]
    struct BookId {
        id: String,
    }
    let data = parse_or_error!(payload, BookId);

    match book::Entity::delete_by_id(data.id).exec(&conn).await {
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
        "create" => create_book(state.conn.clone(), correlation_id, payload).await,
        "list" => list_books(state.conn.clone(), correlation_id).await,
        "get" => get_book(state.conn.clone(), correlation_id, payload).await,
        "update" => update_book(state.conn.clone(), correlation_id, payload).await,
        "delete" => delete_book(state.conn.clone(), correlation_id, payload).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}
