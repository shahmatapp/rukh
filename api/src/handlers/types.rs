use sea_orm::DatabaseConnection;
use serde::Deserialize;
use serde_json::Value;

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
    pub conn: DatabaseConnection,
}