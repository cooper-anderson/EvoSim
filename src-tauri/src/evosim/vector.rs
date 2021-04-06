#[derive(Clone, Copy, serde::Serialize)]
pub struct Vector { x: f64, y: f64 }

#[allow(dead_code)]
impl Vector {
	pub fn new(x: f64, y: f64) -> Self { Vector { x, y } }
	pub fn blank() -> Self { Vector { x: 0.0, y: 0.0 } }

	pub fn magnitude(self) -> f64 { self.x.hypot(self.y) }
	pub fn normalized(self) -> Vector { Vector::div(self, self.magnitude()) }
	pub fn negated(self) -> Vector { Vector { x: -self.x, y: -self.y } }
	pub fn over(self, dt: f64) -> Vector { Vector::mul(self, dt) }

	pub fn add(a: Vector, b: Vector) -> Vector {
		Vector { x: a.x + b.x, y: a.y + b.y }
	}

	pub fn sub(a: Vector, b: Vector) -> Vector {
		Vector { x: a.x - b.x, y: a.y - b.y }
	}

	pub fn mul(vector: Vector, scalar: f64) -> Vector {
		Vector { x: vector.x * scalar, y: vector.y * scalar }
	}

	pub fn div(vector: Vector, divisor: f64) -> Vector {
		if divisor == 0.0 { return Vector::blank() }
		Vector { x: vector.x / divisor, y: vector.y / divisor }
	}

	pub fn dist(a: Vector, b: Vector) -> f64 {
		(b.x - a.x).hypot(b.y - a.y)
	}
}

impl std::ops::Add<Vector> for Vector {
	type Output = Vector;
	fn add(self, rhs: Vector) -> Self::Output { Vector::add(self, rhs) }
}

impl std::ops::AddAssign<Vector> for Vector {
	fn add_assign(&mut self, rhs: Vector) {
		self.x += rhs.x;
		self.y += rhs.y;
	}
}

impl std::ops::Sub<Vector> for Vector {
	type Output = Vector;
	fn sub(self, rhs: Vector) -> Self::Output { Vector::sub(self, rhs) }
}

impl std::ops::SubAssign<Vector> for Vector {
	fn sub_assign(&mut self, rhs: Vector) {
		self.x -= rhs.x;
		self.y -= rhs.y;
	}
}

impl std::ops::Mul<f64> for Vector {
	type Output = Vector;
	fn mul(self, rhs: f64) -> Self::Output { Vector::mul(self, rhs) }
}

impl std::ops::MulAssign<f64> for Vector {
	fn mul_assign(&mut self, rhs: f64) {
		self.x *= rhs;
		self.y *= rhs;
	}
}

impl std::ops::Div<f64> for Vector {
	type Output = Vector;
	fn div(self, rhs: f64) -> Self::Output { Vector::div(self, rhs) }
}

impl std::ops::DivAssign<f64> for Vector {
	fn div_assign(&mut self, rhs: f64) {
		if rhs == 0.0 {
			self.x = 0.0;
			self.y = 0.0;
		} else {
			self.x /= rhs;
			self.y /= rhs;
		}
	}
}

impl std::ops::Neg for Vector {
	type Output = Vector;
	fn neg(self) -> Self::Output { self.negated() }
}

#[cfg(test)]
mod math {
	use super::Vector;

	#[test]
	fn new() {
		let v = Vector::new(5.0, 6.0);
		assert_eq!(5.0, v.x);
		assert_eq!(6.0, v.y);
	}

	#[test]
	fn add() {
		let v = Vector::new(5.0, 6.0);
		let u = Vector::new(2.0, 3.0);
		let w = Vector::add(v, u);
		assert_eq!(7.0, w.x);
		assert_eq!(9.0, w.y);
	}

	#[test]
	fn sub() {
		let v = Vector::new(5.0, 6.0);
		let u = Vector::new(2.0, 3.0);
		let w = Vector::sub(v, u);
		assert_eq!(3.0, w.x);
		assert_eq!(3.0, w.y);
	}

