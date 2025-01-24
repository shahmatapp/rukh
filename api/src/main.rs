use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use dotenvy::dotenv;
use sqlx::sqlite::{SqlitePoolOptions};
use std::env;
use axum::extract::State;
use tokio::signal;
use futures::stream::StreamExt;
use crate::handlers::types::{WsResponse,WsMessage, AppState};

mod db;
mod handlers;


async fn ws_handler(State(state): State<AppState>,ws: WebSocketUpgrade) -> impl IntoResponse {
    // `on_upgrade` invokes `handle_socket` once the handshake is done

    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn process_request<'a>(msg: WsMessage<'a>, state: AppState) -> WsResponse {
    match msg.model {
        "book" => handlers::books::process(msg.action, msg.payload, state).await,
        //"move" => process_user_request(msg.action, msg.payload),
        other => WsResponse::Error {
            message: format!("Unknown model: {}", other),
        },
    }
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    // Echo incoming messages back to the client
    while let Some(Ok(Message::Text(msg))) = socket.next().await {
        let response:WsResponse = match serde_json::from_str::<WsMessage>(&msg){
            Ok(req) => {
                process_request(req, state.clone()).await
            }
            Err(e) => {
                WsResponse::Error {
                    message: format!("Invalid JSON: {e}"),
                }
            },
        };

        let resp_text = serde_json::to_string(&response).unwrap();
        if socket.send(Message::Text(resp_text.into())).await.is_err() {
            break;
        }
    }

}

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv().ok();

    // Get DATABASE_URL from environment
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Create the database connection pool
    let db_pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to the database");


    // Bootstrap the database
    db::bootstrap::bootstrap_db(&db_pool, &database_url)
        .await
        .expect("Failed to bootstrap the database");
    // Build Axum state
    let state = AppState { db_pool };

    // Build the router with a route
    let app = Router::new()
        .route("/ws", get(ws_handler))
        .with_state(state);
    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    // Wait for Ctrl+C
    signal::ctrl_c()
        .await
        .expect("failed to install CTRL+C signal handler");
}
