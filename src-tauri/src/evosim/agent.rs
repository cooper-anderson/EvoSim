use super::{edge::Edge, node::Node, vector::Vector};

pub struct Agent {
	nodes: Vec<Node>,
	edges: Vec<Edge>,
	center: Vector
}
