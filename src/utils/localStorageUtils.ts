/**
 * Utilitário para armazenamento local de dados do pet
 */

// Chave para armazenar a coleção de pets no localStorage
const PETS_STORAGE_KEY = 'pet_memories_data';

// Interface para os dados do pet
export interface PetData {
  id: string;
  name: string;
  type: string;
  birthDate: string | null;
  description: string;
  images: string[];
  createdAt: number;
}

/**
 * Salva os dados de um pet no armazenamento local
 * @param petData - Os dados do pet a serem salvos
 * @returns O ID do pet salvo
 */
export const savePet = (petData: PetData): string => {
  // Obter pets existentes ou inicializar um array vazio
  const existingPets = getAllPets();
  
  // Adicionar o novo pet
  existingPets.push({
    ...petData,
    createdAt: Date.now() // Usar timestamp atual
  });
  
  // Salvar no localStorage
  localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(existingPets));
  
  return petData.id;
};

/**
 * Obtém todos os pets do armazenamento local
 * @returns Array com todos os pets
 */
export const getAllPets = (): PetData[] => {
  const petsData = localStorage.getItem(PETS_STORAGE_KEY);
  return petsData ? JSON.parse(petsData) : [];
};

/**
 * Obtém um pet específico pelo ID
 * @param id - O ID do pet a ser obtido
 * @returns Os dados do pet ou null se não encontrado
 */
export const getPetById = (id: string): PetData | null => {
  const allPets = getAllPets();
  const pet = allPets.find(p => p.id === id);
  return pet || null;
};

/**
 * Exclui um pet pelo ID
 * @param id - O ID do pet a ser excluído
 * @returns true se o pet foi excluído, false se não foi encontrado
 */
export const deletePet = (id: string): boolean => {
  const allPets = getAllPets();
  const initialLength = allPets.length;
  
  const filteredPets = allPets.filter(p => p.id !== id);
  
  if (filteredPets.length !== initialLength) {
    localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(filteredPets));
    return true;
  }
  
  return false;
};

/**
 * Converte um arquivo para uma URL de dados (Data URL)
 * @param file - O arquivo a ser convertido
 * @returns Uma Promise que resolve para a URL de dados
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Falha ao converter arquivo para Data URL'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Converte múltiplos arquivos para URLs de dados
 * @param files - Array de arquivos a serem convertidos
 * @returns Uma Promise que resolve para um array de URLs de dados
 */
export const filesToDataUrls = async (files: File[]): Promise<string[]> => {
  const promises = files.map(file => fileToDataUrl(file));
  return Promise.all(promises);
};
