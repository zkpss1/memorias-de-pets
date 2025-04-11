import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Importar estilos do FilePond
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Registrar plugins do FilePond
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

interface FormData {
  name: string;
  type: string;
  birthDate: string;
  description: string;
}

export default function CreateMemory() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    birthDate: '',
    description: ''
  });
  const [files, setFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Tipo é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (files.length === 0) {
      alert('Por favor, adicione pelo menos uma foto');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Extrair arquivos reais dos objetos FilePond
      const fileObjects = files.map(fileItem => fileItem.file);
      
      // Converter arquivos para Data URLs
      const imageUrls = await Promise.all(
        fileObjects.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Enviar dados para a API
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          birthDate: formData.birthDate || null,
          description: formData.description,
          images: imageUrls
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o pet');
      }

      const { id } = await response.json();
      
      // Limpar o intervalo e definir progresso como 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Redirecionar para a página de momento criado
      setTimeout(() => {
        router.push(`/momento-criado/${id}`);
      }, 500);
      
    } catch (error) {
      console.error('Erro ao salvar o pet:', error);
      setIsSubmitting(false);
      alert('Ocorreu um erro ao salvar o momento. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 px-4 sm:px-6">
      <Head>
        <title>Criar Momento - Memórias de Pets</title>
        <meta name="description" content="Crie uma nova memória com seu pet" />
      </Head>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Criar Nova Memória</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Pet</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Digite o nome do seu pet"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pet</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione o tipo</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Pássaro">Pássaro</option>
              <option value="Peixe">Peixe</option>
              <option value="Roedor">Roedor</option>
              <option value="Réptil">Réptil</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento (opcional)</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição do Momento</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Descreva esse momento especial"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={true}
              maxFiles={5}
              name="files"
              labelIdle='Arraste e solte suas fotos ou <span class="filepond--label-action">Toque para selecionar</span>'
              acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
              labelFileTypeNotAllowed="Apenas imagens PNG e JPG são permitidas"
              imagePreviewHeight={200}
              stylePanelLayout="compact"
              styleLoadIndicatorPosition="center bottom"
              styleProgressIndicatorPosition="center bottom"
              styleButtonRemoveItemPosition="center bottom"
              credits={false}
            />
            <p className="mt-1 text-xs text-gray-500">Máximo de 5 fotos (PNG ou JPG)</p>
          </div>

          {isSubmitting && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm mt-2 text-gray-600">{uploadProgress}% concluído</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Momento'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
