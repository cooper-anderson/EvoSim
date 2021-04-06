use super::{edge::Edge, vector::Vector};

pub struct Node {
	id: String,
	radius: f64,
	mass: f64,
	friction: f64,
	position: Vector,
	edges: Vec<Edge>
}
