import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full px-6 py-8 text-center text-sm bg-gray-900/80 backdrop-blur-md border-t border-blue-600/30 shadow-inner">
      {/* Redes sociales */}
      <div className="flex justify-center gap-5 mb-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
          <i className="fab fa-facebook-f text-[#1877F2] hover:scale-125 transition-transform duration-300"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
          <i className="fab fa-youtube text-[#FF0000] hover:scale-125 transition-transform duration-300"></i>
        </a>
        <a href="https://wa.me/618779308" target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <i className="fab fa-whatsapp text-[#25D366] hover:scale-125 transition-transform duration-300"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
          <i className="fab fa-instagram text-[#E4405F] hover:scale-125 transition-transform duration-300"></i>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <i className="fab fa-linkedin-in text-[#0A66C2] hover:scale-125 transition-transform duration-300"></i>
        </a>
      </div>

      {/* Email de contacto */}
      <div className="mb-1">
        <a
          href="mailto:contacto@autogestionpro.com"
          className="text-blue-400 text-sm hover:underline transition-all"
        >
          contacto@autogestionpro.com
        </a>
      </div>

      {/* Derechos reservados */}
      <p className="text-xs text-gray-400">© 2025 AutogestiónPro.</p>
    </footer>
  );
}