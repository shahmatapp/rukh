use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Book {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub perspective: String,
}

impl Book{
    pub fn create(input: CreateBookInput) ->Book{
        Book {
            id: Uuid::new_v4().to_string(),
            name: input.name,
            description: input.description,
            perspective: input.perspective,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateBookInput {
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