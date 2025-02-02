use sqlx::{Pool, Sqlite};
use crate::db::models::{ Move};


pub async fn get_moves_from_parent(pool: &Pool<Sqlite>, parent: Option<String>, book_id: String) -> Result<Vec<Move>, sqlx::Error> {
    let query = match parent {
        Some(parent) => {
            sqlx::query_as(
                r#"
                SELECT id, fen, mov, parent, book_id FROM moves WHERE parent = ? and book_id =?
                "#
            )
                .bind(parent).bind(book_id)
        },
        None => {
            sqlx::query_as(
                r#"
                SELECT id, fen, mov, parent, book_id FROM moves WHERE parent IS NULL and book_id =?
                "#
            ).bind(book_id)
        },
    };

    query.fetch_all(pool).await
}