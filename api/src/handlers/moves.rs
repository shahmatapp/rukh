use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use sea_orm::ActiveValue::Set;
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;
use crate::handlers::types::{AppState, WsResponse};
use crate::parse_or_error;
use crate::entities::moves as mov;

#[derive(Debug, Deserialize)]
struct QueryMove{
    book_id: Option<String>,
    parent: Option<String>
}
async fn query(conn: DatabaseConnection, payload: Value, correlation_id:String) -> WsResponse {
    let input = parse_or_error!(payload, QueryMove);
    let mut query = mov::Entity::find();

    if let Some(book_id) = input.book_id {
        query = query.filter(mov::Column::BookId.eq(book_id));
    }

    // If parent is Some, filter equals that value;
    // if None, filter WHERE parent IS NULL
    match input.parent {
        Some(parent_val) => {
            query = query.filter(mov::Column::Parent.eq(parent_val));
        }
        None => {
            query = query.filter(mov::Column::Parent.is_null());
        }
    }

    match  query.all(&conn).await {
        Ok(book_vec) => WsResponse::Ok {
            data: json!(book_vec),
            correlation_id
        },
        Err(e) => WsResponse::Error {
            message: format!("Could not list books: {e}"),
        },
    }
}

async fn create_move(conn:DatabaseConnection, payload: Value, correlation_id:String) ->WsResponse{
    let input = parse_or_error!(payload, mov::Model);
    let mut active :mov::ActiveModel = input.into();
    active.id = Set(Uuid::new_v4().to_string());


    match active.insert(&conn).await {
        Ok(_) => WsResponse::Ok {
            data: "done".into(),
            correlation_id
        },
        Err(e) => {
            println!("{}", e);
            WsResponse::Error {
                message: "Couldn't create move".into(),
            }
        }
    }

}

pub async fn process(correlation_id:String, action: String, payload: Value, state: AppState) -> WsResponse {
    match action.as_str() {
        "list" => query(state.conn.clone(), payload,correlation_id).await,
        "create" => create_move(state.conn.clone(), payload,correlation_id).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}