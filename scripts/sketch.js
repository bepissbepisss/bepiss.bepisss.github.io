let fastParticles = [];
let slowParticles = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;
let myBox = new Box(10,10,3,4);
console.log(myBox.particleCounts.blue);
dict = {blue : 5, red : 5};
myBox.replaceDict(dict);
console.log(myBox.particleCounts.blue);

function setup() {
  frameRate(60); 
  // Make canvas responsive to container size
  let container = document.getElementById('canvas-container');
  let w = container.offsetWidth - 200; // Leave some margin
  let h = container.offsetHeight - 200;
  let canvas = createCanvas(w, h);
  let radius = 10; // Define radius for particles

  canvas.parent('canvas-container'); 
  
  // Position demon relative to canvas
  positionDemon();
  
  // Scale door position to canvas height
  doorTop = height * 0.42;
  doorBottom = height * 0.58;
  
  for (let i = 0; i < 10; i++) {
    slowParticles.push(new Particle(random(radius, width - radius), random(radius, height - radius), random(-1,1) * random(0.1, 0.5), random(-1,1) * random(0.1, 0.5), color(0, 0, 255), radius));
  }
  for (let i = 0; i < 10; i++) {
    fastParticles.push(new Particle(random(radius, width - radius), random(radius, height - radius), random(-1,1) * random(2, 2.5), random(-1,1) * random(2, 2.5), color(255, 0, 0), radius));
  }
}

function draw() {
  
  background(30);
  
  text('FPS: ' + floor(frameRate()), 10, 20);
  // Draw divider with door
  stroke(255);
  strokeWeight(2);
  if (doorOpen) {
    // Draw wall segments with gap for door
    line(width / 2, 0, width / 2, doorTop);
    line(width / 2, doorBottom, width / 2, height);
  } else {
    // Draw complete wall
    line(width / 2, 0, width / 2, height);
  }
  
  // Draw door frame
  stroke(doorOpen ? color(0, 255, 0) : color(255, 0, 0));
  noFill();
  rect(width / 2 - 5, doorTop, 10, doorBottom - doorTop);
  
  // Instructions in the top left corner
  fill(255);
  noStroke();
  textSize(16);
  text('Press SPACE to toggle door', 10, 30);
  text('Door: ' + (doorOpen ? 'OPEN' : 'CLOSED'), 10, 55);

  // Combine all particles for collision detection
  let allParticles = slowParticles.concat(fastParticles);
  
  // Multiple physics sub-steps per frame
  let subSteps = 4; // Check collisions 4 times per frame
  
  for (let step = 0; step < subSteps; step++) {
    for (let p of allParticles) {
      p.update();
      p.checkWalls();
      p.checkCenterWall();
      
      // Check collisions with all other particles
      for (let other of allParticles) {
        if (p !== other) p.checkCollision(other);
      }
    }
  }
  
  // Display particles only once
  for (let p of allParticles) {
    p.display();
  }

  // update the entropy display
  // updateEntropyDisplay(myBox);
  

}

// Toggle door when spacebar is pressed
function keyPressed() {
  if (key === ' ') {
    doorOpen = !doorOpen;
    
    // Change demon image based on door state
    let demonImg = document.querySelector('.demon-overlay');
    if (doorOpen) {
      demonImg.src = 'assets/demon_open.png';
    } else {
      demonImg.src = 'assets/demon_closed.png';
    }
  }
}
