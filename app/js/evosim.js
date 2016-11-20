/**
 * Created by Cooper Anderson on 11/8/16 AD.
 */

const {Vector2} = require("./js/Vectors");
const seedRandom = require("seedrandom");
const sigma = require("sigma");

var simulator = {
	seed: 0,//3438,
	objective: "moveRight",
	mutability: .1,
	creature: {
		count: 1000,
		node: {scale: 15, minimum: 3, maximum: 6},
		muscle: {scale: 10, minimum: 3, maximum: 12}
	},
	cosmetic: {
		//drawGrid: true,
		drawScoreLine: true
	},
	creatures: [],
	physics: {
		gravity: new Vector2(0, -9.81),
		useGravity: true,
		useGround: true,
		friction: 1,
		frictionAir: .95
	},
	time: 15,
	frameRate: 60
};

function hslToRgb(h, s, l){
	var r, g, b;

	if(s == 0){
		r = g = b = l;
	}else{
		var hue2rgb = function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		};

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(rgb) {
	var hex = "";
	for (var i = 0; i < rgb.length; i++) {
		var current = rgb[i].toString(16);
		hex += (current.length > 1) ? current : "0" + current;
	}
	return hex;
}

function hslToHex(h, s, l) {
	return rgbToHex(hslToRgb(h, s, l));
}

/**
 * The Node class
 */
class Node {
	/**
	 * Create a Node
	 * @param {Vector2} position
	 * @param {number} friction
	 * @param {number} mass
	 * @param {number} id
	 * @constructor
	 */
	constructor(position=new Vector2(), friction=.5, mass=1, id) {
		this.position = position;
		this.velocity = new Vector2();
		this.mass = mass;
		this.friction = friction;
		this.id = id;
	}
	/**
	 * Update the node with all forces
	 */
	Update() {
		this.ApplyForces();
		if (simulator.physics.useGravity) {
			this.ApplyGravity();
		}
		if (simulator.physics.useGround) {
			this.CollideWithGround();
		}
	}

	/**
	 * Update the node with all muscle forces
	 */
	ApplyForces() {
		this.velocity = Vector2.Mult(this.velocity, simulator.physics.frictionAir);
		this.position = Vector2.Add(this.position, Vector2.Div(this.velocity, simulator.frameRate));
	}
	/**
	 * Update the node with all gravitational forces
	 */
	ApplyGravity() {
		this.velocity = Vector2.Add(this.velocity, Vector2.Div(simulator.physics.gravity, simulator.frameRate));
	}
	CollideWithGround() {
		if (this.position.y < 0) {
			this.position.y = 0;
			this.velocity.y = 0;
			this.velocity.x *= this.friction * simulator.physics.friction;
		}
	}
}

/**
 * The Muscle class
 */
class Muscle {
	/**
	 * Create a muscle
	 * @param {[Node, Node]} nodes
	 * @param {{natural, major, minor}} length
	 * @param {{major, minor}} period
	 * @param number rigidity
	 * @constructor
	 */
	constructor(nodes=[], length={natural: 0, minor: 0, major: 0}, period={current: "", minor: 0, major: 0}, rigidity=0) {
		this.nodes  = nodes;
		this.length = length;
		this.period = period;
		this.rigidity = rigidity;
		this.target = this.length.natural;
		this.frame = 0;
	}
	CheckActuation() {
		if (this.frame > this.period.major && this.period.current == "major") {
			this.period.current = "minor";
			this.target = this.length.minor;
			this.frame = 0;
		}
		if (this.frame > this.period.minor && this.period.current == "minor") {
			this.period.current = "major";
			this.target = this.length.major;
			this.frame = 0;
		}
	}
	/**
	 * Update all forces on the muscle
	 */
	Update() {
		this.CheckActuation();
		this.ApplyForces();
		this.frame++;
	}
	/**
	 * Update forces on the muscle
	 */
	ApplyForces() {
		var distance = Vector2.Distance(this.nodes[0].position, this.nodes[1].position);
		var x = (distance - this.target);
		var angle = Math.atan2(this.nodes[1].position.y - this.nodes[0].position.y, this.nodes[1].position.x - this.nodes[0].position.x);
		var force = (this.rigidity * x * (1)) / (this.nodes[0].mass + this.nodes[1].mass);
		this.nodes[0].velocity.x += force * Math.cos(angle);
		this.nodes[0].velocity.y += force * Math.sin(angle);
		this.nodes[1].velocity.x -= force * Math.cos(angle);
		this.nodes[1].velocity.y -= force * Math.sin(angle);
	}
}

class Creature {
	constructor(parent=undefined) {
		if (parent == undefined) {
			this.nodes = [];
			this.muscles = [];
			this.scores = {
				maxDistance: {
					mass: new Vector2(),
					minor: new Vector2(),
					major: new Vector2()
				},
				minDistance: {
					mass: new Vector2(),
					minor: new Vector2(),
					major: new Vector2()
				},
				grounded: false,
				time: 0
			}
			this.frame = 0;
			for (var node = 0; node < Math.floor(Math.random() * (simulator.creature.node.maximum - simulator.creature.node.minimum)) + simulator.creature.node.minimum; node++) {
				this.nodes.push(new Node(new Vector2(Math.random(), Math.random()), Math.random(), Math.floor(Math.random() * 0) + 1, node));
			}
			/*while ((function() {
				var nodes = [];
				for (var muscle = 0; muscle < this.muscle.length; node++) {

				}
			})()) {

			}*/
			for (var muscle = 0; muscle < this.nodes.length; muscle++) {
				var length = (Math.random() * 3)+.5;
				this.muscles.push(new Muscle(
					[
						this.nodes[muscle],
						this.nodes[(muscle+1) % this.nodes.length]
					],
					{
						natural: length,
						major: length * 1.5,
						minor: length / 1.5
					},
					{
						major: Math.floor(Math.random() * 25) + 50,
						minor: Math.floor(Math.random() * 25) + 50
					},
					Math.random())
				);
			}
			for (var muscle = 0; muscle < (this.nodes.length*(this.nodes.length-1)/2) - this.muscles.length; muscle++) {
				var node1 = Math.floor(Math.random()*this.nodes.length);
				var node2 = Math.floor(Math.random()*this.nodes.length);
				while (node1 == node2) {
					node1 = Math.floor(Math.random()*this.nodes.length);
					node2 = Math.floor(Math.random()*this.nodes.length);
				}
				//this.muscles.push(new Muscle([this.nodes[node1], this.nodes[node2]], {length: 1, minor: .5, major: 1.5}, {}, Math.random()));
			}
			this.Normalize();
		} else {

		}
	}
	Normalize() {
		for (var frame=0; frame < 2 * simulator.frameRate; frame++) {
			for (var m in this.muscles) {
				this.muscles[m].ApplyForces();
			}
			for (var n in this.nodes) {
				this.nodes[n].ApplyForces();
			}
		}
		for (var n in this.nodes) {
			this.nodes[n].velocity = new Vector2();
		}
		var chance = Math.round(Math.random());
		for (var m in this.muscles) {
			this.muscles[m].period.current = ["major", "minor"][chance];
		}
	}
	SetScores() {
		var centerOfMass = this.GetCenterOfMass(), maxPosition = this.GetMaxPosition(), minPosition = this.GetMinPosition();
		if (this.IsGrounded() && !this.scores.grounded) {
			this.scores.time = this.frame;
			this.scores.grounded = true;
		}
		if (centerOfMass.x > this.scores.maxDistance.mass.x) {
			this.scores.maxDistance.mass.x = centerOfMass.x;
		}
		if (centerOfMass.y > this.scores.maxDistance.mass.y) {
			this.scores.maxDistance.mass.y = centerOfMass.y;
		}
		if (minPosition.x > this.scores.maxDistance.minor.x) {
			this.scores.maxDistance.minor.x = minPosition.x;
		}
		if (minPosition.y > this.scores.maxDistance.minor.y) {
			this.scores.maxDistance.minor.y = minPosition.y;
		}
		if (maxPosition.x > this.scores.maxDistance.major.x) {
			this.scores.maxDistance.major.x = maxPosition.x;
		}
		if (maxPosition.y > this.scores.maxDistance.major.y) {
			this.scores.maxDistance.major.y = maxPosition.y;
		}
		if (centerOfMass.x < this.scores.minDistance.mass.x) {
			this.scores.minDistance.mass.x = centerOfMass.x;
		}
		if (centerOfMass.y < this.scores.minDistance.mass.y) {
			this.scores.minDistance.mass.y = centerOfMass.y;
		}
		if (minPosition.x < this.scores.minDistance.minor.x) {
			this.scores.minDistance.minor.x = minPosition.x;
		}
		if (minPosition.y < this.scores.minDistance.minor.y) {
			this.scores.minDistance.minor.y = minPosition.y;
		}
		if (maxPosition.x < this.scores.minDistance.major.x) {
			this.scores.minDistance.major.x = maxPosition.x;
		}
		if (maxPosition.y < this.scores.minDistance.major.y) {
			this.scores.minDistance.major.y = maxPosition.y;
		}
	}
	Update() {
		for (var m in this.muscles) {
			this.muscles[m].Update();
		}
		for (var n in this.nodes) {
			this.nodes[n].Update();
		}
		this.SetScores();
		this.frame++;
	}
	GetMass() {
		var mass = 0;
		for (var node in this.nodes) {
			mass += this.nodes[node].mass;
		}
		return mass;
	}
	GetCenterOfMass() {
		var position = new Vector2();
		this.nodes.forEach(function(item, index) {
			position = Vector2.Add(position, Vector2.Mult(item.position, item.mass));
		});
		return Vector2.Div(position, this.GetMass());
	}
	IsGrounded() {
		var nodes = []
		for (var node in this.nodes) {
			nodes[node] = (this.nodes[node].position.y > -.01 && this.nodes[node].position.y < .01) ? true : false;
		}
		return !nodes.includes(false);
	}
	GetMaxPosition() {
		var position = this.GetCenterOfMass();
		for (var node in this.nodes) {
			if (this.nodes[node].position.x > position.x) {
				position.x = this.nodes[node].position.x;
			}
			if (this.nodes[node].position.y > position.y) {
				position.y = this.nodes[node].position.y;
			}
		}
		return position;
	}
	GetMinPosition() {
		var position = this.GetCenterOfMass();
		for (var node in this.nodes) {
			if (this.nodes[node].position.x < position.x) {
				position.x = this.nodes[node].position.x;
			}
			if (this.nodes[node].position.y < position.y) {
				position.y = this.nodes[node].position.y;
			}
		}
		return position;
	}
	DrawGrid(canvas) {
		var pos = this.GetCenterOfMass();
		var lines = new Vector2(Math.ceil(canvas.renderers[0].height * canvas.camera.ratio), Math.ceil(canvas.renderers[0].width * canvas.camera.ratio));
		var size = 20;
		var offset = new Vector2(-15, -15);
		for (var x = Math.floor(pos.y - lines.x/2); x < Math.ceil(pos.y + lines.x/2); x++) {
			canvas.graph.addNode({
				id: `x${x}-0`,
				x: (pos.x + (lines.x / 2) - offset.x),
				y: -x,
				size: size,
				color: "#2a2a2b"
			});
			canvas.graph.addNode({
				id: `x${x}-1`,
				x: (pos.x - (lines.x / 2) + offset.x),
				y: -x,
				size: size,
				color: "#2a2a2b"
			});
			canvas.graph.addEdge({
				id: `x${x}`,
				source: `x${x}-0`,
				target: `x${x}-1`,
				color: (x != 0) ? ((x % 4) ? "#424242" : "#000000") : "#43A047"
			});
		}
		for (var y = Math.ceil(pos.x - lines.y/2); y < Math.ceil(pos.x + lines.y/2) + 1; y++) {
			canvas.graph.addNode({
				id: `y${y}-0`,
				x: y,
				y: -(pos.y + (lines.y / 2) - offset.y),
				size: size,
				color: "#2a2a2b"
			});
			canvas.graph.addNode({
				id: `y${y}-1`,
				x: y,
				y: -(pos.y - (lines.y / 2) + offset.y),
				size: size,
				color: "#2a2a2b"
			});
			canvas.graph.addEdge({
				id: `y${y}`,
				source: `y${y}-0`,
				target: `y${y}-1`,
				color: (y != 0) ? ((y % 4) ? "#424242" : "#000000") : "#43A047"
			});
		}
	}
	Draw(canvas, drawGrid=true) {
		canvas.graph.clear();
		var position = this.GetCenterOfMass();
		var lines = new Vector2(Math.ceil(canvas.renderers[0].height * canvas.camera.ratio), Math.ceil(canvas.renderers[0].width * canvas.camera.ratio));
		var offset = new Vector2(-15, -15);
		var size = 20;
		canvas.camera.goTo({x: position.x, y: -position.y, angle: 0, ratio: (canvas.camera.ratio > .1) ? 0.04 : canvas.camera.ratio});
		canvas.graph.addNode({
			id: "n01",
			x: position.x, y: -position.y,
			size: .1,
			color: `#${hslToHex(207/360, 89.7/100, .5)}`
		});
		[
			{name: "mass", position: this.scores.maxDistance.mass, condition: true, color: "#844336"},
			{name: "min", position: this.scores.minDistance.minor, condition: true, color: "#8F7B3B"},
			{name: "max", position: this.scores.maxDistance.major, condition: true, color: "#213683"}
		].forEach(function(item, index) {
			if (item.condition) {
				canvas.graph.addNode({
					id: `xScore-${item.name}-0`,
					x: item.position.x,
					y: -(position.y + (lines.y / 2) - offset.y),
					size: size,
					color: "#2a2a2b"
				});
				canvas.graph.addNode({
					id: `xScore-${item.name}-1`,
					x: item.position.x,
					y: -(position.y - (lines.y / 2) + offset.y),
					size: size,
					color: "#2a2a2b"
				});
				canvas.graph.addEdge({
					id: `xScore-${item.name}-`,
					source: `xScore-${item.name}-0`,
					target: `xScore-${item.name}-1`,
					color: item.color
				});
				canvas.graph.addNode({
					id: `yScore-${item.name}-0`,
					x: (position.x + (lines.x / 2) - offset.x),
					y: -item.position.y,
					size: size,
					color: "#2a2a2b"
				});
				canvas.graph.addNode({
					id: `yScore-${item.name}-1`,
					x: (position.x - (lines.x / 2) + offset.x),
					y: -item.position.y,
					size: size,
					color: "#2a2a2b"
				});
				canvas.graph.addEdge({
					id: `yScore-${item.name}-`,
					source: `yScore-${item.name}-0`,
					target: `yScore-${item.name}-1`,
					color: item.color
				});
			}
		});
		if (drawGrid) {
			this.DrawGrid(canvas);
		}
		this.nodes.forEach(function(item, index) {
			canvas.graph.addNode({
				id: `n${index}`,
				//label: `L${index}`,
				x: item.position.x, y: -item.position.y,
				size: item.mass,
				color: `#${hslToHex(207/360, 89.7/100, item.friction)}`,
				borderSize: 10
			});
		});
		for (var m in this.muscles) {
			canvas.graph.addEdge({
				id: `e${m}`,
				source: `n${this.nodes.indexOf(this.muscles[m].nodes[0])}`,
				target: `n${this.nodes.indexOf(this.muscles[m].nodes[1])}`,
				color: "#9E9E9E",
				hover_color: '#000'
			})
		}
		//canvas.graph.addNode({id: "n5", label: "test", x: .5, y: .5, color: "#f00"});
		canvas.refresh();
	}
}

Math.oldRandom = Math.random;
if (simulator.seed == 0) {
	simulator.seed = Math.floor(Math.random() * 10000);
}
seedRandom(simulator.seed, {global: true});

/*ori.arc("center", "center", 20, {
	background: '#' + hslToHex(207/360, 89.7/100, .5)
})
ori.draw();*/

//module.exports = {Node, Muscle};