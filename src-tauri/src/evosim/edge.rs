use super::node::Node;

pub struct Edge {
	id: String,
	nodes: (Node, Node),
	lengths: (f64, f64),
	rigitidy: f64
}
