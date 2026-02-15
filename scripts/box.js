class Box {
    sizeX; // int
    sizeY; // int dimension of the boxes of the boxs
    totalBalls; // total number of balls
    particleCounts; // two keys, blue and red holding ints for the counts
    constructor(sizeX, sizeY, numBlue, numRed) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.totalBalls = numBlue + numRed;
        this.particleCounts = { 'blue': numBlue, 'red': numRed};
    }
    // replaces the particle counts with a new dictionary
    replaceCounts(dict) {
        this.particleCounts = dict;
    }

    // calculates entropy as the log of the multiplicity of the macrostate
	calcEntropy(blue_particles,  box_particles, area_box, radius) {

        let n = area_box/(Math.PI*radius**2); // number of available microstates (number of ways to fit non-overlapping circles in the box)
        let k = box_particles;
        let b = blue_particles;

		return n * Math.log(n / (n - k)) + k * Math.log((n - k) / (k - b)) + b * Math.log((k - b) / b);
	}

	// calculates the temperature of a box
	calcTemp() {
		k = this.totalBalls;
		b = this.particleCounts["blue"];
		slowSpeed = 2 // magic number for now
		fastSpeed = 5 // magic number for now
		avgSpeed = (slowSpeed*b + fastSpeed*(k-b))/k
		return (avgSpeed**2)/3 // assuming mass and boltzman constant = 1
	}
}
