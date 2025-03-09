"use client";

export default function LocalesPage() {
  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-black-100">
      <h1 className="text-4xl text-gray font-bold mb-6">📍 Nuestras Sucursales</h1>
      <p className="text-lg text-white-700 mb-6 text-center max-w-2xl">
        Visítanos en cualquiera de nuestras sucursales en la Ciudad Autónoma de Buenos Aires. ¡Te esperamos!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-black font-semibold mb-2">📍 Centro</h2>
          <p className="text-gray-600">Av. Corrientes 1234, CABA</p>
          <p className="text-gray-500">Lunes a Sábados de 10 a 20 hs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-black font-semibold mb-2">📍 Palermo</h2>
          <p className="text-gray-600">Calle Armenia 5678, CABA</p>
          <p className="text-gray-500">Lunes a Domingos de 11 a 21 hs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-black font-semibold mb-2">📍 Belgrano</h2>
          <p className="text-gray-600">Av. Cabildo 910, CABA</p>
          <p className="text-gray-500">Lunes a Sábados de 9 a 19 hs</p>
        </div>
      </div>
    </div>
  );
}