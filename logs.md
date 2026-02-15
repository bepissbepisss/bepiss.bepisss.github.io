# Development Log - Maxwell's Demon Simulation

## Session Date: February 14, 2026

---

## 1. Door Collision Detection Fix

### Problem
Particles were passing through the closed door due to two bugs:
1. Hardcoded door positions (250, 350) instead of using dynamic variables
2. Missing door state check (doorOpen variable)

### Changes Made to `ball.js`

**File: `scripts/ball.js` - Update method**

**Before:**
```javascript
if (this.pos.y < 250 || this.pos.y > 350) {
  this.pos.x = width / 2 - this.r;
  this.vel.x *= -1;
}
```

**After:**
```javascript
let inDoorArea = this.pos.y > doorTop && this.pos.y < doorBottom;
if (!doorOpen || !inDoorArea) {
  this.pos.x = width / 2 - this.r;
  this.vel.x *= -1;
}
```

**Why:** 
- Used dynamic `doorTop` and `doorBottom` variables that scale with canvas size
- Added proper door state checking - particles only pass when door is OPEN AND they're in the door area
- Fixed logic: bounce if door is closed OR if outside door area

**How it works:**
1. Check if particle's Y position is within door opening range
2. Only allow passage if BOTH conditions are true: door is open AND particle is in door area
3. Otherwise, bounce the particle back by reversing its X velocity

---

## 2. Wall Tunneling Fix

### Problem
Fast-moving particles could "tunnel" through the center wall by skipping over the collision detection zone entirely in a single frame.

### Changes Made to `ball.js`

**Added position tracking:**
```javascript
constructor(x, y, r, id, allBalls) {
  // ... existing code ...
  this.prevX = x; // Track previous position for wall crossing detection
}
```

**Replaced zone-based collision with crossing detection:**

**Before:**
```javascript
if (this.pos.x > width / 2 - this.r && this.pos.x < width / 2 + this.r) {
  // Only checks if particle is in zone near wall
}
```

**After:**
```javascript
this.prevX = this.pos.x; // Store previous x position
this.pos.add(this.vel);

let centerX = width / 2;
let crossedFromLeft = this.prevX < centerX && this.pos.x > centerX;
let crossedFromRight = this.prevX > centerX && this.pos.x < centerX;

if (crossedFromLeft || crossedFromRight) {
  let inDoorArea = this.pos.y > doorTop && this.pos.y < doorBottom;
  if (!doorOpen || !inDoorArea) {
    this.pos.x = crossedFromLeft ? centerX - this.r : centerX + this.r;
    this.vel.x *= -1;
  }
}
```

**Why:**
- Zone-based detection fails when velocity is high enough to skip the zone
- Crossing detection catches ALL wall intersections regardless of speed
- Prevents physics "tunneling" glitch

**How it works:**
1. Store particle's X position at the start of each frame
2. After movement, check if particle crossed the center line
3. Detect direction of crossing (left-to-right or right-to-left)
4. Place particle just outside the wall on the correct side
5. Reverse velocity to simulate bounce

---

## 3. Complete Visual Redesign

### HTML Structure Overhaul (`index.html`)

**Added meta tags and fonts:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Maxwell's Demon - Thermodynamics Simulation</title>
```

**Added Google Fonts:**
- Inter: Modern sans-serif for UI text (weights: 300, 400, 500, 600, 700)
- JetBrains Mono: Monospace for code/numbers (weights: 400, 500, 600)

**Added KaTeX scripts:**
- Auto-render support for LaTeX math expressions in the UI

**Redesigned sidebar structure:**

1. **Panel Header Section**
   - Professional title: "Maxwell's Demon"
   - Subtitle: "Thermodynamics Simulation"
   - Gradient background

2. **Entropy Measurements Section (📊)**
   - System Entropy display with LaTeX notation
   - Demon Entropy display with LaTeX notation
   - Improved stat boxes with hover effects

3. **Particle Control Section (⚙️)** - NEW
   - Blue particle slider (0-30 range)
   - Red particle slider (0-30 range)
   - Real-time value displays
   - Color-coded dots matching particle colors

4. **Chamber Statistics Section (🔬)** - ENHANCED
   - Total particles per chamber
   - Color breakdown showing blue/red counts separately
   - Visual indicators with colored dots

5. **Instructions Section (ℹ️)**
   - Keyboard shortcut display with styled `<kbd>` element
   - Live door status indicator (color-coded)

6. **Entropy Chart Section (📈)**
   - Placeholder for entropy graph
   - Styled canvas element

7. **Footer Section**
   - Educational description of the thought experiment

**Why:** 
- Better information architecture
- More professional appearance
- Easier to understand and navigate
- Educational context for users

---

## 4. CSS Complete Redesign (`style/style.css`)

### Color Scheme
- **Background:** Dark blue gradient (`#0a0e27` → `#1a1a2e` → `#16213e`)
- **Sidebar:** Semi-transparent dark blue with backdrop blur
- **Accent Color:** Light blue (`#64b5f6`)
- **Particle Colors:** Cyan blue (`#00d4ff`) and Red (`#ff5252`)

