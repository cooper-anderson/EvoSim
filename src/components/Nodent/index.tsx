import { Container } from "@inlet/react-pixi";
import React from "react";

import Agent from "../../evosim/agent";
import Edge from "../../evosim/edge";
import Node from "../../evosim/node";
import Vector from '../../evosim/vector';

import Joint from './Joint';
import Muscle from './Muscle';

let nodeA = new Node(1, 0.5, new Vector(-6.5, 10));
let nodeB = new Node(1, 0.5, new Vector(6.5, 10));
let nodeC = new Node(2, 0.75, new Vector(0, 20));

let edgeA = new Edge(nodeA, nodeC);
let edgeB = new Edge(nodeA, nodeB);
let edgeC = new Edge(nodeB, nodeC);

window.addEventListener("keydown", e => {
	if (e.key === "q") edgeA.state!.mode = 2;
	if (e.key === "w") edgeB.state!.mode = 2;
	if (e.key === "e") edgeC.state!.mode = 2;

	if (e.key === "a") edgeA.state!.mode = 1;
	if (e.key === "s") edgeB.state!.mode = 1;
	if (e.key === "d") edgeC.state!.mode = 1;

	if (e.key === "z") {
		edgeA.state!.mode = 2;
		edgeB.state!.mode = 1;
		edgeC.state!.mode = 1;
	} else if (e.key === "x") {
		edgeA.state!.mode = 1;
		edgeB.state!.mode = 2;
		edgeC.state!.mode = 1;
	} else if (e.key === "c") {
		edgeA.state!.mode = 1;
		edgeB.state!.mode = 1;
		edgeC.state!.mode = 2;
	}
});
window.addEventListener("keyup", e => {
	if (e.key === "q") edgeA.state!.mode = 0;
	if (e.key === "w") edgeB.state!.mode = 0;
	if (e.key === "e") edgeC.state!.mode = 0;
	if (e.key === "a") edgeA.state!.mode = 0;
	if (e.key === "s") edgeB.state!.mode = 0;
	if (e.key === "d") edgeC.state!.mode = 0;
});

export default class Nodent extends React.Component<{}, {}> {
	agent: Agent;

	constructor(props: {}) {
		super(props);
		this.agent = new Agent();
		this.agent.nodes.push(nodeA, nodeB, nodeC);
		this.agent.edges.push(edgeA, edgeB, edgeC);
		this.agent.start();

		setInterval(() => {
			this.agent.update(1 / 60)
			this.forceUpdate();
		}, 1000.0 / 60.0);
	}

	render() {
		return <Container
			scale={[10, 10]}
		>
			{this.agent.edges.map(Muscle.create)}
			{this.agent.nodes.map(Joint.create)}
		</Container>
	}
}
