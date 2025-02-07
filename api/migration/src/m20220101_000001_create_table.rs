use sea_orm_migration::{prelude::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        db.execute_unprepared(
                r#"
                CREATE TABLE IF NOT EXISTS books (
                        id varchar PRIMARY KEY,
                        name varchar NOT NULL,
                        description TEXT,
                        perspective varchar(1) NOT NULL
                    );
                 CREATE TABLE IF NOT EXISTS moves (
                    id varchar PRIMARY KEY,
                    book_id varchar,
                    fen varchar NOT NULL,
                    is_me boolean NOT NULL,
                    parent varchar,
                    mov TEXT Not null,
                    notes Text
                );
                "#,
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        db
            .execute_unprepared(
                r#"
                DROP TABLE IF EXISTS books;
                DROP TABLE IF EXISTS moves;
                "#,
            )
            .await?;
        Ok(())
    }
}