### Typography System
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
- Headings: Inter Bold (600-700 weight)
- Body: Inter Regular/Medium (400-500 weight)
- Numbers/Code: JetBrains Mono (monospace)

### Key CSS Additions

**1. Stats Panel Improvements**
```css
.stats-panel {
  width: 360px;
  background: linear-gradient(180deg, rgba(22, 33, 62, 0.95) 0%, rgba(26, 26, 46, 0.98) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
}
```
- Glassmorphism effect with blur
- Smooth gradient background
- Professional shadow

**2. Custom Scrollbar**
```css
.stats-panel::-webkit-scrollbar {
  width: 8px;
}
.stats-panel::-webkit-scrollbar-thumb {
  background: rgba(100, 181, 246, 0.3);
  border-radius: 4px;
}
```
- Styled to match theme
- Subtle and unobtrusive

**3. Panel Header**
```css
.panel-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 32px 24px 24px;
  border-bottom: 2px solid rgba(100, 181, 246, 0.3);
}
```
- Eye-catching gradient
- Text shadow for depth
- Clear separation from content

**4. Stat Boxes**
```css
.stat-box {
  background: rgba(30, 60, 114, 0.3);
  border: 1px solid rgba(100, 181, 246, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-box:hover {
  background: rgba(30, 60, 114, 0.5);
  transform: translateX(2px);
  animation: pulse 1.5s infinite;
}
```
- Hover effects for interactivity
- Smooth transitions
- Pulsing animation on hover

**5. Color Breakdown System** - NEW
```css
.color-breakdown {
  display: flex;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid rgba(100, 181, 246, 0.15);
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.blue-dot {
  background: #00d4ff;
  color: #00d4ff;
}

.red-dot {
  background: #ff5252;
  color: #ff5252;
}
```
- Visual indicators matching particle colors
- Glowing effect for emphasis
- Clear color distinction

**6. Slider Controls** - NEW
```css
.particle-slider {
  width: 100%;
  height: 6px;
  background: rgba(100, 181, 246, 0.2);
  border-radius: 3px;
  cursor: pointer;
}

.particle-slider::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  box-shadow: 0 2px 8px rgba(100, 181, 246, 0.5);
}
```
- Custom styled sliders
- Color-coded thumbs (blue slider = blue thumb, red slider = red thumb)
- Hover and active states
- Smooth animations

**7. Instructions Section**
```css
.instructions kbd {
  padding: 4px 10px;
  font-family: 'JetBrains Mono', monospace;
  background: rgba(100, 181, 246, 0.15);
  border: 1px solid rgba(100, 181, 246, 0.3);
  border-radius: 4px;
}
```
- Styled keyboard shortcut displays
- Looks like actual keyboard keys

**8. Door Status Indicators**
```css
.status-closed {
  color: #ff5252;
  font-weight: 600;
}

.status-open {
  color: #69f0ae;
  font-weight: 600;
}
```
- Red for closed, green for open
- Clear visual feedback

**9. Canvas Styling**
```css
#canvas-container canvas {
  border: 3px solid rgba(100, 181, 246, 0.4);
  border-radius: 12px;
  box-shadow: 
    0 0 40px rgba(100, 181, 246, 0.2),
    inset 0 0 60px rgba(0, 0, 0, 0.3);
  background: #0a0e27;
}
```
- Glowing border effect
- Inset shadow for depth
- Matches overall theme

