import React, { useRef } from "react";

const FeatureModal = ({ feature, onClose }) => {
  const modalContentRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-lg px-4 cursor-pointer bg-transparent"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalContentRef}
        className="relative **bg-transparent** rounded-2xl max-w-xl w-full shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`/imagenes/${feature.image}`}
          alt={feature.title}
          className="w-full rounded-2xl border border-white/10 shadow-md max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
};

export default FeatureModal;