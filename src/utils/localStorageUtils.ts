/**
 * Utilitário para armazenamento local de dados do pet
 */
import { isAdmin } from './adminUtils';

// Chave para armazenar a coleção de pets no localStorage
const PETS_STORAGE_KEY = 'pet_memories_data';

// Duração de 1 ano em milissegundos
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Interface para os dados do pet
export interface PetData {
  id: string;
  name: string;
  type: string;
  birthDate: string | null;
  description: string;
  images: string[];
  createdAt: number;
  expiresAt: number; // Data de expiração (1 ano após a criação)
  userId: string; // ID do usuário que criou o perfil
}

/**
 * Gera um ID de usuário único ou recupera o existente
 * @returns ID do usuário
 */
export const getUserId = (): string => {
  const USER_ID_KEY = 'pet_memories_user_id';
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Gerar um ID único para o usuário
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
};

/**
 * Salva os dados de um pet no armazenamento local
 * @param petData - Os dados do pet a serem salvos
 * @returns O ID do pet salvo
 */
export const savePet = (petData: Omit<PetData, 'expiresAt' | 'userId'>): string => {
  const userId = getUserId();
  const now = Date.now();
  
  // Obter pets existentes ou inicializar um array vazio
  const existingPets = getAllPets();
  
  // Adicionar o novo pet com data de expiração de 1 ano
  const completeData: PetData = {
    ...petData,
    createdAt: now,
    expiresAt: now + ONE_YEAR_MS,
    userId: userId
  };
  
  existingPets.push(completeData);
  
  // Salvar no localStorage
  localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(existingPets));
  
  return petData.id;
};

/**
 * Obtém todos os pets do armazenamento local, removendo os expirados
 * @returns Array com todos os pets válidos
 */
export const getAllPets = (): PetData[] => {
  const petsData = localStorage.getItem(PETS_STORAGE_KEY);
  const allPets: PetData[] = petsData ? JSON.parse(petsData) : [];
  
  // Filtrar pets expirados
  const now = Date.now();
  const validPets = allPets.filter(pet => pet.expiresAt > now);
  
  // Se houver pets expirados, atualizar o localStorage
  if (validPets.length !== allPets.length) {
    localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(validPets));
  }
  
  return validPets;
};

/**
 * Obtém um pet específico pelo ID
 * @param id - O ID do pet a ser obtido
 * @returns Os dados do pet ou null se não encontrado ou expirado
 */
export const getPetById = (id: string): PetData | null => {
  const allPets = getAllPets(); // Já filtra os expirados
  const pet = allPets.find(p => p.id === id);
  return pet || null;
};

/**
 * Exclui um pet pelo ID (apenas para administradores)
 * @param id - O ID do pet a ser excluído
 * @returns true se o pet foi excluído, false se não foi encontrado ou não tem permissão
 */
export const deletePet = (id: string): boolean => {
  // Verificar se é administrador
  if (!isAdmin()) {
    console.error('Permissão negada: apenas administradores podem excluir perfis');
    return false;
  }
  
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
 * Obtém todos os pets criados pelo usuário atual
 * @returns Array com os pets do usuário atual
 */
export const getUserPets = (): PetData[] => {
  const userId = getUserId();
  const allPets = getAllPets();
  return allPets.filter(pet => pet.userId === userId);
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
