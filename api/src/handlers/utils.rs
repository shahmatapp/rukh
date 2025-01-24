#[macro_export]
macro_rules! parse_or_error {
    ($payload:expr, $ty:ty) => {
        match serde_json::from_value::<$ty>($payload) {
            Ok(parsed) => parsed,
            Err(_) => return WsResponse::Error {
                message: "Could not parse payload".into(),
            },
        }
    };
}