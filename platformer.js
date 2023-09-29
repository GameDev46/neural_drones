class character {

	canvas = 0;
	ctx = 0;
	colourSelected = "#131313";
	mass = 50;
	platforms = [];
	friction = 1.5;
	gravity = 9.81;
	direction = 0;
	crashes = 0;
	isColliding = false;
	position = {
		x: 0,
		y: 0,
		set: function(xPos, yPos) {
			this.x = xPos;
			this.y = yPos;
		}
	}
	scale = {
		x: 0,
		y: 0,
		set: function(xScale, yScale) {
			this.x = xScale;
			this.y = yScale;
		}
	}
	velocity = {
		x: 0,
		y: 0,
		set: function(xVel, yVel) {
			this.x = xVel;
			this.y = yVel;
		}
	}

	constructor(htmlCanvas, platforms) {
		this.canvas = htmlCanvas;
		this.ctx = this.canvas.getContext("2d");

		this.platforms = platforms;

		this.position.set(0, 0);
	}

	colour(col) {
		this.colourSelected = col;
	}

	applyVelocity(vel) {
		this.velocity.x += Math.sin(this.direction) * vel;
		this.velocity.y += -Math.cos(this.direction) * vel;
	}

	update(delta) {

		this.direction = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.direction));

		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		this.ctx.translate(this.position.x, this.position.y);
		this.ctx.rotate(this.direction);
		this.ctx.translate(-this.position.x, -this.position.y);

		let droneWidth = 13;

		this.ctx.fillStyle = this.colourSelected;
		this.ctx.strokeStyle = this.colourSelected;

		this.ctx.beginPath();
		this.ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
		this.ctx.fill();

		// Connector
		this.ctx.strokeRect(this.position.x - droneWidth, this.position.y, droneWidth * 2, 3);

		// Left booster
		this.ctx.beginPath();
		this.ctx.moveTo(this.position.x - droneWidth, this.position.y - 5);
		this.ctx.lineTo(this.position.x - droneWidth + 3, this.position.y + 5);
		this.ctx.lineTo(this.position.x - droneWidth - 3, this.position.y + 5);
		this.ctx.fill();

		// Right booster
		this.ctx.beginPath();
		this.ctx.moveTo(this.position.x + droneWidth, this.position.y - 5);
		this.ctx.lineTo(this.position.x + droneWidth + 3, this.position.y + 5);
		this.ctx.lineTo(this.position.x + droneWidth - 3, this.position.y + 5);
		this.ctx.fill();

		// Physics

		this.velocity.y += this.gravity * this.mass * delta;
		this.position.y += this.velocity.y * delta;

		let collided = this.detectCollisions(this.position, "y");

		this.isColliding = false;

		if (collided) {
			this.velocity.y = -this.velocity.y * 0.4;

			this.isColliding = true;

			this.crashes += 1;
		}

		this.velocity.x -= this.velocity.x * delta * this.friction;
		this.position.x += this.velocity.x * delta;

		collided = this.detectCollisions(this.position, "x");

		if (collided) {
			this.velocity.x = -this.velocity.x * 0.4;

			this.crashes += 1;

			this.isColliding = true;
		}

	}

	detectCollisions(pos, type) {

		for (let i = 0; i < this.platforms.length; i++) {

			if (!this.platforms[i].hasCollision) {
				continue;
			}

			let width = this.platforms[i].width;
			let height = this.platforms[i].height;

			let xPos = this.platforms[i].x;
			let yPos = this.platforms[i].y;

			// x collisions
			if (xPos < pos.x + this.scale.x && xPos + width > pos.x) {
				// y collisions
				if (yPos < pos.y + this.scale.y && yPos + height > pos.y) {
					// Move out of collision

					if (type == "y") {

						while (yPos < pos.y + this.scale.y && yPos + height > pos.y) {

							if (this.velocity.y < 0) {

								this.position.y += 0.01;
								pos.y += 0.01;

							}
							else {

								this.position.y -= 0.01;
								pos.y -= 0.01;

							}

						}

					}
					else {

						while (xPos < pos.x + this.scale.x && xPos + width > pos.x) {

							if (this.velocity.x < 0) {

								this.position.x += 0.01;
								pos.x += 0.01;

							}
							else {

								this.position.x -= 0.01;
								pos.x -= 0.01;

							}

						}

					}

					return true;
				}
			}

		}

		return false;

	}

}

let platformer = {
	character: character,
	platforms: [],
	canvas: 0,
	ctx: 0,
	colourSelected: "rgb(13, 13, 13)",
	friction: 9.81,
	gravity: 9.81,
	rgb: function(red, green, blue) {
		return "rgb(" + red + "," + green + "," + blue + ")";
	},
	rgba: function(red, green, blue, alpha) {
		return "rgb(" + red + "," + green + "," + blue + "," + alpha + ")";
	},
	colour: function(col) {
		this.colourSelected = col;
	},
	setup: function(htmlCanvas, options) {

		this.canvas = htmlCanvas;
		this.ctx = this.canvas.getContext("2d");

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.friction = options.friction;
		this.gravity = options.gravity;

	},
	createPlatform: function(xPos, yPos, width, height, hasCollision) {

		this.platforms.push({
			x: xPos,
			y: yPos,
			width: width,
			height: height,
			colour: this.colourSelected,
			hasCollision: hasCollision
		})

		return this.platforms.length - 1;

	},
	drawPlatforms: function(backgroundColour) {

		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.fillStyle = backgroundColour;
this.ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < this.platforms.length; i++) {

			this.ctx.fillStyle = this.platforms[i].colour;

			this.ctx.fillRect(this.platforms[i].x, this.platforms[i].y, this.platforms[i].width, this.platforms[i].height);

		}

	}
}

export { platformer };