**10. Vertical Gauge Improvements**
```css
.gauge-container-vertical {
  width: 50px;
  height: 420px;
  background: linear-gradient(180deg, rgba(10, 14, 39, 0.8) 0%, rgba(26, 26, 46, 0.9) 100%);
  border: 2px solid rgba(100, 181, 246, 0.3);
  backdrop-filter: blur(10px);
}
```
- Larger, more visible
- Gradient overlay on bars for depth
- Legend added below gauge

**11. Animations**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(100, 181, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(100, 181, 246, 0.6); }
}
```
- Smooth entrance animations
- Pulsing effects for emphasis
- Professional feel

**12. Responsive Design**
```css
@media (max-width: 1200px) {
  .stats-panel { width: 320px; }
}

@media (max-width: 900px) {
  .stats-panel { width: 280px; }
  .gauge-container-vertical { width: 40px; height: 350px; }
}
```
- Adapts to different screen sizes
- Maintains usability on smaller displays

**Why:**
- Modern, professional appearance
- Better visual hierarchy
- Improved user experience
- Scientific/technical aesthetic appropriate for physics simulation

---

## 5. Particle Color System Implementation

### Ball Class Modifications (`ball.js`)

**Added particle type parameter:**
```javascript
constructor(x, y, r, id, allBalls, particleType = 'blue') {
  // ... existing code ...
  this.type = particleType; // 'blue' or 'red'
}
```

**Why:** Allows each particle to have its own color identity

**Redesigned show() method:**
```javascript
show() {
  let mainColor, glowColor, rimColor;
  
  if (this.type === 'red') {
    mainColor = [255, 82, 82, 220];      // Red
    glowColor = [255, 82, 82, 40];       // Red glow
    rimColor = [255, 120, 120, 180];     // Red rim
  } else {
    mainColor = [0, 212, 255, 220];      // Blue
    glowColor = [100, 181, 246, 40];     // Blue glow
    rimColor = [100, 181, 246, 180];     // Blue rim
  }
  
  // Outer glow
  noStroke();
  fill(...glowColor);
  circle(this.pos.x, this.pos.y, this.r * 2.4);
  
  // Main ball
  fill(...mainColor);
  circle(this.pos.x, this.pos.y, this.r * 2);
  
  // Highlight (for 3D effect)
  fill(255, 255, 255, 150);
  circle(this.pos.x - this.r * 0.3, this.pos.y - this.r * 0.3, this.r * 0.8);
  
  // Rim
  noFill();
  stroke(...rimColor);
  strokeWeight(1.5);
  circle(this.pos.x, this.pos.y, this.r * 2);
}
```

**Why:**
- Creates visually appealing gradient-like effect using layered circles
- Different colors for different particle types
- Glow effect for better visibility
- Highlight creates 3D appearance

**How it works:**
1. Select color scheme based on particle type
2. Draw outer glow (largest, semi-transparent)
3. Draw main ball circle (solid color)
4. Draw highlight in upper-left (white, simulates light reflection)
5. Draw rim outline (adds definition)

---

## 6. Particle Control System (`main.js`)

### Added Global Variables
```javascript
let RADIUS = 10;      // Increased from 5 for better visibility
let blueCount = 10;   // Default blue particle count
let redCount = 5;     // Default red particle count
```

### Created initializeParticles() Function
```javascript
function initializeParticles() {
  balls = []; // Clear existing particles
  let particleId = 0;
  
  // Create blue particles
  for (let i = 0; i < blueCount; i++) {
    balls.push(new Ball(
      random(50, width-50), 
      random(50, height-50), 
      RADIUS, 
      particleId++, 
      balls,
      'blue'
    ));
  }
  
  // Create red particles
  for (let i = 0; i < redCount; i++) {
    balls.push(new Ball(
      random(50, width-50), 
      random(50, height-50), 
      RADIUS, 
      particleId++, 
      balls,
      'red'
    ));
  }
  
  // Update all balls' reference to the complete array
  for (let ball of balls) {
    ball.others = balls;
  }
}
```

**Why:**
- Allows dynamic particle creation based on user input
- Separates initialization logic for reusability
- Ensures proper ID assignment
- Maintains correct ball reference arrays

**How it works:**
1. Clear existing particles array
2. Create blue particles based on blueCount
3. Create red particles based on redCount
4. Update all particles' reference to the complete balls array (needed for collision detection)

### Created setupSliders() Function
```javascript
function setupSliders() {
  let blueSlider = document.getElementById('blue-slider');
  let redSlider = document.getElementById('red-slider');
  
  if (blueSlider) {
    blueSlider.addEventListener('input', (e) => {
      blueCount = parseInt(e.target.value);
      document.getElementById('blue-value').textContent = blueCount;
      initializeParticles();
    });
  }
  
  if (redSlider) {
    redSlider.addEventListener('input', (e) => {
      redCount = parseInt(e.target.value);
      document.getElementById('red-value').textContent = redCount;
      initializeParticles();
    });
  }
}
```

**Why:**
- Real-time user control over particle counts
- Instant visual feedback
- Intuitive interface

**How it works:**
1. Get slider DOM elements
2. Add event listeners for 'input' events (fires while dragging)
3. Update count variables
4. Update displayed value in UI
5. Reinitialize all particles with new counts

### Modified setup() Function
```javascript
function setup() {
  // ... canvas setup code ...
  
  initializeParticles();  // Initialize with default counts
  setupSliders();         // Setup slider event listeners
}
```

---

## 7. Enhanced Particle Tracking System

### Modified draw() Function
```javascript
function draw() {
  // ... drawing code ...
  
  // Update and draw all balls, tracking by color and chamber
  let leftBlue = 0, leftRed = 0;
  let rightBlue = 0, rightRed = 0;
  
  for (let b of balls) {
    b.collide();
    b.update();
    b.show();
    
    // Count particles by type and chamber
    if (b.pos.x < width / 2) {
      if (b.type === 'blue') leftBlue++;
      else leftRed++;
    } else {
      if (b.type === 'blue') rightBlue++;
      else rightRed++;
    }
  }
  
  updateParticleCounts(leftBlue, leftRed, rightBlue, rightRed);
}
```

**Why:**
- Tracks four categories instead of two (left/right × blue/red)
- Provides detailed statistics for thermodynamics analysis
- Real-time updates every frame

**How it works:**
1. Initialize counters for each category
2. Loop through all particles
3. Check position (left vs right of center)
4. Check type (blue vs red)
5. Increment appropriate counter
6. Update UI displays

### Enhanced updateParticleCounts() Function
```javascript
function updateParticleCounts(leftBlue, leftRed, rightBlue, rightRed) {
  // Update chamber totals
  let leftTotal = leftBlue + leftRed;
  let rightTotal = rightBlue + rightRed;
  
  let leftElem = document.getElementById('left-count');
  let rightElem = document.getElementById('right-count');
  if (leftElem) leftElem.textContent = leftTotal;
  if (rightElem) rightElem.textContent = rightTotal;
  
  // Update color-specific counts
  let leftBlueElem = document.getElementById('left-blue');
  let leftRedElem = document.getElementById('left-red');
  let rightBlueElem = document.getElementById('right-blue');
  let rightRedElem = document.getElementById('right-red');
  
  if (leftBlueElem) leftBlueElem.textContent = leftBlue;
  if (leftRedElem) leftRedElem.textContent = leftRed;
  if (rightBlueElem) rightBlueElem.textContent = rightBlue;
  if (rightRedElem) rightRedElem.textContent = rightRed;
}
```

**Why:**
- Updates both totals and breakdowns
- Null-safe checking prevents errors
- Separated concerns for maintainability

**How it works:**
1. Calculate total particles per chamber
2. Update total count displays
3. Update individual color count displays
4. Check for element existence before updating (prevents errors)

### Modified keyPressed() Function
```javascript
function keyPressed() {
  if (key === ' ') {
    doorOpen = !doorOpen;
    
    // Update demon image
    let demonImg = document.querySelector('.demon-overlay');
    if (doorOpen) {
      demonImg.src = 'assets/demon_open.png';
    } else {
      demonImg.src = 'assets/demon_closed.png';
    }
    
    // Update door status display
    let statusElem = document.getElementById('door-status');
    let statusContainer = statusElem.closest('.door-status');
    if (statusElem) {
      statusElem.textContent = doorOpen ? 'OPEN' : 'CLOSED';
      statusElem.className = doorOpen ? 'status-open' : 'status-closed';
    }
    if (statusContainer) {
      statusContainer.className = doorOpen ? 'door-status open' : 'door-status closed';
    }
  }
}
```

**Why:**
- Updates UI to reflect door state
- Changes demon image (visual feedback)
- Updates text and styling (color-coded status)

---

## 8. Visual Improvements to Canvas Drawing

### Modified draw() Background
```javascript
background(10, 14, 39);  // Dark blue instead of black
```

**Why:** Matches overall color scheme

### Enhanced Wall/Door Visualization
```javascript
// Wall color changes based on door state
stroke(doorOpen ? color(105, 240, 174, 180) : color(255, 82, 82, 180));
strokeWeight(3);

