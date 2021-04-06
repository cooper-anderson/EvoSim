#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
	TransferVectors { callback: String, error: String },
}
