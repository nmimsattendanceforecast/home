class WeatherSystem {
    constructor() {
        this.canvas = document.getElementById('weather-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.lightningTimer = 0;
        this.isStormy = false;
        this.weatherState = 'sun'; // sun, rain, storm
        this.stateTimer = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();

        // Cycle weather every 10 seconds for demo
        setInterval(() => {
            const states = ['sun', 'rain', 'storm'];
            const next = states[(states.indexOf(this.weatherState) + 1) % states.length];
            this.setWeather(next);
        }, 8000);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.initParticles();
    }

    setWeather(state) {
        this.weatherState = state;
        this.particles = []; // Reset particles
        this.initParticles();
        console.log("Weather changed to:", state);
    }

    initParticles() {
        const count = this.weatherState === 'sun' ? 50 : 200;
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        if (this.weatherState === 'sun') {
            return {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5
            };
        } else {
            // Rain/Storm
            return {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                length: Math.random() * 20 + 10,
                speedY: Math.random() * 10 + 15,
                speedX: (Math.random() - 0.5) * 2
            };
        }
    }

    drawSun() {
        // glowing orb effect
        const gradient = this.ctx.createRadialGradient(
            this.width * 0.8, this.height * 0.1, 0,
            this.width * 0.8, this.height * 0.1, 400
        );
        gradient.addColorStop(0, 'rgba(255, 200, 50, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Gentle particles
        this.ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
        });
    }

    drawRain() {
        this.ctx.strokeStyle = this.weatherState === 'storm' ? 'rgba(180, 200, 255, 0.5)' : 'rgba(174, 194, 224, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        this.particles.forEach(p => {
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.speedX, p.y + p.length);

            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y > this.height) {
                p.y = -p.length;
                p.x = Math.random() * this.width;
            }
        });
        this.ctx.stroke();

        if (this.weatherState === 'storm') {
            this.handleLightning();
        }
    }

    handleLightning() {
        if (Math.random() > 0.98) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.weatherState === 'sun') {
            this.drawSun();
        } else {
            this.drawRain();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Init when loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherSystem();
});
