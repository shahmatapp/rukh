use serde::Deserialize;
use serde_json::Value;
use sqlx::SqlitePool;

#[derive(Debug, Deserialize)]
pub struct WsMessage{
    pub correlation_id: String,
    pub model: String,
    pub action: String,
    pub payload: Value
}

#[derive(Debug, serde::Serialize)]
pub enum WsResponse {
    Ok { correlation_id : String, data: Value },
    Error { message: String },
}

#[derive(Clone)]
pub struct AppState {
    pub db_pool: SqlitePool,
}