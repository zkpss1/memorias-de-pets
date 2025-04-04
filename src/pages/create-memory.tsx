import { useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { savePet, filesToDataUrls } from '../utils/localStorageUtils';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview);

export default function CreateMemory() {
  const router = useRouter();
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [savedPetId, setSavedPetId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petName || !petType || !description || files.length === 0) {
      setError('Por favor, preencha todos os campos obrigatórios e faça upload de pelo menos uma imagem');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setUploadProgress(0);
    
    try {
      console.log('Iniciando o processo de envio do formulário...');
      
      // Generate a unique ID for the pet
      const petId = uuidv4();
      console.log('ID gerado:', petId);
      setUploadProgress(20);
      
      // Convert FilePond files to standard File objects
      console.log('Convertendo arquivos FilePond para File objects...');
      const fileObjects = files.map(filepondFile => filepondFile.file);
      console.log('Arquivos convertidos:', fileObjects.length);
      setUploadProgress(40);
      
      // Convert files to data URLs instead of uploading to Firebase
      console.log('Convertendo arquivos para Data URLs...');
      const imageUrls = await filesToDataUrls(fileObjects);
      console.log('URLs das imagens geradas:', imageUrls.length);
      setUploadProgress(80);
      
      // Save pet data to localStorage
      console.log('Salvando dados do pet no armazenamento local...');
      const petData = {
        id: petId,
        name: petName,
        type: petType,
        birthDate: birthDate || null,
        description,
        images: imageUrls,
        createdAt: Date.now(),
      };
      
      // Save to localStorage and get the ID
      const savedId = savePet(petData);
      console.log('Pet salvo com ID:', savedId);
      setUploadProgress(100);
      
      // Store the ID and show success message
      setSavedPetId(savedId);
      setShowSuccessMessage(true);
      setIsSubmitting(false);
      
    } catch (err) {
      console.error('Erro ao criar momento do pet:', err);
      setError('Falha ao criar momento do pet. Por favor, tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleFilesUpdate = useCallback((fileItems: any[]) => {
    setFiles(fileItems);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Head>
        <title>Criar Momento | Memórias de Pets</title>
        <meta name="description" content="Registre um novo momento divertido com seu pet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <main className="container mx-auto px-3 py-6 sm:px-4 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-4 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 sm:mb-6">Registrar um Momento</h1>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base">
                <p>{error}</p>
              </div>
            )}
            
            {showSuccessMessage && savedPetId && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="font-bold">Momento criado com sucesso!</p>
                <p className="mt-2 text-sm sm:text-base">Clique no botão abaixo para visualizar o QR code e compartilhar este momento.</p>
                <div className="mt-4">
                  <Link href={`/momento-criado/${savedPetId}`} passHref>
                    <div className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 sm:px-6 rounded-lg transition-colors cursor-pointer text-sm sm:text-base">
                      Ver QR Code e Compartilhar
                    </div>
                  </Link>
                </div>
              </div>
            )}
            
            {!showSuccessMessage && (
              <form onSubmit={handleSubmit} className="text-sm sm:text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 sm:mb-2" htmlFor="petName">
                      Nome do Pet *
                    </label>
                    <input
                      type="text"
                      id="petName"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 sm:mb-2" htmlFor="petType">
                      Tipo de Pet *
                    </label>
                    <select
                      id="petType"
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Cachorro">Cachorro</option>
                      <option value="Gato">Gato</option>
                      <option value="Pássaro">Pássaro</option>
                      <option value="Peixe">Peixe</option>
                      <option value="Coelho">Coelho</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2" htmlFor="birthDate">
                    Data de Nascimento (opcional)
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2" htmlFor="description">
                    Descrição do Momento *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Conte um pouco sobre esse momento divertido com seu pet..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                    Enviar Fotos *
                  </label>
                  <div className="filepond-container">
                    <FilePond
                      files={files}
                      onupdatefiles={handleFilesUpdate}
                      allowMultiple={true}
                      maxFiles={5}
                      name="files"
                      labelIdle='Toque para selecionar ou tire uma foto'
                      className="mb-2"
                      credits={false}
                      allowImagePreview={true}
                      imagePreviewHeight={156}
                      acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">Faça upload de até 5 fotos do seu pet (PNG, JPG)</p>
                </div>
                
                {isSubmitting && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}% concluído</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Momento'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>

      <style jsx global>{`
        /* Estilos específicos para melhorar a experiência em dispositivos móveis */
        @media (max-width: 640px) {
          .filepond--root {
            font-size: 14px;
          }
          .filepond--drop-label {
            min-height: 5em;
          }
          .filepond--panel-root {
            border-radius: 0.5em;
          }
        }
      `}</style>
    </div>
  );
}
