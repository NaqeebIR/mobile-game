class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.isRunning = false;
        this.player = {
            x: 0,
            y: 0,
            size: 30,
            speed: 5
        };
        this.obstacles = [];
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height - this.player.size * 2;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e));
        
        // Mouse events for testing on desktop
        this.canvas.addEventListener('mousemove', (e) => this.handleMouse(e));
        
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.player.x = touch.clientX - rect.left - this.player.size / 2;
    }

    handleMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.player.x = e.clientX - rect.left - this.player.size / 2;
    }

    startGame() {
        this.isRunning = true;
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('restartButton').style.display = 'none';
        this.gameLoop();
    }

    restartGame() {
        this.score = 0;
        document.getElementById('scoreValue').textContent = this.score;
        this.obstacles = [];
        this.startGame();
    }

    createObstacle() {
        const size = 30;
        const x = Math.random() * (this.canvas.width - size);
        this.obstacles.push({
            x,
            y: -size,
            size,
            speed: 3 + Math.random() * 2
        });
    }

    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.y += obstacle.speed;

            if (this.checkCollision(obstacle)) {
                this.gameOver();
                return;
            }

            if (obstacle.y > this.canvas.height) {
                this.obstacles.splice(i, 1);
                this.score++;
                document.getElementById('scoreValue').textContent = this.score;
            }
        }
    }

    checkCollision(obstacle) {
        return (
            this.player.x < obstacle.x + obstacle.size &&
            this.player.x + this.player.size > obstacle.x &&
            this.player.y < obstacle.y + obstacle.size &&
            this.player.y + this.player.size > obstacle.y
        );
    }

    gameOver() {
        this.isRunning = false;
        document.getElementById('restartButton').style.display = 'block';
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);

        // Draw obstacles
        this.ctx.fillStyle = '#ff0000';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        });
    }

    gameLoop() {
        if (!this.isRunning) return;

        if (Math.random() < 0.02) {
            this.createObstacle();
        }

        this.updateObstacles();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new Game();
});
