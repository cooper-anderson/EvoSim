use std::sync::{Arc, RwLock};

use super::{edge::*, node::*, vector::Vector};

pub struct Agent {
	pub nodes: Vec<Node>,
	pub edges: Vec<Edge>
}

pub struct AgentState {
	nodes: Vec<Arc<RwLock<NodeState>>>,
	edges: Vec<Arc<RwLock<EdgeState>>>,
	pub center: Vector
}

impl Agent {
	pub fn new(nodes: Vec<Node>, edges: Vec<Edge>) -> Self {
		Agent { nodes, edges }
	}

	pub fn start(self) -> AgentState {
		AgentState::new(self)
	}
}

impl AgentState {
	fn new(agent: Agent) -> Self {
		let mut nodes: Vec<Arc<RwLock<NodeState>>> = Vec::new();
		let mut edges: Vec<Arc<RwLock<EdgeState>>> = Vec::new();

		agent.nodes.iter().for_each(|n| {
			nodes.push(Arc::new(RwLock::new(NodeState::new(*n))));
		});

		for e in &agent.edges {
			let a = nodes.get(e.nodes.0.id).unwrap();
			let b = nodes.get(e.nodes.1.id).unwrap();
			let edge = Arc::new(RwLock::new(EdgeState::new(
				*e, a.clone(), b.clone(), (e.nodes.0.id, e.nodes.1.id)
			)));
			a.write().unwrap().edges.push(edge.clone());
			b.write().unwrap().edges.push(edge.clone());
			edges.push(edge);
		}

		AgentState { nodes, edges, center: Vector::blank() }
	}

	pub fn update(&mut self, dt: f64) {
		let mut center = Vector::blank();

		self.edges.iter().for_each(|edge| {
			let mut e = edge.write().unwrap();
			e.tick(dt);
		});
		self.nodes.iter().for_each(|node| {
			let mut n = node.write().unwrap();
			n.tick(dt);
			center += n.position * n.node.mass;
		});

		self.center = center / (self.nodes.len() as f64);
	}
}
