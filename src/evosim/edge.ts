import Node from "./node";
import Vector from "./vector";
import {v4 as uuid} from "uuid";

enum EdgeMode { RELAXED, CONSTRICT, EXTEND }
type EdgeState = {
	mode: EdgeMode;
	force: Vector;
}

export default class Edge {
	public id: string;
	public nodes: {a: Node, b: Node};
	public lengths: { minor: number, major: number };
	public rigidity: number;

	public state?: EdgeState;

	constructor(a: Node, b: Node) {
		this.id = uuid();
		this.nodes = {a: a, b: b};
		this.nodes.a.edges.add(this);
		this.nodes.b.edges.add(this);
		this.lengths = {minor: 10, major: 20};
		this.rigidity = 600;
	}

	getForce(id: string): Vector {
		if (!this.state) throw Error();

		if (id === this.nodes.a.id) return this.state.force;
		return this.state.force.negated;
	}

	start() {
		this.state = {
			mode: EdgeMode.RELAXED,
			force: new Vector()
		};
	}

	update(_dt: number): void {
		const state = this.state;
		if (!state) throw Error();

		let target;
		if (state.mode === EdgeMode.CONSTRICT) target = this.lengths.minor;
		else if (state.mode === EdgeMode.EXTEND) target = this.lengths.major;
		else target = (this.lengths.major + this.lengths.minor) / 2;
		let length = Vector.dist(this.nodes.a.state!.position, this.nodes.b.state!.position);
		let distance = target - length;

		let direction = Vector.sub(this.nodes.b.state!.position, this.nodes.a.state!.position);
		state.force = direction.normalized.mult(-this.rigidity * distance);
	}
}
