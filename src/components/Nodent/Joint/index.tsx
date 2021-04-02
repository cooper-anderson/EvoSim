import { Graphics as Custom } from '@inlet/react-pixi';
import { Graphics } from "@pixi/graphics";
import React from "react";

import Node from "../../../evosim/node";

type NodeProps = {
	key: string;
	node: Node;
}

type NodeState = {
	color: number;
}

function hslToHex(h: number, s: number, l: number): number {
	const a = s * Math.min(l, 1 - l) / 100;
	const f = (n: number): number => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color);
	};
	return f(0) * Math.pow(256, 2) + f(8) * 256 + f(4);
}

export default class Joint extends React.Component<NodeProps, NodeState> {
	constructor(props: NodeProps) {
		super(props);
		
		this.state = {
			color: hslToHex(207, 89.7, 1 - this.props.node.friction)
		};
	}

	draw(g: Graphics) {
		let state = this.props.node.state;
		if (!state) return;

		g.clear()
		g.beginFill(this.state.color);
		g.arc(state.position.x, -state.position.y, this.props.node.radius, 0, 360);
		g.endFill()
	}

	render() {
		return <Custom draw={this.draw.bind(this)} />
	}

	static create(node: Node): JSX.Element {
		return <Joint key={node.id.toString()} node={node} />
	}
}
