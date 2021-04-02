export default class Vector {
	// Constants {{{
	static zero = new Vector(0, 0);
	static one = new Vector(1, 1);
	static up = new Vector(0, 1);
	static down = new Vector(0, -1);
	static left = new Vector(-1, 0);
	static right = new Vector(1, 0);
	// }}}

	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	get magnitude(): number {
		return Math.hypot(this.x, this.y);
	}

	get normalized(): Vector {
		return Vector.div(this, this.magnitude);
	}

	get negated(): Vector {
		return new Vector(-this.x, -this.y);
	}

	over(deltaTime: number): Vector {
		return Vector.mult(this, deltaTime);
	}

	clone(): Vector {
		return new Vector(this.x, this.y);
	}

	add(other: Vector): Vector {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	sub(other: Vector): Vector {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	mult(scalar: number): Vector {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	div(divisor: number): Vector {
		if (divisor === 0) return Vector.zero.clone();
		this.x /= divisor;
		this.y /= divisor;
		return this;
	}

	static add(a: Vector, b: Vector): Vector {
		return new Vector(a.x + b.x, a.y + b.y);
	}

	static sub(a: Vector, b: Vector): Vector {
		return new Vector(a.x - b.x, a.y - b.y);
	}

	static mult(vector: Vector, scalar: number): Vector {
		return new Vector(vector.x * scalar, vector.y * scalar);
	}

	static div(vector: Vector, divisor: number): Vector {
		if (divisor === 0) return Vector.zero.clone();
		return new Vector(vector.x / divisor, vector.y / divisor);
	}

	static dist(a: Vector, b: Vector): number {
		return Math.hypot(b.x - a.x, b.y - a.y);
	}
}
