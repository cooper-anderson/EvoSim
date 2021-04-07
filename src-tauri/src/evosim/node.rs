use std::sync::{Arc, RwLock};

use super::{edge::EdgeState, physics, vector::Vector};

#[derive(Clone, Copy)]
pub struct Node {
	pub id: usize,
	pub radius: f64,
	pub mass: f64,
	pub friction: f64,
	pub position: Vector,
}

pub struct NodeState {
	pub node: Node,
	pub position: Vector,
	pub velocity: Vector,
	pub edges: Vec<Arc<RwLock<EdgeState>>>,
	pub grounded: bool
}

impl Node {
	pub fn new(
		id: usize,
		radius: f64,
		friction: f64,
		position: Vector
	) -> Self {
		Node {
			id,
			radius,
			mass: 3.14159 * radius.powi(2),
			friction,
			position
		}
	}
}

impl NodeState {
	pub fn new(node: Node) -> Self {
		NodeState {
			node,
			position: node.position.clone(),
			velocity: Vector::blank(),
			edges: Vec::new(),
			grounded: false
		}
	}

	pub fn acceleration(&mut self) -> Vector {
		let mut force = physics::GRAVITY.clone();
		for edge in &self.edges {
			force += edge.read().unwrap().get_force(self.node.id);
		}

		if self.grounded {
			let friction = self.node.friction * force.y.abs();
			force.x -= friction * self.velocity.x.signum();
		}

		force / self.node.mass
	}

	pub fn tick(&mut self, dt: f64) {
		let acceleration = self.acceleration();
		self.velocity += acceleration * dt;
		self.position += self.velocity * dt;

		self.grounded = self.position.y < self.node.radius + 0.02;
		if self.position.y < self.node.radius {
			self.position.y = self.node.radius;
			self.velocity.y = self.velocity.y.max(0.0);
		}
		self.velocity *= 0.97;
	}
}
