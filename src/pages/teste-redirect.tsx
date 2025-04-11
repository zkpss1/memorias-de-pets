import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TesteRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Testar redirecionamento após 3 segundos
    const timer = setTimeout(() => {
      console.log('Tentando redirecionar...');
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Teste de Redirecionamento</h1>
        <p className="text-gray-700 mb-4">Você será redirecionado em 3 segundos...</p>
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
