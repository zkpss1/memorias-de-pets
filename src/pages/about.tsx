import Head from 'next/head';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12">
      <Head>
        <title>Sobre | Memórias de Pets</title>
        <meta name="description" content="Saiba mais sobre o aplicativo Memórias de Pets" />
      </Head>

      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6">Sobre o Memórias de Pets</h1>
            
            <div className="prose prose-indigo max-w-none">
              <p className="text-lg mb-6">
                O Memórias de Pets foi criado com uma missão simples: ajudar os tutores de pets a registrar e compartilhar momentos divertidos e especiais com seus companheiros peludos.
              </p>
              
              <h2 className="text-2xl font-semibold text-indigo-600 mt-8 mb-4">Nossa História</h2>
              <p>
                A ideia do Memórias de Pets nasceu do amor por animais de estimação. Percebemos como nossos pets proporcionam momentos incríveis no dia a dia, e queríamos criar um espaço dedicado para capturar e compartilhar essas experiências divertidas.
              </p>
              <p>
                Acreditamos que nossos pets são membros da família que trazem alegria constante às nossas vidas. Cada brincadeira, passeio ou momento de carinho merece ser registrado e celebrado.
              </p>
              
              <h2 className="text-2xl font-semibold text-indigo-600 mt-8 mb-4">Nossa Missão</h2>
              <p>
                Nossa missão é fornecer aos tutores de pets uma plataforma bonita e intuitiva para criar álbuns digitais de seus pets. O Memórias de Pets oferece um espaço para coletar fotos, compartilhar histórias divertidas e celebrar o vínculo único que vocês compartilham com seus animais de estimação no dia a dia.
              </p>
              
              <h2 className="text-2xl font-semibold text-indigo-600 mt-8 mb-4">Funcionalidades</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crie perfis personalizados para seus pets com fotos e histórias divertidas</li>
                <li>Gere QR codes para compartilhar facilmente os momentos do seu pet</li>
                <li>Registre datas especiais e comemorações</li>
                <li>Compartilhe momentos engraçados com amigos e familiares</li>
                <li>Acesse as memórias do seu pet de qualquer dispositivo</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-indigo-600 mt-8 mb-4">Nossos Valores</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Diversão</h3>
                  <p className="text-gray-700">Acreditamos que a relação com nossos pets deve ser celebrada com alegria e leveza, capturando os momentos mais divertidos.</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Qualidade</h3>
                  <p className="text-gray-700">Estamos comprometidos em fornecer uma plataforma de alta qualidade que valorize os momentos especiais com seu pet.</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Comunidade</h3>
                  <p className="text-gray-700">Acreditamos no poder das experiências compartilhadas e visamos construir uma comunidade divertida para amantes de pets.</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-indigo-600 mt-8 mb-4">Contato</h2>
              <p>
                Adoraríamos ouvir você! Se tiver dúvidas, feedback ou apenas quiser compartilhar uma história divertida do seu pet, não hesite em entrar em contato conosco pelo e-mail <a href="mailto:contato@memoriaspets.com.br" className="text-indigo-600 hover:text-indigo-800">contato@memoriaspets.com.br</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
