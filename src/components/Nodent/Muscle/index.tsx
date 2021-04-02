import { Graphics as Custom } from '@inlet/react-pixi';
import { Graphics } from "@pixi/graphics";
import React from "react";

import Edge from "../../../evosim/edge";

type MuscleProps = {
	key: string;
	edge: Edge;
}

export default class Muscle extends React.Component<MuscleProps, {}> {
	draw(g: Graphics) {
		g.clear()
		g.lineStyle(0.75, 0x9e9e9e, 0.75);
		let a = this.props.edge.nodes.a.state!;
		let b = this.props.edge.nodes.b.state!;
		g.moveTo(a.position.x, -a.position.y);
		g.lineTo(b.position.x, -b.position.y);
		g.endFill()
	}

	render() {
		return <Custom draw={this.draw.bind(this)} />
	}

	static create(edge: Edge): JSX.Element {
		return <Muscle key={edge.id.toString()} edge={edge} />
	}
}
