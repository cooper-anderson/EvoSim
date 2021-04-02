import { Container, Graphics as Custom, Stage } from '@inlet/react-pixi';
import { Graphics } from 'pixi.js';
import React from 'react';
import './App.css';
import Nodent from './components/Nodent';
import Vector from './evosim/vector';

class App extends React.Component<{}, {}> {
	draw(g: Graphics, bounds: Vector) {
		g.clear();
		g.beginFill(0x808080);
		g.drawRect(-bounds.x / 2, 0, bounds.x, 5);
		g.endFill();
	}

	render() {
		const bounds = new Vector(window.innerWidth, window.innerHeight);
		return <Stage width={bounds.x} height={bounds.y} options={{
			backgroundAlpha: 0,
			antialias: true,
			width: bounds.x,
			height: bounds.y,
		}}>
			<Container position={[bounds.x / 2, bounds.y * 7 / 8]}>
				<Custom draw={g => {this.draw(g, bounds)}}/>
				<Nodent />
			</Container>
		</Stage>
	}
}

export default App;
