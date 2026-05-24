import { useState, useEffect } from "react";
import "../index.css";

const Whoweare = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-48 h-10 bg-gray-200 animate-pulse mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="w-24 h-7 bg-gray-200 animate-pulse mb-6"></div>
              <div className="space-y-4">
                <div className="w-full h-20 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-24 bg-gray-200 animate-pulse"></div>
                <div className="w-11/12 h-16 bg-gray-200 animate-pulse"></div>
              </div>
            </div>

            <div>
              <div className="w-24 h-7 bg-gray-200 animate-pulse mb-6"></div>
              <div className="space-y-4">
                <div className="w-full h-20 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-24 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-20 px-8 font-Raleway">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal text-black">Quiénes Somos</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-normal text-gray-800 mb-6 tracking-wide">Misión</h2>
            <div className="text-black text-base leading-relaxed space-y-4">
              <p>
                El Programa Interdisciplinario Rural de Interacción – PIRI es una metodología de Responsabilidad Social Universitaria que acerca la academia a los territorios, llevando el conocimiento al encuentro con las realidades de las comunidades rurales e indígenas.
              </p>
              <p>
                A través del trabajo interdisciplinario entre estudiantes, docentes y actores del territorio, PIRI promueve espacios de diálogo de saberes, donde el conocimiento académico se complementa con los saberes propios de las comunidades para construir, de manera conjunta, soluciones pertinentes a sus necesidades.
              </p>
              <p>
                Más que intervenir, PIRI busca comprender, acompañar y aportar a los procesos comunitarios, fortaleciendo capacidades locales, el cuidado del entorno y el bienestar colectivo.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-normal text-gray-800 mb-6 tracking-wide">Visión</h2>
            <div className="text-black text-base leading-relaxed space-y-4">
              <p>
                Para el año 2030, el Programa Interdisciplinario Rural de Interacción – PIRI será reconocido como una metodología institucional de referencia en la región amazónica por su capacidad de llevar la academia a los territorios y generar procesos de transformación social desde el diálogo de saberes.
              </p>
              <p>
                Se consolidará como una estrategia clave de Responsabilidad Social Universitaria que fortalece la formación integral de los estudiantes, promoviendo profesionales comprometidos con su contexto, y aportando a la construcción de soluciones sostenibles, inclusivas y respetuosas de la diversidad cultural y ambiental.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whoweare;