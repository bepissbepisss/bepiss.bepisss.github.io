/**
 * EntropyCalculator
 * Handles all thermodynamic entropy calculations for the Maxwell's Demon simulation
 * with robust numerical methods to avoid overflow and precision issues.
 */
class EntropyCalculator {
  constructor() {
    this.STIRLING_THRESHOLD = 100;  // Use Stirling approximation for n >= 100
  }

  /**
   * Calculate the natural logarithm of n! (n factorial)
   * 
   * For small n (< 100): Use explicit summation ln(n!) = sum(ln(i)) for i=1 to n
   * For large n (>= 100): Use advanced Stirling approximation
   *                        ln(n!) ≈ n*ln(n) - n + 0.5*ln(2πn)
   * 
   * @param {number} n - The input value
   * @returns {number} The natural logarithm of n factorial
   */
  logFactorial(n) {
    // Handle edge cases
    if (n < 0) {
      console.warn(`logFactorial: negative input (${n}), returning 0`);
      return 0;
    }
    if (n === 0 || n === 1) {
      return 0; // ln(0!) = ln(1!) = ln(1) = 0
    }

    // Use explicit summation for small n
    if (n < this.STIRLING_THRESHOLD) {
      let sum = 0;
      for (let i = 2; i <= n; i++) {
        sum += Math.log(i);
      }
      return sum;
    }

    // Use Stirling approximation for large n
    // ln(n!) ≈ n*ln(n) - n + 0.5*ln(2πn)
    const lnN = Math.log(n);
    const stirling = n * lnN - n + 0.5 * Math.log(2 * Math.PI * n);
    return stirling;
  }

  /**
   * Calculate combinatorial entropy (entropy from color distinguishability)
   * 
   * For k particles with b blues and (k-b) reds:
   * S_color = ln(k! / (b! * (k-b)!))
   *         = ln(k!) - ln(b!) - ln((k-b)!)
   * 
   * Maximum entropy at equilibrium when b ≈ k/2
   * 
   * @param {number} k - Total particles in chamber
   * @param {number} b - Blue particles in chamber
   * @returns {number} Combinatorial entropy contribution (dimensionless)
   */
  combinatorialEntropy(k, b) {
    // Safety checks
    if (k === 0) return 0;
    if (isNaN(k) || isNaN(b)) {
      console.warn(`combinatorialEntropy: invalid input (k=${k}, b=${b})`);
      return 0;
    }

    // Ensure b is within valid range
    b = Math.max(0, Math.min(b, k));

    // Multinomial coefficient entropy
    // ln(k! / (b! * (k-b)!))
    const logK_factorial = this.logFactorial(k);
    const logB_factorial = this.logFactorial(b);
    const logKminusB_factorial = this.logFactorial(k - b);

    const entropy = logK_factorial - logB_factorial - logKminusB_factorial;

    // Ensure non-negative result (shouldn't happen with proper logarithms)
    return Math.max(0, entropy);
  }

  /**
   * Calculate spatial entropy (entropy from position distribution)
   * 
   * Based on the volume available to particles in the chamber.
   * S_spatial = n*ln(n/(n-k)) + k*ln((n-k)/(k-b)) + b*ln((k-b)/b)
   * 
   * where n = available microstates, k = total particles, b = blue particles
   * 
   * @param {number} n - Number of available microstates (based on chamber area)
   * @param {number} k - Total particles in chamber
   * @param {number} b - Blue particles in chamber
   * @returns {number} Spatial entropy contribution (dimensionless)
   */
  spatialEntropy(n, k, b) {
    // Safety checks
    if (n === 0 || k === 0) return 0;
    if (isNaN(n) || isNaN(k) || isNaN(b)) {
      console.warn(`spatialEntropy: invalid input (n=${n}, k=${k}, b=${b})`);
      return 0;
    }

    // Ensure valid ranges
    k = Math.min(k, n);
    b = Math.max(0, Math.min(b, k));

    // Handle edge cases to avoid log(0)
    if (k === 0 || n - k === 0 || k - b === 0 || b === 0) {
      return 0;
    }

    // Calculate each term with safety checks
    let entropy = 0;

    // First term: n*ln(n/(n-k))
    if (n > k) {
      entropy += n * Math.log(n / (n - k));
    }

    // Second term: k*ln((n-k)/(k-b))
    if (k > b && n > k) {
      entropy += k * Math.log((n - k) / (k - b));
    }

    // Third term: b*ln((k-b)/b)
    if (b > 0 && k > b) {
      entropy += b * Math.log((k - b) / b);
    }

    return Math.max(0, entropy);
  }

