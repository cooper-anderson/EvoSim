/**
 * Created by Cooper Anderson on 11/8/16 AD.
 */

const {Vector2} = require("./js/Vectors");
const seedRandom = require("seedrandom");
const sigma = require("sigma");
const clone = require("clone");

var simulator = {
	seed: 2757,//3438,
	objective: function(creature) {
		//var size = Vector2.Sub(creature.scores.maxDistance.major, creature.scores.minDistance.minor);
		if (creature.scores.maxDistance.mass.x > Math.abs(creature.scores.minDistance.mass.x)) {
			return creature.scores.maxDistance.mass.x;
		} else {
			return creature.scores.minDistance.mass.x;
		}
		//return size.x * size.y;
		//return creature.scores.maxDistance.mass.x;
	},
	mutability: .05,
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
	generations: [],
	generation: [],
	physics: {
		gravity: new Vector2(0, -9.81),
		useGravity: true,
		useGround: true,
		friction: 1,
		frictionAir: .95
	},
	time: 15,
	frameRate: 60,
	species : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
};

class Color {
	constructor(a=0, b=0, c=0, mode="rgb") {
		if (mode == "rgb") {
			this.r = a;
			this.g = b;
			this.b = c;
		} else if (mode == "hsl") {
			this.h = a;
			this.s = b;
			this.l = c;
		}
	}
	toHex() {
		if (this.mode == "rgb") {
			var hex = "";
			for (var i = 0; i < this.length; i++) {
				var current = this[i].toString(16);
				hex += (current.length > 1) ? current : "0" + current;
			}
			return hex;
		} else {

		}
	}
}

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

/**
 * The Creature class
 * @classdesc This is the data-type that will be the main use of the simulator
 */
