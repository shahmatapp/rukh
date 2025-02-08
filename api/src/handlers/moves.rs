use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter};
use sea_orm::ActiveValue::Set;
use serde::Deserialize;
use serde_json::{json, Value};
use crate::handlers::types::{AppState, WsResponse};
use crate::parse_or_error;
use crate::entities::moves as mov;

#[derive(Debug, Deserialize)]
struct QueryMove{
    book_id: Option<String>,
    parent: Option<String>
}
#[derive(serde::Deserialize)]
struct MoveId {
    id: String,
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

async fn get_move(conn:DatabaseConnection, payload: Value, correlation_id:String)->WsResponse{
    let input = parse_or_error!(payload, MoveId);
    match mov::Entity::find_by_id(input.id).one(&conn).await{
        Ok(mov) =>  WsResponse::Ok { data: json!(mov), correlation_id },
        Err(_) => WsResponse::Error {
            message: String::from("Could not find move"),
        }
    }
}

async fn create_move(conn:DatabaseConnection, payload: Value, correlation_id:String) ->WsResponse{
    let input = parse_or_error!(payload, mov::InsertModel);
    let active :mov::ActiveModel = input.to_active_model();
    let new_id = active.clone().id.unwrap();
    match mov::Entity::insert(active).exec(&conn).await {
        Ok(_) => WsResponse::Ok {
            data: json!({"id": new_id}),
            correlation_id
        },
        Err(e) => {
            println!("insert error, {}", e);
            WsResponse::Error {
                message: "Couldn't create move".into(),
            }
        }
    }

}

async fn update_move(conn:DatabaseConnection, payload: Value, correlation_id:String) -> WsResponse {
    let input = parse_or_error!(payload, mov::UpdateModel);

    let Ok(Some(mov)) = mov::Entity::find_by_id(&input.id).one(&conn).await else { 
        return WsResponse::Error {
            message : "Couldnt find move to upodate".into()
        };
    };
    let mut active = mov.into_active_model();
    active.notes = Set(Some(input.notes));
    match active.update(&conn).await {
        Ok(_) => WsResponse::Ok {
            correlation_id,
            data: json!("OK"),
        },
        Err(_) => WsResponse::Error { message:"couldnt update move".into()}
    } 
   
}

pub async fn process(correlation_id:String, action: String, payload: Value, state: AppState) -> WsResponse {
    match action.as_str() {
        "list" => query(state.conn.clone(), payload,correlation_id).await,
        "create" => create_move(state.conn.clone(), payload,correlation_id).await,
        "get" => get_move(state.conn.clone(), payload, correlation_id).await,
        "update" => update_move(state.conn.clone(), payload, correlation_id).await,
        &_ => WsResponse::Error {
            message: String::from("invalid action for book"),
        },
    }
}