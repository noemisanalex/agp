import React from 'react';
import useContainers from './hooks/useContainers';

export default function Services() {
  const data = useContainers();

  const containers = data?.containers ?? [];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold text-green-400 mb-4">Servicios Docker Activos</h1>

      {!data ? (
        <p className="text-gray-400">⏳ Cargando contenedores...</p>
      ) : !Array.isArray(containers) || containers.length === 0 ? (
        <p className="text-red-400">⚠️ No hay contenedores activos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="p-3">#</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((container, index) => (
                <tr key={container.name} className="hover:bg-gray-800 transition">
                  <td className="p-3 text-gray-400">{index + 1}</td>
                  <td className="p-3 font-medium text-white">{container.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      container.status?.toLowerCase().includes('up')
                        ? 'bg-green-700 text-green-200'
                        : 'bg-red-700 text-red-200'
                    }`}>
                      {container.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.timestamp && (
        <p className="text-gray-500 text-sm mt-4">
          Última actualización: {new Date(data.timestamp).toLocaleString()}
        </p>
      )}
    </div>
  );
}
