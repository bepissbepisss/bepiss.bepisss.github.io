class circle{
    color; //String
    position; //dict -> floats
    speed; //float
    radius; //int
    velocity //dict -> floats

    constructor(color, positionX, positionY, speed, radius) {
        randAngle = random(angle);
        console.log(randAngle);
        this.color = color;
        this.position.x = positionX;
        this.position.y = positionY;
        this.speed = speed;
        this.radius = radius;
        this.velocity.x = speed * Math.cos(random);
        this.velocity.y = speed*Math.sin(randAngle);
    }

    getColor(){
        return this.color;
    }

    getPosition(){
        return this.position;
    }

    getVelocity(){
        return this.velocity;
    }

    updatePosition(){
        this.position.x += this.velocity.x;
        this.positiony += this.velocity.y;
    }
    checkBound(){
        if (this.position.x < this.radius || this.position.x > width - this.radius) this.velocity.x *= -1;
        if (this.position.y < this.radius || this.position.y > height - this.radius) this.velocity.y *= -1;
    }

    checkMiddleWall(isWallOpen){
        if (this.position.x > width / 2 - this.radius && this.position.x < width / 2 + this.radius) {
            if (isWallOpen && this.position.y > doorTop && this.position.y < doorBottom) {
                return;
            }
            this.velocity.x *= -1;
        }
    }

    setVelocity(velocityX, velocityY){
        this.velocity.x = velocityX;
        this.velocity.y = velocityY;
    }

}