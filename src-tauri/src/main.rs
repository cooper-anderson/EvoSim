#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

use cmd::Cmd;
use evosim::vector::Vector;
use tauri::Webview;

mod cmd;
mod evosim;

fn main() {
	tauri::AppBuilder::new().invoke_handler(|webview, cmd| {
		match serde_json::from_str(cmd) {
			Err(e) => { Err(e.to_string()) }
			Ok(command) => handle(webview, command)
		}
	}).build().run();
}

fn handle(webview: &mut Webview, cmd: Cmd) -> Result<(), String> {
	use cmd::Cmd::*;
	let mut big_list: Vec<Vector> = Vec::new();

	for i in 0..1000 { big_list.push(Vector::new(i as f64, 1.0)); }

	match cmd {
		TransferVectors { callback, error } => {
			tauri::execute_promise(webview, || Ok(big_list), callback, error)
		}
	}
	Ok(())
}
