use serde_json::{json, Value};
use sqlx::SqlitePool;
use crate::db::models::QueryMove;
use crate::db::moves;
use crate::handlers::types::{AppState, WsResponse};
use crate::parse_or_error;

async fn list_moves(pool: SqlitePool, payload: Value, correlation_id:String) -> WsResponse {
    let input = parse_or_error!(payload, QueryMove);
    match moves::get_moves_from_parent(&pool, input.parent, input.book_id.unwrap()).await {
        Ok(book_vec) => WsResponse::Ok {
            data: json!(book_vec),
            correlation_id
        },
        Err(e) => WsResponse::Error {
            message: format!("Could not list books: {e}"),
        },
    }
}
pub async fn process(correlation_id:String, action: String, payload: Value, state: AppState) -> WsResponse {
    match action.as_str() {
        "list" => list_moves(state.db_pool.clone(), payload,correlation_id).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}