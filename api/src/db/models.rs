use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Book {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub perspective: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Move {
    pub id: String,
    pub book_id: String,
    pub fen: String,
    pub is_me: bool,
    pub parent: Option<String>,
    pub move_: String,
}