import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSound from '../hooks/useSound';
import { XCircle } from 'lucide-react';

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const userInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const firstFocus = useRef(false);
  const modalRef = useRef(null);

  const {
    playClickSound,
    playLoginSound,
    playErrorSound,
    playHoverSound
  } = useSound();

  useEffect(() => {
    if (!firstFocus.current) {
      userInputRef.current?.focus();
      firstFocus.current = true;
    }
    playClickSound();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
    firstFocus.current = false;
  };

  const handleLogin = () => {
    const user = username.trim().toLowerCase();
    const pass = password.trim();

    if (user === 'admin' && pass === '1234') {
      setError('');
      try {
        localStorage.setItem('token', 'ok');
        playLoginSound();
        setTimeout(() => {
          window.location.href = '/dashboard/home';
        }, 300);
      } catch (err) {
        console.error("Error durante el login:", err);
        setError('Error al iniciar sesión');
      }
    } else {
      playErrorSound();
      setError('Credenciales incorrectas');
      passwordInputRef.current?.focus();
    }
  };

  const handleClose = () => {
    playClickSound();
    resetForm();
    if (onClose) onClose();
  };

  return (
    <div
      ref={modalRef}
      className="relative w-80 sm:w-96 bg-gray-900/80 backdrop-blur-md border border-blue-500/30 text-white rounded-2xl shadow-2xl p-6 animate-fade-in"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-400">Iniciar Sesión</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-red-400 transition-colors"
          title="Cerrar"
        >
          <XCircle size={28} />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 text-sm rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Usuario</label>
          <input
            ref={userInputRef}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="admin"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                passwordInputRef.current?.focus();
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Contraseña</label>
          <input
            ref={passwordInputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="1234"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
        </div>

        <div className="flex justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={handleLogin}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-colors font-semibold"
            onMouseEnter={playHoverSound}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors font-semibold"
            onMouseEnter={playHoverSound}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
