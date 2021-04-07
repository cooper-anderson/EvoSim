use std::sync::{Arc, RwLock};

use super::{node::*, vector::Vector};

#[allow(dead_code)]
pub enum EdgeMode {
	RELAXED,
	CONSTRICT,
	EXTEND
}

#[derive(Clone, Copy)]
pub struct Edge {
	pub id: usize,
	pub nodes: (Node, Node),
	pub lengths: (f64, f64),
	pub rigitidy: f64
}

pub struct EdgeState {
	pub edge: Edge,
	pub nodes: (Arc<RwLock<NodeState>>, Arc<RwLock<NodeState>>),
	pub ids: (usize, usize),
	pub mode: EdgeMode,
	pub force: Vector
}

impl Edge {
	pub fn new(id: usize, a: Node, b: Node) -> Self {
		let edge = Edge {
			id,
			nodes: (a, b),
			lengths: (10.0, 20.0),
			rigitidy: 600.0
		};
		edge
	}
}

impl EdgeState {
	pub fn new(
		edge: Edge,
		a: Arc<RwLock<NodeState>>,
		b: Arc<RwLock<NodeState>>,
		ids: (usize, usize)
	) -> Self {
		EdgeState {
			edge,
			nodes: (a, b),
			ids,
			mode: EdgeMode::RELAXED,
			force: Vector::blank()
		}
	}

	pub fn tick(&mut self, _dt: f64) {
		let a = self.nodes.0.read().unwrap();
		let b = self.nodes.1.read().unwrap();

		let target = match self.mode {
			EdgeMode::RELAXED => self.edge.lengths.0,
			EdgeMode::CONSTRICT => self.edge.lengths.1,
			EdgeMode::EXTEND => (self.edge.lengths.0 + self.edge.lengths.1) / 2.0
		};
		let length = Vector::dist(a.position, b.position);
		let distance = target - length;

		let direction = b.position - a.position;
		self.force = direction.normalized() * (-self.edge.rigitidy * distance);
	}

	pub fn get_force(&self, id: usize) -> Vector {
		if id == self.ids.0 { self.force }
		else { -self.force }
	}
}
