use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use dotenvy::dotenv;
use std::env;
use axum::extract::State;
use tokio::signal;
use futures::stream::StreamExt;
use sea_orm::Database;
use crate::handlers::types::{WsResponse, WsMessage, AppState};
use migration::{Migrator, MigratorTrait};

mod handlers;
mod entities;

async fn ws_handler(State(state): State<AppState>,ws: WebSocketUpgrade) -> impl IntoResponse {
    // `on_upgrade` invokes `handle_socket` once the handshake is done

    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn process_request<'a>(msg: WsMessage, state: AppState) -> WsResponse {
    match msg.model.as_str() {
        "book" => handlers::books::process(msg.correlation_id, msg.action, msg.payload, state).await,
        "move" => handlers::moves::process(msg.correlation_id, msg.action, msg.payload, state).await,
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


    let conn = Database::connect(&database_url)
        .await
        .expect("Database connection failed");

    // Bootstrap the database
    Migrator::up(&conn, None).await.unwrap();

    // Build Axum state
    let state = AppState { conn };

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
