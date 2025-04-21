import { useEffect, useState } from 'react';

export default function useStatus() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => {
        console.error('Error al cargar estado:', err);
        setData(null);
      });
  }, []);

  return data;
}
