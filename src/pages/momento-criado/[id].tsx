import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { getPetById } from '../../utils/localStorageUtils';

export default function MomentoCriado() {
  const router = useRouter();
  const { id } = router.query;
  const [petData, setPetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchPetData = async () => {
      try {
        // Buscar o pet do armazenamento local
        const pet = getPetById(id as string);
        
        if (pet) {
          setPetData(pet);
        } else {
          setError('Momento não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar dados do pet:', err);
        setError('Erro ao carregar dados do momento');
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${petData.name}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const viewUrl = `/visualizar/${id}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Link href="/" passHref>
            <div className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer">
              Voltar para a página inicial
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12">
      <Head>
        <title>Momento Criado | Memórias de Pets</title>
        <meta name="description" content="Seu momento foi criado com sucesso" />
      </Head>

      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-indigo-700 mb-4">Momento Criado com Sucesso!</h1>
            
            <p className="text-gray-700 mb-8">
              O momento especial com {petData?.name} foi registrado. Agora você pode compartilhar ou visualizar este momento especial.
            </p>

            <div className="flex flex-col items-center justify-center mb-8">
              <div className="p-4 bg-white rounded-lg shadow-md mb-4">
                <QRCode 
                  id="qrcode"
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}${viewUrl}`} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Escaneie o QR code acima para visualizar o momento ou use os botões abaixo
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleDownloadQRCode}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Baixar QR Code
                </button>
                <Link href={viewUrl} passHref>
                  <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center cursor-pointer">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Visualizar Momento
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/" passHref>
                <div className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                  Voltar para a página inicial
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