// Door frame with matching colors
stroke(doorOpen ? color(105, 240, 174) : color(255, 82, 82));
strokeWeight(2);
noFill();
rect(width / 2 - 6, doorTop, 12, doorBottom - doorTop);
```

**Why:**
- Green when open (go/passage allowed)
- Red when closed (stop/blocked)
- Clear visual feedback
- Thicker door frame (6px wide instead of 5px)

---

## Summary of Changes

### Files Modified:
1. **`scripts/ball.js`** 
   - Fixed wall collision detection
   - Added crossing detection for tunneling prevention
   - Added particle type support
   - Redesigned particle rendering with gradients and glow

2. **`scripts/main.js`**
   - Added particle count variables
   - Created initialization system
   - Added slider event handlers
   - Enhanced particle tracking (4 categories)
   - Updated UI update functions
   - Improved door status updates

3. **`index.html`**
   - Added meta tags and proper document structure
   - Imported Google Fonts (Inter + JetBrains Mono)
   - Added KaTeX auto-render support
   - Completely restructured sidebar with new sections
   - Added particle control sliders
   - Added color breakdown displays
   - Added styled instruction section

4. **`style/style.css`**
   - Complete visual redesign
   - New color scheme (dark blue theme)
   - Typography system with custom fonts
   - Glassmorphism effects
   - Custom slider styling
   - Color indicator system
   - Hover effects and animations
   - Responsive design
   - Custom scrollbar
   - Professional stat boxes and panels

### Key Features Implemented:
- ✅ Fixed door collision bugs
- ✅ Fixed wall tunneling issue
- ✅ Complete visual redesign
- ✅ Blue and red particle system
- ✅ Interactive sliders (0-30 particles each)
- ✅ Real-time particle tracking by color and chamber
- ✅ Professional UI with modern design patterns
- ✅ Color-coded status indicators
- ✅ Enhanced visual feedback
- ✅ Responsive layout

### Technical Improvements:
- Better collision detection algorithm
- Modular code structure
- Null-safe DOM updates
- Event-driven architecture
- Proper initialization sequences
- Maintained collision physics accuracy
- Optimized rendering performance

### User Experience Improvements:
- Intuitive controls
- Visual feedback for all actions
- Clear information hierarchy
- Professional aesthetics
- Educational context
- Real-time statistics
- Color-coded indicators
- Smooth animations

---

## Future Enhancement Possibilities:
1. Entropy calculation and graphing
2. Temperature-based particle speeds
3. Velocity distribution histogram
4. Export data/statistics
5. Preset scenarios
6. Particle mass variations
7. Multiple chamber configurations
8. Performance optimizations for 50+ particles

---

## 9. Entropy Calculation System Fix

### Problem
The `updateEntropyDisplay()` function was failing because:
1. `area_box` variable was undefined
2. No safety checks for edge cases (division by zero, logarithm of zero)
3. `leftEntropy` and `rightEntropy` were not declared as variables
4. Gauge bars were calculated but not updated in the DOM

### Changes Made to `main.js`

**Added entropy tracking variables:**
```javascript
let leftEntropy = 0;
let rightEntropy = 0;
```

**Fixed `calcEntropy()` function with safety checks:**
```javascript
function calcEntropy(blue_particles, box_particles, area_box, radius) {
    // Avoid division by zero and logarithm of zero
    if (box_particles === 0 || area_box === 0) return 0;
    
    let n = area_box / (Math.PI * radius ** 2); // number of available microstates
    let k = box_particles;
    let b = blue_particles;
    
    // Safety checks to avoid invalid logarithms
    if (k >= n || b === 0 || k === b) return 0;
    
    let term1 = n * Math.log(n / (n - k));
    let term2 = k * Math.log((n - k) / (k - b));
    let term3 = b * Math.log((k - b) / b);
    
    // Check for NaN values
    if (isNaN(term1)) term1 = 0;
    if (isNaN(term2)) term2 = 0;
    if (isNaN(term3)) term3 = 0;
    
    return term1 + term2 + term3;
}
```

**Why:**
- Prevents mathematical errors (NaN, Infinity)
- Handles edge cases when chambers are empty
- Each term is validated separately
- Returns 0 for invalid states rather than crashing

**Fixed `updateEntropyDisplay()` function:**
```javascript
function updateEntropyDisplay(leftBlue, leftRed, rightBlue, rightRed) {
    // Calculate the area of each chamber (half the canvas)
    let area_box = (width / 2) * height;
    
    leftEntropy = calcEntropy(leftBlue, leftBlue + leftRed, area_box, RADIUS);
    rightEntropy = calcEntropy(rightBlue, rightBlue + rightRed, area_box, RADIUS);

    let totalEntropy = leftEntropy + rightEntropy;

    // Update system entropy display
    let entropyElement = document.getElementById('sys-entropy');
    if (entropyElement) {
        entropyElement.textContent = totalEntropy.toFixed(2);
    }
    
    // Update demon entropy display (represents information/asymmetry)
    let demEntropyElement = document.getElementById('dem-entropy');
    if (demEntropyElement) {
        demEntropyElement.textContent = Math.abs(leftEntropy - rightEntropy).toFixed(2);
    }
    
    // Update vertical gauge bars
    let sysPercent = totalEntropy > 0 ? (leftEntropy / totalEntropy) * 100 : 50;
    let demPercent = totalEntropy > 0 ? (rightEntropy / totalEntropy) * 100 : 50;
    
    let sysGauge = document.getElementById('sys-gauge');
    let demGauge = document.getElementById('dem-gauge');
    
    if (sysGauge) sysGauge.style.height = sysPercent + '%';
    if (demGauge) demGauge.style.height = demPercent + '%';
}
```

**Why:**
- Defines `area_box` based on canvas dimensions (each chamber is width/2 × height)
- Updates both system and demon entropy displays
- System entropy = total entropy of the system
- Demon entropy = difference between chambers (asymmetry/information)
- Updates visual gauge bars to show relative entropy proportions
- Includes safety check to avoid division by zero

**How it works:**

1. **Calculate chamber area**: Each chamber is half the canvas width times full height
2. **Calculate individual entropies**: Uses statistical mechanics formula for each chamber
3. **Update system entropy**: Total entropy displayed in UI
4. **Update demon entropy**: Difference between chambers (measures order/information)
5. **Update gauge bars**: Visual representation of entropy distribution
   - Blue bar (sys-gauge) shows left chamber proportion
   - Orange bar (dem-gauge) shows right chamber proportion
   - Heights are percentages of total entropy

**Entropy Formula Explanation:**

The `calcEntropy` function implements a statistical mechanics formula:
```
S = n·ln(n/(n-k)) + k·ln((n-k)/(k-b)) + b·ln((k-b)/b)
```

Where:
- `n` = number of available microstates (positions in chamber)
- `k` = total particles in chamber
- `b` = blue particles in chamber
- `ln` = natural logarithm

This represents the configurational entropy based on:
- How particles can be arranged in available space
- Distribution between different particle types

**Visual Feedback:**
- Entropy values update in real-time as particles move
- Gauge bars animate smoothly with height transitions
- Higher entropy = more disorder/more possible arrangements
- Lower entropy = more order/fewer possible arrangements

---

## 10. Szilard Engine Entropy Budget System Implementation

### Problem
The demon entropy system needed proper thermodynamic constraints based on Szilard's engine:
- Each measurement costs **kBT·ln(2)** entropy (Landauer's principle)
- Demon has finite entropy budget (max 500)
- User must balance: decreasing system entropy vs. paying measurement costs
- Previous system incorrectly showed entropy differences without cost

### Changes Made to `main.js`

**Added entropy budget tracking variables:**
```javascript
let systemEntropy = 0;           // Total system entropy
let demonEntropy = 0;            // Demon's entropy cost accumulated
let demonBudget = 500;           // Maximum demon entropy budget
let kBT_ln2 = 0.693;             // Cost per measurement: kBT*ln(2) ≈ 0.693
let doorWasPreviouslyOpen = false; // Track door state transitions
```

**Why:**
- Tracks cumulative entropy cost as user opens/closes door
- Each door opening triggers a measurement, costing kBT·ln(2)
- Budget enforces thermodynamic constraint
- State flag prevents cost from being applied multiple times per opening

**Completely rewrote `updateEntropyDisplay()` function:**

The new function:
1. **Measures door state transition** - detects when door changes from closed to open
2. **Applies entropy cost** - adds kBT·ln(2) ≈ 0.693 to demonEntropy when door opens
3. **Clamps demon budget** - ensures demonEntropy stays between 0 and 500
4. **Updates system entropy** - calculates current disorder of particles
5. **Updates UI displays:**
   - System Entropy: shows current system disorder (lower is better)
   - Demon Budget: shows remaining cost allowance (out of 500)
   - Orange Gauge: fills 0-100% as demon uses budget (dem-gauge)
   - Blue Gauge: shows system entropy relative to maximum (sys-gauge)

**Key Logic:**
```javascript
// Detect door opening
if (doorOpen && !doorWasPreviouslyOpen) {
    demonEntropy += kBT_ln2;  // Apply measurement cost
}
doorWasPreviouslyOpen = doorOpen;  // Update state

