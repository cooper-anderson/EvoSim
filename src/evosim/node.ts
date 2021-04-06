import Edge from "./edge";
import Physics from "./physics";
import Vector from "./vector";
import {v4 as uuid} from "uuid";

type NodeState = {
	position: Vector;
	velocity: Vector;
	grounded: boolean;
}

export default class Node {
	public id: string;
	public radius: number;
	public mass: number;
	public friction: number;
	public position: Vector;
	public edges: Set<Edge>;

	public state?: NodeState;

	constructor(radius: number, friction: number, position: Vector) {
		this.id = uuid();
		this.radius = radius;
		this.mass = Math.PI * Math.pow(this.radius, 2);
		this.friction = friction;
		this.position = position;
		this.edges = new Set();
	}

	get acceleration(): Vector {
		const state = this.state;
		if (!state) throw Error();

		let force = Physics.gravity;
		this.edges.forEach(edge => force.add(edge.getForce(this.id)));

		if (state.grounded) {
			const friction = this.friction * Math.abs(force.y);
			force.x -= friction * Math.sign(state.velocity.x);
		}

		return force.div(this.mass);
	}

	start() {
		this.state = {
			position: this.position.clone(),
			velocity: new Vector(),
			grounded: false
		};
	}

	update(dt: number): void {
		let state = this.state;
		if (!state) throw Error();

		let acceleration = this.acceleration;
		state.velocity.add(acceleration.over(dt));
		state.position.add(state.velocity.over(dt));

		state.grounded = state.position.y < this.radius + 0.02;
		if (state.position.y < this.radius) {
			state.position.y = this.radius;
			state.velocity.y = Math.max(0, state.velocity.y);
		}
		state.velocity.mult(0.97);
	}
}
