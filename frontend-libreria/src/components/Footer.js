export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white text-center p-4 mt-6 text-sm">
        <p>&copy; {new Date().getFullYear()} Libros Mágicos. Todos los derechos reservados. Marca registrada.</p>
      </footer>
    );
  }