	#[test]
	fn mul() {
		let v = Vector::new(5.0, 6.0);
		let w = Vector::mul(v, 2.5);
		assert_eq!(12.5, w.x);
		assert_eq!(15.0, w.y);
	}

	#[test]
	fn div() {
		let v = Vector::new(5.0, 6.0);
		let w = Vector::div(v, 2.5);
		assert_eq!(2.0, w.x);
		assert_eq!(2.4, w.y);
	}

	#[test]
	fn div_z() {
		let v = Vector::new(5.0, 6.0);
		let w = Vector::div(v, 0.0);
		assert_eq!(0.0, w.x);
		assert_eq!(0.0, w.y);
	}

	#[test]
	fn neg() {
		let v = Vector::new(5.0, 6.0);
		let w = v.negated();
		assert_eq!(-5.0, w.x);
		assert_eq!(-6.0, w.y);
	}

	#[test]
	fn mag() {
		let v = Vector::new(3.0, 4.0);
		let m = v.magnitude();
		assert_eq!(5.0, m);
	}

	#[test]
	fn dist() {
		let v = Vector::new(5.0, 2.0);
		let u = Vector::new(9.0, 5.0);
		let d = Vector::dist(v, u);
		assert_eq!(5.0, d);
	}

	#[test]
	fn norm() {
		let v = Vector::new(10.0, 0.0);
		let n = v.normalized();
		assert_eq!(1.0, n.x);
		assert_eq!(0.0, n.y);
	}
}

#[cfg(test)]
mod ops {
	use super::Vector;

	#[test]
	fn add() {
		let v = Vector::new(5.0, 6.0);
		let u = Vector::new(2.0, 3.0);
		let w = v + u;
		assert_eq!(7.0, w.x);
		assert_eq!(9.0, w.y);
	}

	#[test]
	fn sub() {
		let v = Vector::new(5.0, 6.0);
		let u = Vector::new(2.0, 3.0);
		let w = v - u;
		assert_eq!(3.0, w.x);
		assert_eq!(3.0, w.y);
	}

	#[test]
	fn mul() {
		let v = Vector::new(5.0, 6.0);
		let w = v * 2.5;
		assert_eq!(12.5, w.x);
		assert_eq!(15.0, w.y);
	}

	#[test]
	fn div() {
		let v = Vector::new(5.0, 6.0);
		let w = v / 2.5;
		assert_eq!(2.0, w.x);
		assert_eq!(2.4, w.y);
	}

	#[test]
	fn div_z() {
		let v = Vector::new(5.0, 6.0);
		let w = v / 0.0;
		assert_eq!(0.0, w.x);
		assert_eq!(0.0, w.y);
	}

	#[test]
	fn neg() {
		let v = Vector::new(5.0, 6.0);
		let w = -v;
		assert_eq!(-5.0, w.x);
		assert_eq!(-6.0, w.y);
	}
}

#[cfg(test)]
mod set {
	use super::Vector;

	#[test]
	fn add() {
		let mut v = Vector::new(5.0, 6.0);
		v += Vector::new(2.0, 3.0);
		assert_eq!(7.0, v.x);
		assert_eq!(9.0, v.y);
	}

	#[test]
	fn sub() {
		let mut v = Vector::new(5.0, 6.0);
		v -= Vector::new(2.0, 3.0);
		assert_eq!(3.0, v.x);
		assert_eq!(3.0, v.y);
	}

	#[test]
	fn mul() {
		let mut v = Vector::new(5.0, 6.0);
		v *= 2.5;
		assert_eq!(12.5, v.x);
		assert_eq!(15.0, v.y);
	}

	#[test]
	fn div() {
		let mut v = Vector::new(5.0, 6.0);
		v /= 2.5;
		assert_eq!(2.0, v.x);
		assert_eq!(2.4, v.y);
	}

	#[test]
	fn div_z() {
		let mut v = Vector::new(5.0, 6.0);
		v /= 0.0;
		assert_eq!(0.0, v.x);
		assert_eq!(0.0, v.y);
	}
}
