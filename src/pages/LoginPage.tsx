import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('traffic123');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  // Canvas background animation for floating translucent black dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const numParticles = 40;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, // slow speed
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 4 + 2, // size between 2 and 6px
        opacity: Math.random() * 0.15 + 0.05 // translucent opacity
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`; // black dots
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#070D14', // sleek dark theme background for login
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Dynamic Animated Particle Canvas (translucent black dots background) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Translucent background logo behind the login window */}
      <div style={{
        position: 'absolute',
        width: 'min(640px, 90vw)',
        height: 'min(640px, 90vw)',
        opacity: 0.08, // translucent
        zIndex: 1,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'blur(1px)'
      }}>
        <img src={logo} alt="Translucent Background Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '380px',
        padding: '40px 32px',
        background: 'rgba(19, 31, 43, 0.75)', // translucent/glassmorphic dark
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <img src={logo} alt="Traffic Saarthi Logo" style={{ width: '64px', height: '64px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Traffic Saarthi</h2>
          <p style={{ fontSize: '12px', color: '#8896A5', marginTop: '6px', marginBottom: 0 }}>Bengaluru Traffic Police Command Center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8896A5', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="user1"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(12, 18, 25, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#2E86C1'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8896A5', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(12, 18, 25, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#2E86C1'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {error && (
            <div style={{ fontSize: '12px', color: '#B03A2E', background: 'rgba(176,58,46,0.15)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(176,58,46,0.25)' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '12px',
              background: '#2E86C1',
              border: 'none',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1F51C6'}
            onMouseLeave={e => e.currentTarget.style.background = '#2E86C1'}
          >
            Access Command Center
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#4A5568', marginTop: '8px' }}>
          Restricted access for authorized personnel only
        </div>
      </div>
    </div>
  );
}
