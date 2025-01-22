use axum::{
    routing::{get,post},
    Router,
    Extension
};
use dotenvy::dotenv;
use std::env;
use sqlx::sqlite::SqlitePoolOptions;

mod db;
mod handlers;

// Handler for the root route
async fn root_handler() -> &'static str {
    "Welcome to your Axum server!"
}


#[tokio::main]
async fn main() {

    // Load environment variables from .env file
    dotenv().ok();

    // Get DATABASE_URL from environment
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

     // Create the database connection pool
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to the database");

     // Bootstrap the database
     db::bootstrap::bootstrap_db(&pool, &database_url)
     .await
     .expect("Failed to bootstrap the database");

     // Build the router with a route
    let app = Router::new()
        .route("/", get(root_handler))
        .route("/books", post(handlers::books::create_book).get(handlers::books::list_books))
        .route(
            "/books/{id}",
            get(handlers::books::get_book)
                .put(handlers::books::update_book)
                .delete(handlers::books::delete_book),
        )
        .layer(Extension(pool));
    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
