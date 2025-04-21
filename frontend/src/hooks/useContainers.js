import { useEffect, useState } from 'react';

export default function useContainers() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/containers')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.error('Error al cargar contenedores:', err);
        setData(null);
      });
  }, []);

  return data;
}
