import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import { startTimeCounter } from '../../utils/timeUtils';
import { getPetById } from '../../utils/localStorageUtils';

// Estendendo o dayjs com plugins necessários
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

// Componente de coração flutuante
const FloatingHeart = ({ x, delay, duration }: { x: number; delay: number; duration: number }) => {
  return (
    <motion.div
      className="absolute text-2xl"
      initial={{ y: 0, x, opacity: 0 }}
      animate={{ y: -150, opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: "easeOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      style={{ bottom: `${Math.random() * 100}%`, left: `${x}%` }}
    >
      ❤️
    </motion.div>
  );
};

// Componente para renderizar múltiplos corações
const FloatingHearts = () => {
  // Gerar posições aleatórias para os corações
  const hearts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // posição horizontal aleatória
    delay: Math.random() * 3, // atraso aleatório
    duration: 3 + Math.random() * 4 // duração aleatória entre 3-7 segundos
  }));

  return (
    <div className="absolute w-full h-full overflow-hidden" style={{ zIndex: 10 }}>
      {hearts.map(heart => (
        <FloatingHeart key={heart.id} x={heart.x} delay={heart.delay} duration={heart.duration} />
      ))}
    </div>
  );
};

export default function VisualizarMomento() {
  const router = useRouter();
  const { id } = router.query;
  const [petData, setPetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState<any>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeCounterCleanupRef = useRef<(() => void) | null>(null);

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

    // Limpar intervalos ao desmontar
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
      if (timeCounterCleanupRef.current) timeCounterCleanupRef.current();
    };
  }, [id]);

  // Configurar o carrossel quando os dados do pet forem carregados
  useEffect(() => {
    if (!petData || !petData.images || petData.images.length === 0) return;

    // Iniciar o carrossel com transição a cada 2 segundos
    carouselIntervalRef.current = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === petData.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => {
      if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
    };
  }, [petData]);

  // Configurar o contador de tempo quando os dados do pet forem carregados
  useEffect(() => {
    if (!petData || !petData.birthDate) return;

    // Usar a função de utilidade para iniciar o contador de tempo
    const cleanup = startTimeCounter(petData.birthDate, setTimeElapsed);
    timeCounterCleanupRef.current = cleanup;

    return () => {
      if (cleanup) cleanup();
    };
  }, [petData]);

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
          <button
            onClick={() => router.push('/')}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-4">
      <Head>
        <title>{petData?.name} | Memórias de Pets</title>
        <meta name="description" content={`Momentos especiais com ${petData?.name}`} />
      </Head>

      <main className="container mx-auto px-4 relative">
        {/* Corações flutuantes por toda a tela */}
        <FloatingHearts />
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Carrossel de Imagens */}
            <div className="relative w-full mx-auto" style={{ maxWidth: '900px', aspectRatio: '9/16' }}>
              <AnimatePresence mode="wait">
                {petData?.images && petData.images.length > 0 && (
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <img
                      src={petData.images[currentImageIndex]}
                      alt={`Imagem ${currentImageIndex + 1} de ${petData.name}`}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '9/16' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Informações do Pet e Contador */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">{petData?.name}</h1>
              <p className="text-gray-600 mb-4">{petData?.type}</p>

              {petData?.birthDate && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-3">Tempo Juntos:</h2>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-700">{timeElapsed.years}</div>
                      <div className="text-xs text-gray-600">Anos</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-700">{timeElapsed.days}</div>
                      <div className="text-xs text-gray-600">Dias</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-700">{timeElapsed.hours}</div>
                      <div className="text-xs text-gray-600">Horas</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-700">{timeElapsed.minutes}</div>
                      <div className="text-xs text-gray-600">Min</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-700">{timeElapsed.seconds}</div>
                      <div className="text-xs text-gray-600">Seg</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Descrição do Momento */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-600 mb-2">Momento Especial</h2>
                <p className="text-gray-700 whitespace-pre-line">{petData?.description}</p>
              </div>

              {/* Botão para voltar */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Voltar para a página inicial
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
