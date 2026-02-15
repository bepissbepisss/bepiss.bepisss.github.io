// Position demon overlay relative to canvas
function positionDemon() {
  let demonImg = document.querySelector('.demon-overlay');
  let canvas = document.querySelector('#canvas-container canvas');
  
  if (canvas && demonImg) {
    let canvasRect = canvas.getBoundingClientRect();
    let containerRect = document.querySelector('#canvas-container').getBoundingClientRect();
    
    // Position relative to container
    let leftOffset = canvasRect.left - containerRect.left;
    let topOffset = canvasRect.top - containerRect.top;
    
    demonImg.style.left = (leftOffset + canvasRect.width / 2) + 'px';
    demonImg.style.top = (topOffset - 40) + 'px';
  }
}

// Reposition on window resize
window.addEventListener('resize', positionDemon);

// p5.js function called when window is resized
function windowResized() {
  let container = document.getElementById('canvas-container');
  let w = container.offsetWidth - 200;
  let h = container.offsetHeight - 200;
  resizeCanvas(w, h);
  
  // Update door position proportionally
  doorTop = height * 0.42;
  doorBottom = height * 0.58;
  
  // Reposition demon
  positionDemon();
  
  // Constrain particles to new canvas size
  for (let p of slowParticles.concat(fastParticles)) {
    p.x = constrain(p.x, p.radius, width - p.radius);
    p.y = constrain(p.y, p.radius, height - p.radius);
  }
}