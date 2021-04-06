import Edge from "./edge";
import Node from "./node";
import Vector from "./vector";

export default class Agent {
	public nodes: Node[];
	public edges: Edge[];
	public center: Vector;

	constructor() {
		this.nodes = [];
		this.edges = [];
		this.center = new Vector();
	}

	start(): void {
		this.nodes.forEach(node => node.start());
		this.edges.forEach(edge => edge.start());
	}

	update(dt: number): void {
		this.center = new Vector();
		this.edges.forEach(edge => edge.update(dt));
		this.nodes.forEach(node => {
			node.update(dt);
			this.center.add(Vector.mult(node.state!.position, node.mass));
		});
		this.center.div(this.nodes.length);
	}
}
