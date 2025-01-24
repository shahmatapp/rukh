use axum::{
    extract::{Extension, Json, Path},
    http::StatusCode,
};
use serde_json::{from_value, Value};
use sqlx::SqlitePool;

use crate::db::{books, models::Book};
use crate::handlers::types::{AppState, WsResponse};

async fn create_book(pool: SqlitePool, payload: Value) -> WsResponse {
    match from_value::<Book>(payload) {
        Ok(book) => {
            if books::create_book(&pool, &book).await.is_ok() {
                WsResponse::Ok {
                    data: Value::String("done".into()),
                }
            } else {
                WsResponse::Error {
                    message: String::from("Couldnt create book"),
                }
            }
        }
        Err(e) => WsResponse::Error {
            message: String::from("Couldnt parse payload"),
        },
    }
}

async fn list_books(Extension(pool): Extension<SqlitePool>) -> Result<Json<Vec<Book>>, StatusCode> {
    books::get_books(&pool)
        .await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn get_book(
    Path(id): Path<String>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Book>, StatusCode> {
    books::get_book(&pool, &id)
        .await
        .map(Json)
        .map_err(|_| StatusCode::NOT_FOUND)
}

async fn update_book(
    Extension(pool): Extension<SqlitePool>,
    Path(id): Path<String>,
    Json(payload): Json<Book>,
) -> StatusCode {
    let mut book = payload;
    book.id = id; // Use path parameter as the ID
    if books::update_book(&pool, &book).await.is_ok() {
        StatusCode::OK
    } else {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

async fn delete_book(Path(id): Path<String>, Extension(pool): Extension<SqlitePool>) -> StatusCode {
    if books::delete_book(&pool, &id).await.is_ok() {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

pub async fn process(action: &str, payload: Value, state: AppState) -> WsResponse {
    match action {
        "create" => create_book(state.db_pool, payload).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}
