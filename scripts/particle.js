class Particle {
  constructor(x, y, v, a, ballColor, radius, mass  = 1) {
    this.x = x;
    this.y = y;
    this.vx = v*Math.cos(a);
    this.vy = v*Math.sin(a);
    this.mass = mass;
    this.radius = radius;
    this.ballColor = ballColor;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  openDoor() {

  }

  checkWalls() {
    if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
    if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
  }

  checkCenterWall() {
    if (this.x > width / 2 - this.radius && this.x < width / 2 + this.radius) {
      // Check if particle is in door opening area
      if (doorOpen && this.y > doorTop && this.y < doorBottom) {
        // Door is open, allow particle to pass through
        return;
      }
      // Otherwise bounce off wall
      this.vx *= -1;
    }
  }

    checkCollision(other) {
    // 1. Calculate distance between centers
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // 2. Check for overlap
    if (distance < this.radius + other.radius) {
        
        // --- PHYSICS: Conservation of Momentum & Energy ---
        
        // 3. Find the Unit Normal vector (direction of impact)
        let nx = dx / distance;
        let ny = dy / distance;

        // 4. Find Relative Velocity
        let rvx = this.vx - other.vx;
        let rvy = this.vy - other.vy;

        // 5. Calculate Scalar Velocity along the Normal (Dot Product)
        let velAlongNormal = rvx * nx + rvy * ny;

        // 6. Only resolve if particles are actually moving TOWARD each other
        if (velAlongNormal > 0) return;

        // 7. Calculate Impulse Scalar (j) 
        // For elastic collisions: j = -(1 + e) * v_rel_normal / (1/m1 + 1/m2)
        // Here, e = 1 (perfectly elastic)
        let j = -(2 * velAlongNormal) / (1 / this.mass + 1 / other.mass);

        // 8. Apply Impulse to velocities
        let impulseX = j * nx;
        let impulseY = j * ny;

        this.vx += impulseX / this.mass;
        this.vy += impulseY / this.mass;
        other.vx -= impulseX / other.mass;
        other.vy -= impulseY / other.mass;

        // --- PREVENT STICKING: Positional Correction ---
        let overlap = (this.radius + other.radius) - distance;
        let t = 0.5; // push factor
        this.x -= nx * (overlap * t);
        this.y -= ny * (overlap * t);
        other.x += nx * (overlap * t);
        other.y += ny * (overlap * t);
    }
}

  display() {
    fill(this.ballColor);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}
