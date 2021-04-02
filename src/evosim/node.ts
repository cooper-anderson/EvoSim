import Edge from "./edge";
import Physics from "./physics";
import Vector from "./vector";

type NodeState = {
	position: Vector;
	velocity: Vector;
	grounded: boolean;
}

export default class Node {
	public id: Symbol;
	public radius: number;
	public mass: number;
	public friction: number;
	public position: Vector;
	public edges: Set<Edge>;

	public state?: NodeState;

	constructor() {
		this.id = Symbol("Node");
		this.radius = 0;
		this.mass = Math.PI * Math.pow(this.radius, 2);
		this.friction = 0;
		this.position = new Vector();
		this.edges = new Set();
	}

	get acceleration(): Vector {
		const state = this.state;
		if (!state) throw Error();

		let force = Physics.gravity.clone();
		this.edges.forEach(edge => force.add(edge.getForce(this.id)));

		if (state.position.y <= this.radius && state.velocity.y < 0) {
			state.velocity.y = 0;
			const friction = this.friction * Math.abs(force.y);
			force.x -= friction * Math.sign(state.velocity.x);
			force.y = 0;
		}

		return force.div(this.mass);
	}

	update(dt: number): void {
		if (!this.state) throw Error();

		let acceleration = this.acceleration;
		this.state.velocity.add(acceleration.over(dt));
		this.state.position.add(this.state.velocity.over(dt));
	}
}