  /**
   * Calculate total entropy for a chamber
   * 
   * Combines both spatial and combinatorial entropy components:
   * S_total = S_spatial + S_combinatorial
   * 
   * Maximum entropy when particles are equally distributed and colors are mixed.
   * 
   * @param {number} n - Number of available microstates
   * @param {number} k - Total particles in chamber
   * @param {number} b - Blue particles in chamber
   * @returns {number} Total entropy (dimensionless)
   */
  calculateChamberEntropy(n, k, b) {
    const spatial = this.spatialEntropy(n, k, b);
    const combinatorial = this.combinatorialEntropy(k, b);
    return spatial + combinatorial;
  }

  /**
   * Calculate system entropy (sum of both chambers)
   * 
   * @param {object} leftChamber - {n: microstate_count, k: total_particles, b: blue_particles}
   * @param {object} rightChamber - {n: microstate_count, k: total_particles, b: blue_particles}
   * @returns {number} Total system entropy
   */
  calculateSystemEntropy(leftChamber, rightChamber) {
    const leftEntropy = this.calculateChamberEntropy(
      leftChamber.n,
      leftChamber.k,
      leftChamber.b
    );
    const rightEntropy = this.calculateChamberEntropy(
      rightChamber.n,
      rightChamber.k,
      rightChamber.b
    );
    return leftEntropy + rightEntropy;
  }

  /**
   * Calculate the maximum possible entropy for a given number of particles
   * (when particles are evenly distributed and colors are equally mixed)
   * 
   * @param {number} k - Total number of particles
   * @returns {number} Maximum entropy
   */
  getMaximumEntropy(k) {
    if (k === 0) return 0;
    
    // Maximum combinatorial entropy when colors are equally split
    const maxCombinatorial = this.combinatorialEntropy(k, Math.floor(k / 2));
    
    // Maximum spatial entropy (entire chamber available)
    // Approximated as k * ln(k) for scaling purposes
    const maxSpatial = k * Math.log(k);
    
    return maxSpatial + maxCombinatorial;
  }

  /**
   * Validate entropy range (should be non-negative and reasonable)
   * 
   * @param {number} entropy - Entropy value to validate
   * @param {number} k - Total particles for context
   * @returns {boolean} True if entropy is valid
   */
  isValidEntropy(entropy, k) {
    if (entropy < 0) return false;
    if (isNaN(entropy) || !isFinite(entropy)) return false;
    
    // Entropy should not exceed roughly k * ln(k) * 3 (empirical bound)
    const reasonableMax = k > 0 ? k * Math.log(k) * 3 : Infinity;
    return entropy <= reasonableMax;
  }

  /**
   * Generate detailed entropy statistics for visualization
   * 
   * @param {number} totalBlue - Total blue particles in system
   * @param {number} leftBlue - Blue particles in left chamber
   * @returns {array} Array of {blueLeft: n, entropy: S} for all distributions
   */
  generateMultiplicityData(totalBlue, maxParticles) {
    const data = [];
    
    if (totalBlue === 0 || maxParticles === 0) return data;

    // For each possible number of blue particles on the left
    for (let blueLeft = 0; blueLeft <= totalBlue; blueLeft++) {
      const redLeft = maxParticles - (totalBlue - blueLeft);
      if (redLeft < 0) continue; // Invalid state
      
      // Calculate entropy for this distribution
      const totalLeft = totalBlue - blueLeft + redLeft;
      const entropy = this.combinatorialEntropy(totalBlue, blueLeft) +
                     this.combinatorialEntropy(maxParticles - totalBlue, redLeft);
      
      data.push({
        blueLeft: blueLeft,
        entropy: entropy,
        redLeft: redLeft,
        totalLeft: totalLeft
      });
    }

    return data;
  }
}

// Create global instance
const entropyCalc = new EntropyCalculator();
