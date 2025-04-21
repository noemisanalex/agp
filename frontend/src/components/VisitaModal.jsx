// VisitaModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";
import useSound from "../hooks/useSound";
import { useToast } from "../context/ToastContext";

export default function VisitaModal({ visible, onClose }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const nombreRef = useRef(null);

  const {
    playClickSound,
    playHoverSound,
    playNotificationSound,
    playErrorSound,
  } = useSound();

  const { showToast } = useToast();

  useEffect(() => {
    if (visible) {
      setTimeout(() => nombreRef.current?.focus(), 100);
    }
  }, [visible]);

  if (!visible) return null;

  const handleEnviar = async () => {
    if (!nombre || !telefono || !correo || !comentario) {
      playErrorSound();
      showToast("Por favor, completa todos los campos.", "error");
      return;
    }

    setEnviando(true);

    try {
      const response = await fetch("https://n8n.autogestionpro.com/webhook/solicitar-visita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          email: correo, // Usamos "email" como nombre de campo para que coincida con n8n
          mensaje: comentario, // Usamos "mensaje" como nombre de campo para que coincida con n8n
          fecha: new Date().toLocaleString(), // Formato legible
        }),
      });

      if (!response.ok) throw new Error("Error al enviar la solicitud");

      playNotificationSound("success");
      showToast("✅ Solicitud enviada correctamente", "success");
      onClose();
      
      // Resetear el formulario
      setNombre("");
      setTelefono("");
      setCorreo("");
      setComentario("");
    } catch (error) {
      playErrorSound();
      showToast("❌ Error al enviar la solicitud", "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-11/12 max-w-md bg-gray-900/90 border border-blue-500/30 text-white rounded-2xl shadow-2xl p-6 animate-fade-in space-y-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white">Solicitar Visita</h2>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="text-white hover:text-red-400 transition-colors"
            title="Cerrar"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <input
            ref={nombreRef}
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <textarea
            placeholder="¿En qué podemos ayudarte?"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            onMouseEnter={playHoverSound}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
              enviando ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={handleEnviar}
            onMouseEnter={playHoverSound}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}