let beat = new Audio('assets/short-pop.mp3');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;

// 1. Fetch and decode the audio once
fetch('assets/short-pop.mp3')
  .then(res => res.arrayBuffer())
  .then(data => audioContext.decodeAudioData(data))
  .then(buffer => audioBuffer = buffer);

// 2. Play overlapping instances
function playSound() {
  if (!audioBuffer) return;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0); // Plays immediately
}

class Ball {
  constructor(x, y, r, id, allBalls, particleType = 'blue') {
    this.pos = createVector(x, y); // vector object from p5.js
    this.vel = this.createInitialVelocity(particleType);
    this.r = r;
    this.m = r * 0.1; // Mass proportional to size 
    this.id = id;
    this.others = allBalls;
    this.prevX = x; // Track previous position for wall crossing detection
    this.type = particleType; // 'blue' (slow) or 'red' (fast)
    this.lastDoorHitTime = -1000; // Track when ball last hit door area (prevent duplicate counting)
  }

// Attribute,Data Type,Purpose
// pos,Vector,Where the ball is.
// vel,Vector,Where the ball is going.
// r,Number,How big the ball is.
// m,Number,How much force the ball carries.
// id,Number,Which ball this is in the list.
// others,Array,Access to all other balls for collision detection.

  update() {
    this.prevX = this.pos.x; // Store previous x position
    this.pos.add(this.vel);

    // Update type based on current speed
    this.updateTypeBySpeed();

    //Center Wall Bounce - Detect crossing from either side
    let centerX = width / 2;
    let crossedFromLeft = this.prevX < centerX && this.pos.x > centerX;
    let crossedFromRight = this.prevX > centerX && this.pos.x < centerX;
    
    if (crossedFromLeft || crossedFromRight) {
      // Check if ball is in door opening area
      let inDoorArea = this.pos.y > doorTop && this.pos.y < doorBottom;
      
      // Track door hit: increment demon entropy when particle hits door area
      if (inDoorArea) {
        let currentTime = frameCount;
        // Only count if last hit was more than 5 frames ago (prevent multi-counting same collision)
        if (currentTime - this.lastDoorHitTime > 5) {
          this.lastDoorHitTime = currentTime;
          // Signal main.js to increment demon entropy (Landauer's principle: cost of measurement)
          onDoorAreaHit();
        }
      }
      
      if (perfectMode) {
        // In perfect mode, only allow correct particles to pass through door area
        let isCorrectParticle = (this.type === 'blue' && crossedFromLeft) || (this.type === 'red' && crossedFromRight);
        if (!inDoorArea || !isCorrectParticle) {
          // Bounce if outside door area or wrong particle type
          this.pos.x = crossedFromLeft ? centerX - this.r : centerX + this.r;
          this.vel.x *= -1;
        }
      } else {
        // Normal mode: Bounce if door is closed OR if particle is outside door area when open
        if (!doorOpen || !inDoorArea) {
          // Place ball just outside the wall
          this.pos.x = crossedFromLeft ? centerX - this.r : centerX + this.r;
          this.vel.x *= -1;
        }
      }
    }

    // Wall Bounces
    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
    if (this.pos.y + this.r > height) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }

  createInitialVelocity(particleType) {
    let threshold = (typeof SPEED_THRESHOLD === 'number') ? SPEED_THRESHOLD : 3.5;
    let minSpeed = 2;
    let maxSpeed = 5;
    let speedMin = minSpeed;
    let speedMax = maxSpeed;

    if (particleType === 'blue' && threshold > minSpeed) {
      speedMin = minSpeed;
      speedMax = Math.max(minSpeed + 0.1, threshold - 0.1);
    } else if (particleType === 'red' && threshold < maxSpeed) {
      speedMin = Math.min(maxSpeed - 0.1, threshold + 0.1);
      speedMax = maxSpeed;
    }

    return p5.Vector.random2D().mult(random(speedMin, speedMax));
  }

  updateTypeBySpeed() {
    let threshold = (typeof SPEED_THRESHOLD === 'number') ? SPEED_THRESHOLD : 3.5;
    this.type = this.vel.mag() >= threshold ? 'red' : 'blue';
  }

  collide() {
    
    for (let i = this.id + 1; i < this.others.length; i++) { // this ensures each pair is only checked once     
      let other = this.others[i];
      let distanceVect = p5.Vector.sub(other.pos, this.pos);
      let distanceMag = distanceVect.mag();
      let minDistance = this.r + other.r;

      if (distanceMag < minDistance) {
        //beat.load();
        //beat.play();
        if (redCount+ blueCount < 20) playSound();
        // 1. Resolve Overlap
        let overlap = minDistance - distanceMag;
        let nudge = distanceVect.copy().setMag(overlap / 2);
        this.pos.sub(nudge);
        other.pos.add(nudge);

        // 2. Elastic Collision Math
        let normal = p5.Vector.div(distanceVect, distanceMag);
        let tangent = createVector(-normal.y, normal.x);

        let v1n = normal.dot(this.vel);
        let v1t = tangent.dot(this.vel);
        let v2n = normal.dot(other.vel);
        let v2t = tangent.dot(other.vel);

        let v1nAfter = (v1n * (this.m - other.m) + 2 * other.m * v2n) / (this.m + other.m);
        let v2nAfter = (v2n * (other.m - this.m) + 2 * this.m * v1n) / (this.m + other.m);

        let v1nVec = p5.Vector.mult(normal, v1nAfter);
        let v1tVec = p5.Vector.mult(tangent, v1t);
        let v2nVec = p5.Vector.mult(normal, v2nAfter);
        let v2tVec = p5.Vector.mult(tangent, v2t);

        this.vel = p5.Vector.add(v1nVec, v1tVec);
        other.vel = p5.Vector.add(v2nVec, v2tVec);
      }
    }
  }

  show() {
    // Color schemes based on speed threshold
    let mainColor, glowColor, rimColor;
    
    if (this.type === 'red') {
      mainColor = [255, 82, 82, 220];      // Fast (red)
      glowColor = [255, 82, 82, 40];       // Red glow
      rimColor = [255, 120, 120, 180];     // Red rim
    } else {
      mainColor = [0, 212, 255, 220];      // Slow (blue)
      glowColor = [100, 181, 246, 40];     // Blue glow
      rimColor = [100, 181, 246, 180];     // Blue rim
    }
    
    // Create gradient-like effect with layered circles
    // Outer glow
    noStroke();
    fill(...glowColor);
    circle(this.pos.x, this.pos.y, this.r * 2.4);
    
    // Main ball with gradient simulation
    fill(...mainColor);
    circle(this.pos.x, this.pos.y, this.r * 2);
    
    // Highlight
    fill(255, 255, 255, 150);
    circle(this.pos.x - this.r * 0.3, this.pos.y - this.r * 0.3, this.r * 0.8);
    
    // Rim
    noFill();
    stroke(...rimColor);
    strokeWeight(1.5);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}