import Node from "./node";
import Vector from "./vector";

enum EdgeMode { RELAXED, CONSTRICT, EXTEND }
type EdgeState = {
	length: number;
	mode: EdgeMode;
	force: Vector;
}

export default class Edge {
	public id: Symbol;
	public nodes: {a: Node, b: Node};
	public lengths: { minor: number, major: number };
	public rigidity: number;

	public state?: EdgeState;

	constructor(a: Node, b: Node) {
		this.id = Symbol("Edge");
		this.nodes = {a: a, b: b};
		this.lengths = {minor: 0, major: 0};
		this.rigidity = 0;
	}

	getForce(id: Symbol): Vector {
		if (!this.state) throw Error();

		if (id == this.nodes.a.id) return this.state.force;
		return this.state.force.negated;
	}

	update(_dt: number): void {
		const state = this.state;
		if (!state) throw Error();

		let target;
		if (state.mode == EdgeMode.CONSTRICT) target = this.lengths.minor;
		else if (state.mode == EdgeMode.EXTEND) target = this.lengths.major;
		else target = (this.lengths.major - this.lengths.minor) / 2;
		let distance = target - state.length;

		let direction = Vector.sub(this.nodes.b.position, this.nodes.a.position);
		state.force = direction.normalized.mult(this.rigidity * distance);
	}
}
