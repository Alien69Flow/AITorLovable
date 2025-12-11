import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  drift: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];
    const nebulae: Nebula[] = [];
    const particles: Particle[] = [];
    const numStars = 300;
    const numNebulae = 5;
    const maxParticles = 50;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.3,
          speed: Math.random() * 0.3 + 0.05,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const initNebulae = () => {
      nebulae.length = 0;
      const colors = [
        'rgba(0, 200, 100, 0.15)',   // Green
        'rgba(255, 215, 0, 0.12)',    // Gold
        'rgba(0, 150, 80, 0.1)',      // Dark green
        'rgba(180, 150, 50, 0.08)',   // Muted gold
        'rgba(50, 180, 120, 0.1)',    // Teal green
      ];
      for (let i = 0; i < numNebulae; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 300 + 150,
          color: colors[i % colors.length],
          opacity: Math.random() * 0.5 + 0.3,
          drift: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const spawnParticle = () => {
      if (particles.length < maxParticles && Math.random() < 0.1) {
        const isGold = Math.random() > 0.5;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: isGold ? 'rgba(255, 215, 0,' : 'rgba(0, 200, 100,',
          life: 0,
          maxLife: Math.random() * 300 + 200,
        });
      }
    };

    const drawNebulae = () => {
      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Slow drift
        nebula.x += nebula.drift;
        nebula.y += nebula.drift * 0.5;
        
        // Wrap around
        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
        if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;
      });
    };

    const drawStars = () => {
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Mix of gold and green stars
        const isGold = star.size > 1.5;
        const color = isGold 
          ? `rgba(255, 215, 0, ${star.opacity})`
          : `rgba(200, 255, 200, ${star.opacity})`;
        ctx.fillStyle = color;
        ctx.fill();

        // Add glow effect for larger stars
        if (star.size > 1.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          const glowColor = isGold 
            ? `rgba(255, 215, 0, ${star.opacity * 0.3})`
            : `rgba(0, 200, 100, ${star.opacity * 0.3})`;
          ctx.fillStyle = glowColor;
          ctx.fill();
        }

        // Twinkle effect
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        // Slow movement
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
    };

    const drawParticles = () => {
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        const lifeRatio = 1 - particle.life / particle.maxLife;
        const currentOpacity = particle.opacity * lifeRatio;

        // Particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `${particle.color}${currentOpacity})`);
        gradient.addColorStop(1, `${particle.color}0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${currentOpacity})`; 
        ctx.fill();

        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particles.splice(index, 1);
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawNebulae();
      drawStars();
      spawnParticle();
      drawParticles();

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initStars();
    initNebulae();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initStars();
      initNebulae();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        background: 'radial-gradient(ellipse at center, hsl(140, 30%, 8%) 0%, hsl(220, 25%, 4%) 100%)' 
      }}
    />
  );
}
