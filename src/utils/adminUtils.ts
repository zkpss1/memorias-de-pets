/**
 * Utilitu00e1rio para gerenciamento de administrau00e7u00e3o
 */

// Chave para armazenar o token de administrador no localStorage
const ADMIN_TOKEN_KEY = 'pet_memories_admin_token';

// Senha de administrador (em produu00e7u00e3o, isso deveria estar em uma variu00e1vel de ambiente)
const ADMIN_PASSWORD = 'admin2507123123'; // Altere para uma senha mais segura em produu00e7u00e3o

/**
 * Autentica o administrador com uma senha
 * @param password - A senha do administrador
 * @returns true se a autenticau00e7u00e3o for bem-sucedida, false caso contru00e1rio
 */
export const authenticateAdmin = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    // Gerar um token simples (em produu00e7u00e3o, use algo mais seguro como JWT)
    const token = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    return true;
  }
  return false;
};

/**
 * Verifica se o usuu00e1rio atual u00e9 um administrador
 * @returns true se o usuu00e1rio for um administrador, false caso contru00e1rio
 */
export const isAdmin = (): boolean => {
  return !!localStorage.getItem(ADMIN_TOKEN_KEY);
};

/**
 * Encerra a sessu00e3o do administrador
 */
export const logoutAdmin = (): void => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};
