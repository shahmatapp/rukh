use serde::Deserialize;
use serde_json::Value;
use sqlx::SqlitePool;

#[derive(Debug, Deserialize)]
pub(crate) struct WsMessage<'a>{
    pub(crate) model: &'a str,
    pub(crate) action: &'a str,
    pub(crate) payload: Value
}

#[derive(Debug, serde::Serialize)]
pub(crate) enum WsResponse {
    Ok { data: Value },
    Error { message: String },
}

#[derive(Clone)]
pub(crate) struct AppState {
    pub(crate) db_pool: SqlitePool,
}