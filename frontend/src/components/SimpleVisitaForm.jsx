
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import * as XLSX from 'xlsx'; // Importación corregida aquí

const SimpleVisitaForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '', 
    email: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createExcelFile = (data) => {
    try {
      const ws = XLSX.utils.json_to_sheet([
        {
          Nombre: data.nombre,
          Teléfono: data.telefono,
          Email: data.email,
          Mensaje: data.mensaje,
          Fecha: new Date().toLocaleString()
        }
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Solicitud");
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return blob;
    } catch (error) {
      console.error("Error al crear archivo Excel:", error);
      return null;
    }
  };

  const createCSV = (data) => {
    const headers = ['Nombre', 'Teléfono', 'Email', 'Mensaje', 'Fecha'];
    const dataRow = [
      data.nombre,
      data.telefono,
      data.email,
      data.mensaje,
      new Date().toLocaleString()
    ];
    const csvContent = 
      headers.join(',') + '\n' + 
      dataRow.map(item => `"${item}"`).join(',');
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  };

  const sendToN8N = async (data) => {
    const urls = [
      "https://n8n.autogestionpro.com/webhook/nueva-visita",
      "http://localhost:5678/webhook/nueva-visita"
    ];
    for (const url of urls) {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.warn(`❌ Error con ${url}:`, err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formAction = "https://formsubmit.co/contacto@autogestionpro.com";
      const tempForm = document.createElement('form');
      tempForm.action = formAction;
      tempForm.method = 'POST';
      tempForm.enctype = 'multipart/form-data';
      tempForm.style.display = 'none';

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        tempForm.appendChild(input);
      });

      const configFields = {
        '_subject': `Nueva solicitud de visita de ${formData.nombre}`,
        '_captcha': 'false',
        '_template': 'table',
        '_next': window.location.href
      };

      Object.entries(configFields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        tempForm.appendChild(input);
      });

      try {
        let fileBlob;
        if (typeof XLSX !== 'undefined') {
          fileBlob = createExcelFile(formData);
        } else {
          fileBlob = createCSV(formData);
        }

        if (fileBlob) {
          const fileName = `solicitud_${formData.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.xlsx`;
          const file = new File([fileBlob], fileName, { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });

          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.name = 'attachment';
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          tempForm.appendChild(fileInput);
        }
      } catch (fileError) {
        console.error("Error al adjuntar archivo:", fileError);
      }

      await sendToN8N(formData);
      document.body.appendChild(tempForm);
      tempForm.submit();

      const existingData = JSON.parse(localStorage.getItem('visitaRequests') || '[]');
      localStorage.setItem('visitaRequests', JSON.stringify([
        ...existingData, 
        { ...formData, fecha: new Date().toISOString() }
      ]));

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setError('Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-md relative animate-fade-in-up shadow-xl border border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition" aria-label="Cerrar">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Solicitar Visita
        </h2>
        {success ? (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4 text-center">
            <p className="text-green-300 font-medium mb-1">¡Solicitud enviada con éxito!</p>
            <p className="text-green-200 text-sm">Nos pondremos en contacto contigo lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-300 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            <div>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <textarea name="mensaje" value={formData.mensaje} onChange={handleChange}
                placeholder="¿En qué podemos ayudarte? (opcional)" rows="2"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none">
              </textarea>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send size={16} className="mr-2" />Enviar solicitud
                  </span>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs text-center pt-2">
              Te contactaremos lo antes posible para agendar una visita personalizada.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SimpleVisitaForm;
