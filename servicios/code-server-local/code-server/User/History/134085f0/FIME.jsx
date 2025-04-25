import React from "react";
import { useVisita } from "../context/VisitaContext";

const Features = () => {
  const { openVisita } = useVisita();
  
  // Función segura para abrir el formulario de visita
  const handleOpenVisita = () => {
    try {
      if (typeof openVisita === 'function') {
        openVisita();
      } else {
        console.error("La función openVisita no está disponible");
        alert("Error al abrir el formulario. Por favor, inténtelo de nuevo o contáctenos por WhatsApp.");
      }
    } catch (error) {
      console.error("Error al abrir el formulario de visita:", error);
      alert("Error al abrir el formulario. Por favor, inténtelo de nuevo.");
    }
  };

  const features = [
    { 
      icon: "🤖", 
      title: "Automatización", 
      desc: "Reduce errores y aumenta la eficiencia con procesos automatizados que liberan a tu equipo de tareas repetitivas."
    },
    { 
      icon: "🧠", 
      title: "Inteligencia Artificial", 
      desc: "Analiza datos en tiempo real y toma decisiones inteligentes basadas en algoritmos avanzados de aprendizaje."
    },
    { 
      icon: "📊", 
      title: "Analytics", 
      desc: "Monitorea el rendimiento con dashboards personalizados que te muestran métricas clave para tu negocio."
    },
    { 
      icon: "👥", 
      title: "Gestión de Clientes", 
      desc: "Mantén una relación cercana con tus clientes a través de comunicaciones automatizadas y personalizadas."
    },
    { 
      icon: "⚙️", 
      title: "Integración Total", 
      desc: "Conecta con todas tus aplicaciones y servicios existentes para un flujo de trabajo sin interrupciones."
    },
    { 
      icon: "🔒", 
      title: "Seguridad Avanzada", 
      desc: "Protege tus datos y los de tus clientes con las últimas tecnologías en seguridad informática."
    }
  ];

  return (
    <section className="py-12 bg-gray-900/40 backdrop-blur-sm relative z-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-300 mb-8">
          Da el primer paso hacia la automatización
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6 text-center hover:bg-gray-800/80 transition-colors duration-300 transform hover:scale-105 shadow-lg border border-blue-900/30"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">{feature.title}</h3>
              <p className="text-gray-200 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Llamada a la acción */}
        <div className="mt-12 text-center">
          <p className="text-white text-lg mb-4">
            Optimiza tus procesos empresariales con nuestra avanzada plataforma de gestión
          </p>
          <button
            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
            onClick={handleOpenVisita}
          >
            Solicitar Demostración
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;