class Creature {
    /**
	 * Create a creature
     * @param {Creature} parent
	 * @constructor
     */
	constructor(parent=undefined) {
		if (parent == undefined) {
			this.id = simulator.creatures.push(this)-1;
			this.ancestor = this.id;
			this.nodes = [];
			this.muscles = [];
			this.muscleAction = Math.round(Math.random());
			this.data = {centerOfMass: new Vector2(), maxPosition: new Vector2(), minPosition: new Vector2(), mass: 0, grounded: false, flatGrounded: false};
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
				flatGrounded: false,
				time: 0
			};
			this.frame = 0;
			for (var node = 0; node < Math.floor(Math.random() * (simulator.creature.node.maximum - simulator.creature.node.minimum)) + simulator.creature.node.minimum; node++) {
				this.nodes.push(new Node(new Vector2(Math.random(), Math.random()), Math.random(), Math.floor(Math.random() * 0) + 1, node));
			}
			var maxMuscleLength = 0;
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
				maxMuscleLength += length * 1.5 / 2;
			}
			this.maxMuscleLength = maxMuscleLength;
			for (var muscle = 0; muscle < (this.nodes.length*(this.nodes.length-1)/2) - this.muscles.length; muscle++) {
				var node1 = Math.floor(Math.random()*this.nodes.length);
				var node2 = Math.floor(Math.random()*this.nodes.length);
				while (node1 == node2) {
					node1 = Math.floor(Math.random()*this.nodes.length);
					node2 = Math.floor(Math.random()*this.nodes.length);
				}
				//this.muscles.push(new Muscle([this.nodes[node1], this.nodes[node2]], {length: 1, minor: .5, major: 1.5}, {}, Math.random()));
			}
			this.species = simulator.species[this.nodes.length - 1] + this.muscles.length;
			this._this = clone(this);
			this.Normalize();
			this.RunSimulation();
			for (var key in this._this) {
				if (key != "scores" && key != "_this") {
					this[key] = this._this[key];
				}
			}
			delete this._this;
		} else {

		}
	}

    /**
	 * Normalize the creature so that it is it's natural position
     */
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
		for (var m in this.muscles) {
			this.muscles[m].period.current = ["major", "minor"][this.muscleAction];
		}
	}

	/**
	 * Sets the scores of the creature. Runs each frame
	 */
	SetScores() {
		var centerOfMass = this.data.centerOfMass, maxPosition = this.data.maxPosition, minPosition = this.data.minPosition;
		if (this.data.flatGrounded && !this.scores.flatGrounded) {
			this.scores.time = this.frame;
			this.scores.flatGrounded = true;
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

	/**
	 * Reset the scores of the creature to the defaults
	 */
	ResetScores() {
		this.data = {centerOfMass: new Vector2(), maxPosition: new Vector2(), minPosition: new Vector2(), mass: 0, grounded: false, flatGrounded: false};
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
			flatGrounded: false,
			time: 0
		}
	}

	/**
	 * The creature's update function. Updates all of the nodes and muscles and sets data and scores
	 */
	Update() {
		for (var m in this.muscles) {
			this.muscles[m].Update();
		}
		for (var n in this.nodes) {
			this.nodes[n].Update();
		}
		this.SetData();
		this.SetScores();
		this.frame++;
	}

	/**
	 * Returns the mass of the creature
	 * @returns {number} The mass of the creature
	 */
	GetMass() {
		return this.data.mass;
	}

	/**
	 * Returns the center of mass
	 * @returns {Vector2} The center of mass
	 */
	GetCenterOfMass() {
		return this.data.centerOfMass;
	}

	/**
	 * Returns the furthest point in the positive direction's position
	 * @returns {Vector2} The maximum position
	 */
	GetMaxPosition() {
		return this.data.maxPosition;
	}

	/**
	 * Returns the furthest point in the negative direction's position
	 * @returns {Vector2} The minimum position
	 */
	GetMinPosition() {
		return this.data.minPosition;
	}

	/**
	 * Returns true if the creature has at least one node on the ground
	 * @returns {boolean} If the creature is grounded
	 */
	IsGrounded() {
		return this.data.grounded;
	}

	/**
	 * Returns true if the creature has all nodes on the ground
	 * @returns {boolean} If the creature is flat grounded
	 */
	IsFlatGrounded() {
		return this.data.flatGrounded;
	}

	/**
	 * Returns the data of the creature
	 * @returns {{centerOfMass, maxPosition, minPosition, mass: number, grounded: boolean, flatGrounded: boolean}} The data of the creature
	 */
	GetData() {
		var data = {centerOfMass: new Vector2(), maxPosition: new Vector2(), minPosition: new Vector2(), mass: 0, grounded: false, flatGrounded: false};
		var groundStatus = [];
		for (var node in this.nodes) {
			data.mass += this.nodes[node].mass;
			data.centerOfMass = Vector2.Add(data.centerOfMass, Vector2.Mult(this.nodes[node].position, this.nodes[node].mass));
			data.maxPosition = Vector2.Add(data.maxPosition, Vector2.Mult(this.nodes[node].position, this.nodes[node].mass));
			data.minPosition = Vector2.Add(data.minPosition, Vector2.Mult(this.nodes[node].position, this.nodes[node].mass));
			groundStatus[node] = (this.nodes[node].position.y > -.01 && this.nodes[node].position.y < .01) ? true : false;
		}
		data.centerOfMass = Vector2.Div(data.centerOfMass, data.mass);
		data.maxPosition = Vector2.Div(data.maxPosition, data.mass);
		data.minPosition = Vector2.Div(data.minPosition, data.mass);
		data.grounded = groundStatus.includes(true); data.flatGrounded = !groundStatus.includes(false);
		for (var node in this.nodes) {
			if (this.nodes[node].position.x > data.maxPosition.x) {
				data.maxPosition.x = this.nodes[node].position.x;
			}
			if (this.nodes[node].position.y > data.maxPosition.y) {
				data.maxPosition.y = this.nodes[node].position.y;
			}
			if (this.nodes[node].position.x < data.minPosition.x) {
				data.minPosition.x = this.nodes[node].position.x;
			}
			if (this.nodes[node].position.y < data.minPosition.y) {
				data.minPosition.y = this.nodes[node].position.y;
			}
		}
		return data;
	}

	/**
	 * Sets the data variable of the creature to the creature's real data
	 */
	SetData() {
		this.data = this.GetData();
	}

	/**
	 * Draws the grid that the creature is on top of.
	 * @param {sigma} canvas
	 */
	DrawGrid(canvas) {
		var pos = this.data.centerOfMass;
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

	/**
	 * Draws the creature onto the given sigma graph
	 * @param {sigma} canvas - The sigma object that the creature will be drawn to
	 * @param {boolean} drawGrid - Should the grid be drawn?
	 * @param {boolean} drawLines - Should the creatures data lines be drawn?
	 * @param {boolean} drawMass - Should the creatures center of mass be drawn?
	 * @param {number} zoom - the min zoom value of the grid
	 */
	Draw(canvas, drawGrid=true, drawLines=true, drawMass=true, zoom=.1) {
		canvas.graph.clear();
		var position = this.data.centerOfMass;
		var lines = new Vector2(Math.ceil(canvas.renderers[0].height * canvas.camera.ratio), Math.ceil(canvas.renderers[0].width * canvas.camera.ratio));
		var offset = new Vector2(-15, -15);
		var size = 20;
		if (zoom == .1) {
			canvas.camera.ratio = (function (self) {
				if (canvas.renderers[0].height < canvas.renderers[0].width) {
					return self.maxMuscleLength / canvas.renderers[0].height;
				} else {
					return self.maxMuscleLength / canvas.renderers[0].width;
				}
			})(this);
		}
		canvas.camera.goTo({x: position.x, y: -position.y, angle: 0, ratio: (canvas.camera.ratio > zoom) ? 0.025 : canvas.camera.ratio});
		if (drawMass) {
			canvas.graph.addNode({
				id: "n01",
				x: position.x, y: -position.y,
				size: .1,
				color: `#${hslToHex(207 / 360, 89.7 / 100, .5)}`
			});
		}
		if (drawLines) {
			[
				{name: "mass", position: this.scores.maxDistance.mass, condition: true, color: "#844336"},
				{name: "min", position: this.scores.minDistance.minor, condition: true, color: "#8F7B3B"},
				{name: "max", position: this.scores.maxDistance.major, condition: true, color: "#213683"}
			].forEach(function (item, index) {
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
		}
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
		canvas.refresh();
	}

	/**
	 * Runs the entire simulation of the creature
	 */
	RunSimulation() {
		for (var frame = 0; frame < 15 * simulator.frameRate; frame++) {
			this.Update();
			if (this.data.flatGrounded) {
				break;
			}
		}
	}

	/**
	 * Create a new creature that is the same as this current creature but might have a slight mutation
	 * @returns {Creature} The newly generated offspring
	 */
	Reproduce() {
		var offspring = clone(this);
		offspring.id = simulator.creatures.push(offspring)-1;
		//offspring.ResetScores();
		while (Math.random() < simulator.mutability) {

		}
		return offspring;
	}

	/**
	 * Get the creature's fitness level using the fitness function defined in the simulator object
	 * @returns {number} This creatures fitness
	 */
	GetFitness() {
		return simulator.objective(this);
	}
}

/**
 * The Generation Class
 * @classdesc This holds all the creatures of a specific generation
 */
class Generation {
	/**
	 * Creates a new generation
	 * @param creatures - The array of creatures that are in the generation
	 * @constructor
	 */
	constructor(creatures=[]) {
		this.generation = simulator.generations.push(this)-1;
		this.species = {};
		this.creatures = [];
		if (creatures.length > 0) {
			this.creatures = creatures;
		}
		for (var creature = 0; creature < simulator.creature.count; creature++) {
			if (creature > creatures.length-1) {
				var c = new Creature();
				this.creatures.push(c);
			}
			if (!(this.creatures[creature].species in this.species)) {
				this.species[this.creatures[creature].species] = 0
			}
			this.species[this.creatures[creature].species]++;
		}
		this.creatures.sort(function(a, b) {
			return b.GetFitness() - a.GetFitness()
		});
	}

	/**
	 * Creates a new generation that contains all of the best creatures of this generation, and the offspring of those creatures
	 * @returns {Generation} The new generation
	 */
	Reproduce() {
		var creatures = [];
		for (var c = 0; c < simulator.creature.count / 2; c++) {
			creatures.push(clone(this.creatures[c]));
			creatures.push(this.creatures[c].Reproduce());
		}
		return new Generation(creatures);
	}
}

Math.oldRandom = Math.random;
if (simulator.seed == 0) {
	simulator.seed = Math.floor(Math.random() * 10000);
}
seedRandom(simulator.seed, {global: true});

//module.exports = {Node, Muscle};