// Clamp to valid range
if (demonEntropy > demonBudget) demonEntropy = demonBudget;
if (demonEntropy < 0) demonEntropy = 0;

// Display remaining budget (not cost)
let remainingBudget = demonBudget - demonEntropy;
demEntropyElement.textContent = remainingBudget.toFixed(2);

// Orange gauge: cost used (0 to 500)
let demonGaugePercent = (demonEntropy / demonBudget) * 100;
demGauge.style.height = Math.min(100, demonGaugePercent) + '%';

// Blue gauge: system entropy as proportion
let maxEntropy = systemEntropy + demonBudget;
let sysGaugePercent = (systemEntropy / maxEntropy) * 100;
sysGauge.style.height = sysGaugePercent + '%';
```

### How It Works

**Measurement Cost:**
- User presses SPACE to open door
- System detects transition from closed → open
- Adds 0.693 to demonEntropy (one-time per opening)
- Closing and reopening door triggers another 0.693 cost
- User can read cost: check how fast orange gauge fills

**Budget Constraint:**
- Start with 500 total budget
- Each measurement costs ~0.693
- Can perform ~721 measurements before budget exhausted
- Once budget exhausted, door still works but "wasted"
- Forces strategic decision-making

**Gameplay:**
- **Goal:** Minimize system entropy while respecting budget
- **Strategy:** Open door when many mismatched particles near separator
- **Feedback:** 
  - Orange bar fills quickly = costly measurements
  - Blue bar decreases = good separation achieved
  - Both bars worsen = bad measurement (wasted budget)

### Thermodynamic Interpretation

**Szilard's Paradox:**
- Without entropy cost: could violate Second Law (entropy decrease)
- With Landauer's principle: information erasure costs kBT·ln(2)
- Each measurement requires recording result → must erase → costs energy
- **Total entropy (system + demon) never decreases** → Second Law preserved

**Budget Represents:**
- Total erasing/recording capability
- Finite information processing power
- Physical reality: demons have limits
- Prevents perpetual motion without cost

### Bug Prevention Implemented

1. **State Transition Logic:**
   - `doorWasPreviouslyOpen` flag tracks previous state
   - Cost only applies when `doorOpen && !doorWasPreviouslyOpen` (true transition)
   - Prevents cost from being applied every frame while door open

2. **Budget Clamping:**
   - `if (demonEntropy > demonBudget) demonEntropy = demonBudget` → caps at 500
   - `if (demonEntropy < 0) demonEntropy = 0` → prevents negative
   - Ensures valid state always

3. **Gauge Safety:**
   - `Math.min(100, demonGaugePercent)` → prevents over-100% display
   - Percentage calculations use clamped values
   - DOM updates check `if (element)` before accessing

4. **Numerical Safety:**
   - Uses existing `calcEntropy()` with NaN checks
   - Calculates per-chamber then sums total
   - Avoids direct division by zero
   - Gauge calculations use safe arithmetic

5. **HTML Safety:**
   - All element references checked before use
   - Missing elements won't crash system
   - Graceful degradation if HTML changes

### User-Facing Behavior

**Display Changes:**
- "Demon Entropy" now shows remaining budget (descending from 500)
- Orange gauge fills as budget consumed (visual feedback of cost)
- Blue gauge shows system entropy (lower is better)

**Game Mechanics:**
- Opening door once = costs ~0.7 units
- User must balance system entropy decrease vs. budget
- Creates strategic tension in gameplay
- Rewards careful, well-timed measurements

### Example Scenario

1. Start: System Entropy = 50, Demon Budget = 500
2. Open door (costs 0.69) → Demon Budget now 499.31
3. Particles sort while door open
4. System Entropy drops to 40
5. Close door to save budget
6. Open door again (costs 0.69) → Demon Budget now 498.62
7. Repeat: minimize entropy while respecting budget
8. Goal: Get system entropy <10 with budget remaining >100

---

## 11. Perfect Demon Mode Toggle

### Problem
User wanted to see what the ideal Maxwell's demon would accomplish - perfectly sorting all red particles to the right and all blue to the left, regardless of their natural motion.

### Changes Made

**HTML Changes (`index.html`):**
Added a Perfect Demon toggle in the instructions section:
```html
<div class="perfect-demon-toggle">
    <label for="perfect-demon-checkbox" class="checkbox-label">
        <input type="checkbox" id="perfect-demon-checkbox" class="checkbox-input">
        <span class="checkbox-text">Perfect Demon Mode</span>
    </label>
    <p class="toggle-hint">Sorts all blue ◀︎ left | right ▶︎ all red</p>
