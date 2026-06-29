export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8">
      <div className="max-w-4xl mx-auto text-center mt-20 space-y-6">
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Em breve
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          O cardápio mais gostoso da região está chegando! 🍕🧁
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Prepare o seu paladar. Em breve você poderá fazer seus pedidos de doces e salgados direto por aqui.
        </p>
      </div>
    </main>
  );
}
