use axum::{
    extract::{Extension, Json, Path},
    http::StatusCode,
};
use sqlx::SqlitePool;

use crate::db::{models::Book, books};

pub async fn create_book(
    Extension(pool): Extension<SqlitePool>,
    Json(payload): Json<Book>
    ,
) -> StatusCode {
    if books::create_book(&pool, &payload).await.is_ok() {
        StatusCode::CREATED
    } else {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

pub async fn list_books(
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Vec<Book>>, StatusCode> {
    books::get_books(&pool)
        .await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn get_book(
    Path(id): Path<String>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Book>, StatusCode> {
    books::get_book(&pool, &id)
        .await
        .map(Json)
        .map_err(|_| StatusCode::NOT_FOUND)
}

pub async fn update_book(
    Extension(pool): Extension<SqlitePool>,
    Path(id): Path<String>,
    Json(payload): Json<Book>    
) -> StatusCode {
    let mut book = payload;
    book.id = id; // Use path parameter as the ID
    if books::update_book(&pool, &book).await.is_ok() {
        StatusCode::OK
    } else {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

pub async fn delete_book(
    Path(id): Path<String>,
    Extension(pool): Extension<SqlitePool>,
) -> StatusCode {
    if books::delete_book(&pool, &id).await.is_ok() {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

// Add similar handlers for `moves`...