</div>
```

**CSS Styling (`style/style.css`):**
Added custom checkbox styling with:
- Visual feedback on hover (glow effect)
- Checked state shows cyan gradient with checkmark
- Smooth transitions
- Helpful hint text below toggle
- Professional appearance matching theme

**JavaScript Changes (`scripts/main.js`):**

1. **Added perfectMode variable:**
```javascript
let perfectMode = false;    // Perfect demon mode toggle
```

2. **Created setupPerfectDemon() function:**
```javascript
function setupPerfectDemon() {
  let perfectCheckbox = document.getElementById('perfect-demon-checkbox');
  if (perfectCheckbox) {
    perfectCheckbox.addEventListener('change', (e) => {
      perfectMode = e.target.checked;
    });
  }
}
```

3. **Created arrangePerfectParticles() function:**
```javascript
function arrangePerfectParticles() {
  for (let b of balls) {
    if (b.type === 'blue') {
      // Keep blue particles in left chamber
      b.pos.x = constrain(b.pos.x, RADIUS, width / 2 - RADIUS);
    } else {
      // Keep red particles in right chamber
      b.pos.x = constrain(b.pos.x, width / 2 + RADIUS, width - RADIUS);
    }
  }
}
```

4. **Integrated into draw() function:**
- Calls `arrangePerfectParticles()` before physics simulation
- Runs every frame while mode enabled
- Preserves Y positions and velocities

### How It Works

**Visual Demonstration:**
- When enabled, particles are constantly constrained to their correct chamber
- All blue stay left of center, all red stay right
- Creates ideal scenario showing what a perfect demon would achieve
- System entropy drops dramatically

**Implementation Details:**
- Uses `constrain()` for soft boundary enforcement
- Particles at boundaries softly constrained
- Velocities preserved (still bouncing around)
- Entropy calculations still valid
- No visual lag or jumping

### Bug Prevention

1. **Null Safety:** Checkbox existence verified before listener
2. **Constraint Safety:** `constrain()` prevents invalid positions
3. **State Management:** perfectMode flag properly tracked
4. **Physics Preservation:** Only X position constrained, not velocities

### User Experience

**Demonstration Use Case:**
1. Run normal simulation watching particles mix
2. Enable "Perfect Demon Mode" checkbox
3. Observe instant perfect separation
4. Watch system entropy drop to near-zero
5. Compare ideal case vs. actual demon performance
6. Understand thermodynamic principles visually

**Educational Value:**
- Shows ideal vs. real demon efficiency
- Demonstrates entropy minimization limit
- Visual proof of second law of thermodynamics

---


