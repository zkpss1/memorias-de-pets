import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Head>
        <title>Memórias de Pets - Momentos Especiais com seu Pet</title>
        <meta name="description" content="Crie memórias digitais divertidas com seus animais de estimação" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-indigo-700 mb-4">Memórias de Pets</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie e compartilhe momentos divertidos com seu pet. Registre suas histórias e celebre a alegria que eles trazem para sua vida.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Momentos Inesquecíveis</h2>
            <p className="text-gray-700 mb-6">
              Nossos pets trazem alegria para nossas vidas todos os dias. Crie um álbum digital que celebre a personalidade única do seu pet, 
              momentos divertidos e a felicidade que vocês compartilham juntos.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Faça upload de fotos e vídeos ilimitados',
                'Compartilhe histórias engraçadas e momentos especiais',
                'Crie um QR code único para o álbum do seu pet',
                'Registre datas de aniversários e comemorações'
              ].map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  className="flex items-center text-gray-700"
                >
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/images/pets.gif" 
                alt="Momentos com pets" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="inline-block"
          >
            <Link href="/create-memory" passHref>
              <div className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
                Criar uma Memória
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block ml-2"
                >
                  →
                </motion.span>
              </div>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="bg-indigo-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Memórias de Pets. Todos os direitos reservados.</p>
          <p className="mt-2 text-indigo-200">Feito com &hearts; para amantes de pets em todo o Brasil</p>
        </div>
      </footer>
    </div>
  );
}
