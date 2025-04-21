import React, { useEffect, useRef } from 'react';

const ParticulasPremium = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Posición del ratón
    const mouse = {
      x: undefined,
      y: undefined,
      radius: 150 // Radio de influencia del ratón
    };
    
    // Ajustar tamaño del canvas al tamaño de la ventana
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    
    // Captura movimiento del ratón
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    
    // Eventos de ratón
    window.addEventListener('mousemove', handleMouseMove);
    
    // Configuración de partículas
    const particlesArray = [];
    const numberOfParticles = 130;
    
    // Colores para partículas - solo azules y celestes
    const colors = [
      'rgba(52, 152, 219, 0.7)',  // Azul claro
      'rgba(41, 128, 185, 0.7)',  // Azul medio
      'rgba(30, 144, 255, 0.7)',  // Azul brillante
      'rgba(0, 191, 255, 0.7)',   // Celeste brillante
      'rgba(65, 105, 225, 0.7)',  // Azul real
      'rgba(100, 149, 237, 0.7)', // Azul acero claro
      'rgba(135, 206, 235, 0.8)', // Celeste cielo
      'rgba(135, 206, 250, 0.8)'  // Celeste cielo claro
    ];
    
    // Clase para partículas
    class Particle {
      constructor() {
        // Inicialización
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.baseSize = this.size; // Tamaño original para referencia
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.baseSpeedX = this.speedX; // Velocidad original para referencia
        this.baseSpeedY = this.speedY;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shadowBlur = Math.random() * 15 + 5;
        
        // Propiedades de chispazo
        this.glowIntensity = 0;
        this.glowing = false;
        this.glowSpeed = Math.random() * 0.1 + 0.05;
        
        // Propiedades para comportamiento inteligente
        this.influenced = false;     // Si está bajo influencia del ratón
        this.targetX = this.x;       // Coordenada objetivo X para patrones inteligentes
        this.targetY = this.y;       // Coordenada objetivo Y para patrones inteligentes
        this.forceFactor = 0.05;     // Qué tan fuerte es atraído/repelido
        this.inFormation = false;    // Si forma parte de una estructura
        this.formationID = -1;       // Qué estructura sigue
        this.formationOffset = { x: 0, y: 0 }; // Offset dentro de la formación
      }
      
      update() {
        // Comportamiento predeterminado - movimiento normal
        if (!this.influenced && !this.inFormation) {
          this.x += this.speedX;
          this.y += this.speedY;
          
          // Rebotar en los bordes
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        // Comportamiento bajo influencia del ratón
        if (this.influenced) {
          // Comprobar distancia al ratón
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Determinar si debería formar parte de una estructura
            if (!this.inFormation && Math.random() < 0.01) {
              this.joinFormation();
            }
            
            // Comportamiento de atracción o repulsión al ratón
            const force = (mouse.radius - distance) / mouse.radius;
            
            // Si está formando una estructura, tiene comportamiento especial
            if (this.inFormation) {
              // Mover hacia la posición en la formación relativa al ratón
              this.targetX = mouse.x + this.formationOffset.x;
              this.targetY = mouse.y + this.formationOffset.y;
              
              this.x += (this.targetX - this.x) * this.forceFactor * 2;
              this.y += (this.targetY - this.y) * this.forceFactor * 2;
              
              // Activar brillo en formación
              if (!this.glowing && Math.random() < 0.1) {
                this.glowing = true;
              }
            } else {
              // Comportamiento de swarming - se acercan pero mantienen distancia
              if (distance > 50) {
                // Atraer hacia el cursor
                this.x += dx * force * 0.03;
                this.y += dy * force * 0.03;
              } else {
                // Repeler si está demasiado cerca
                this.x -= dx * 0.05;
                this.y -= dy * 0.05;
              }
            }
          } else {
            // Fuera del radio de influencia, volver gradualmente al comportamiento normal
            this.leaveFormation();
            this.influenced = false;
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
          }
        } else {
          // Comprobar si entra en el radio de influencia del ratón
          if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
              this.influenced = true;
            }
          }
        }
        
        // Actualizar efecto de brillo/chispazo
        if (this.glowing) {
          this.glowIntensity += this.glowSpeed;
          if (this.glowIntensity >= 1) {
            this.glowing = false;
          }
        } else {
          this.glowIntensity -= this.glowSpeed;
          if (this.glowIntensity <= 0) {
            this.glowIntensity = 0;
            // Pequeña probabilidad de iniciar un chispazo
            if (Math.random() < 0.005) {
              this.glowing = true;
            }
          }
        }
      }
      
      // Unirse a una formación inteligente
      joinFormation() {
        this.inFormation = true;
        // Asignar a una formación aleatoria - formas posibles
        this.formationID = Math.floor(Math.random() * 4); // 0-3 patrones diferentes
        
        // Calcular offset según el patrón
        switch(this.formationID) {
          case 0: // Círculo
            const angle = Math.random() * Math.PI * 2;
            const radius = 30 + Math.random() * 40;
            this.formationOffset = {
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius
            };
            break;
          case 1: // Cuadrícula
            this.formationOffset = {
              x: (Math.floor(Math.random() * 5) - 2) * 20,
              y: (Math.floor(Math.random() * 5) - 2) * 20
            };
            break;
          case 2: // Espiral
            const spiralAngle = Math.random() * Math.PI * 4;
            const spiralDistance = spiralAngle * 2;
            this.formationOffset = {
              x: Math.cos(spiralAngle) * spiralDistance,
              y: Math.sin(spiralAngle) * spiralDistance
            };
            break;
          case 3: // Estrella
            const starAngle = Math.floor(Math.random() * 5) * (Math.PI * 2 / 5);
            const starDistance = 50;
            this.formationOffset = {
              x: Math.cos(starAngle) * starDistance,
              y: Math.sin(starAngle) * starDistance
            };
            break;
        }
        
        // Aumentar tamaño y brillo en formación
        this.size = this.baseSize * 1.5;
        this.glowing = true;
      }
      
      // Salir de la formación
      leaveFormation() {
        if (this.inFormation) {
          this.inFormation = false;
          this.size = this.baseSize;
          this.formationID = -1;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (1 + this.glowIntensity * 0.5), 0, Math.PI * 2);
        
        // Color base con efecto de brillo
        let alpha = 0.7;
        // Brillo extra para partículas en formación
        if (this.inFormation) {
          alpha = 0.8 + (this.glowIntensity * 0.2);
        } else {
          alpha = 0.7 + (this.glowIntensity * 0.3);
        }
        
        const baseColor = this.color.replace(/[^,]+\)/, `${alpha})`);
        ctx.fillStyle = baseColor;
        
        // Brillo más intenso cuando hay chispazo
        ctx.shadowColor = this.color.replace(/[^,]+\)/, '1)');
        ctx.shadowBlur = this.shadowBlur + (this.glowIntensity * 15);
        
        ctx.fill();
        ctx.closePath();
      }
    }
    
    // Crear partículas
    const createParticles = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    // Dibujar conexiones entre partículas cercanas con efecto de chispazo
    const drawConnections = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Conexiones más dinámicas basadas en estado
          let maxDistance = 100;
          
          // Aumentar distancia de conexión para partículas influenciadas
          if (particlesArray[a].influenced || particlesArray[b].influenced) {
            maxDistance = 120;
          }
          
          // Conexión especial para partículas de la misma formación
          if (particlesArray[a].inFormation && particlesArray[b].inFormation && 
              particlesArray[a].formationID === particlesArray[b].formationID) {
            maxDistance = 150;
          }
          
          if (distance < maxDistance) {
            // La opacidad depende de la distancia
            const opacity = 1 - distance / maxDistance;
            
            // El grosor de línea depende de la intensidad de brillo y estado
            let lineWidthFactor = 0.2;
            if (particlesArray[a].inFormation && particlesArray[b].inFormation && 
                particlesArray[a].formationID === particlesArray[b].formationID) {
              lineWidthFactor = 0.6; // Líneas más gruesas para formaciones
            }
            
            const combinedGlow = particlesArray[a].glowIntensity + particlesArray[b].glowIntensity;
            const lineWidth = lineWidthFactor + (combinedGlow * 1.5);
            
            // Si alguna de las partículas está brillando, la línea brilla más
            const glowEffect = Math.max(particlesArray[a].glowIntensity, particlesArray[b].glowIntensity);
            
            // Color de líneas especial para formaciones
            let lineColor;
            if (particlesArray[a].inFormation && particlesArray[b].inFormation && 
                particlesArray[a].formationID === particlesArray[b].formationID) {
              // Colores basados en el ID de formación
              switch(particlesArray[a].formationID) {
                case 0: // Círculo - azul brillante
                  lineColor = `rgba(30, 144, 255, ${(opacity * 0.6) + (glowEffect * 0.4)})`;
                  break;
                case 1: // Cuadrícula - celeste
                  lineColor = `rgba(0, 191, 255, ${(opacity * 0.6) + (glowEffect * 0.4)})`;
                  break;
                case 2: // Espiral - azul eléctrico
                  lineColor = `rgba(65, 105, 225, ${(opacity * 0.6) + (glowEffect * 0.4)})`;
                  break;
                case 3: // Estrella - azul brillante
                  lineColor = `rgba(135, 206, 250, ${(opacity * 0.6) + (glowEffect * 0.4)})`;
                  break;
                default:
                  lineColor = `rgba(135, 206, 250, ${(opacity * 0.4) + (glowEffect * 0.6)})`;
              }
            } else {
              // Conexión normal
              lineColor = `rgba(135, 206, 250, ${(opacity * 0.3) + (glowEffect * 0.7)})`;
            }
            
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
            ctx.closePath();
            
            // Añadir efecto de chispazo entre partículas
            if (combinedGlow > 1.2 || 
                (particlesArray[a].inFormation && particlesArray[b].inFormation && 
                 particlesArray[a].formationID === particlesArray[b].formationID && Math.random() < 0.05)) {
              
              // Posición intermedia para el chispazo
              const midX = (particlesArray[a].x + particlesArray[b].x) / 2;
              const midY = (particlesArray[a].y + particlesArray[b].y) / 2;
              
              // Dibujar pequeño destello
              const sparkSize = combinedGlow * 2 + (particlesArray[a].inFormation ? 1 : 0);
              const sparkGradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, sparkSize * 4);
              sparkGradient.addColorStop(0, 'rgba(255, 255, 255, ' + combinedGlow * 0.7 + ')');
              sparkGradient.addColorStop(0.5, 'rgba(160, 220, 255, ' + combinedGlow * 0.3 + ')');
              sparkGradient.addColorStop(1, 'rgba(135, 206, 250, 0)');
              
              ctx.beginPath();
              ctx.fillStyle = sparkGradient;
              ctx.arc(midX, midY, sparkSize * 4, 0, Math.PI * 2);
              ctx.fill();
              ctx.closePath();
            }
          }
        }
      }
    };
    
    // Visualizar el radio de influencia del cursor
    const drawMouseInfluence = () => {
      if (mouse.x === undefined || mouse.y === undefined) return;
      
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.05)');
      gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    };
    
    // Función de animación
    const animate = () => {
      // Efecto de desvanecimiento sutil
      ctx.fillStyle = 'rgba(10, 15, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Visualizar área de influencia del ratón
      drawMouseInfluence();
      
      // Actualizar y dibujar partículas
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Dibujar conexiones con efecto de chispazo
      drawConnections();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
      style={{ 
        background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
        pointerEvents: 'none' 
      }}
    />
  );
};

export default ParticulasPremium;