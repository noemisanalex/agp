import React, { useEffect, useRef } from 'react';

const ParticulasPremium = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Asegurar que el canvas ocupe todo el espacio disponible
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerar partículas cuando se redimensiona
      initParticles();
    };
    
    // Inicializar partículas
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 9000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(${Math.floor(Math.random() * 100) + 155}, 
                       ${Math.floor(Math.random() * 100) + 155}, 
                       ${Math.floor(Math.random() * 100) + 155}, 
                       ${Math.random() * 0.5 + 0.3})`,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseDirection: 1,
          pulseValue: 0
        });
      }
    };
    
    // Dibujar una partícula
    const drawParticle = (particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * (1 + 0.3 * Math.sin(particle.pulseValue)), 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Actualizar el valor de pulsación
      particle.pulseValue += particle.pulseSpeed * particle.pulseDirection;
      
      // Dibujar brillo
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };
    
    // Dibujar líneas entre partículas cercanas
    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(150, 200, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };
    
    // Actualizar animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Procesar cada partícula
      particles.forEach(particle => {
        // Actualizar posición
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Dibujar la partícula
        drawParticle(particle);
      });
      
      // Dibujar conexiones entre partículas
      drawConnections();
      
      // Continuar la animación
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Inicializar
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ParticulasPremium;