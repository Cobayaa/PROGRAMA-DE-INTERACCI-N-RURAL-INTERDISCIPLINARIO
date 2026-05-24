import { useState, useEffect } from 'react'
import "../index.css"

const Contact = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="bg-white font-Raleway py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-40 h-10 bg-gray-200 animate-pulse mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-32 h-6 bg-gray-200 animate-pulse mb-6"></div>
              <div className="space-y-4 mb-8">
                <div className="w-full h-12 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-12 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-12 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 animate-pulse"></div>
              </div>
            </div>

            <div>
              <div className="w-32 h-6 bg-gray-200 animate-pulse mb-6"></div>
              <div className="space-y-3 mb-8">
                <div className="w-full h-16 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-16 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-16 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white justify-center pt-10 align-center font-Raleway">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal text-gray-900 tracking-wide">Contacto</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-6">Envíanos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Nombre completo"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-white"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-white"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Teléfono"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-white"
                />
              </div>
              <div>
                <textarea 
                  rows={5}
                  placeholder="Mensaje"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-white"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-6">Información de contacto</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Dirección</h3>
                <p className="text-gray-800">Calle Principal<br />Ciudad, País</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Teléfono</h3>
                <p className="text-gray-800">+57 23e3890</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Correo electrónico</h3>
                <p className="text-gray-800">info@piasda</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Horario de atención</h3>
                <p className="text-gray-800">Lunes a Viernes<br />8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact