import Edge from "./edge";
import Node from "./node";
import Vector from "./vector";

export default class Nodent {
	public nodes: Set<Node>;
	public edges: Set<Edge>;
	public center: Vector;

	constructor() {
		this.nodes = new Set();
		this.edges = new Set();
		this.center = new Vector();
	}

	update(dt: number): void {
		this.center = new Vector();
		this.edges.forEach(edge => edge.update);
		this.nodes.forEach(node => {
			node.update(dt);
			this.center.add(Vector.mult(node.state!.position, node.mass));
		});
		this.center.div(this.nodes.size);
	}
}
