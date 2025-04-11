import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAllPets, deletePet, PetData } from '../utils/localStorageUtils';
import { isAdmin, authenticateAdmin, logoutAdmin } from '../utils/adminUtils';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pets, setPets] = useState<PetData[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar se o usuário já está autenticado como administrador
  useEffect(() => {
    const adminStatus = isAdmin();
    setAuthenticated(adminStatus);
    
    if (adminStatus) {
      loadPets();
    }
  }, []);

  // Carregar todos os pets
  const loadPets = () => {
    setLoading(true);
    try {
      const allPets = getAllPets();
      setPets(allPets);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar pets:', err);
      setError('Falha ao carregar os dados dos pets');
      setLoading(false);
    }
  };

  // Autenticar como administrador
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Por favor, insira a senha de administrador');
      return;
    }
    
    const success = authenticateAdmin(password);
    if (success) {
      setAuthenticated(true);
      setPassword('');
      loadPets();
    } else {
      setError('Senha incorreta');
    }
  };

  // Fazer logout
  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    setPets([]);
  };

  // Excluir um pet
  const handleDeletePet = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o perfil de ${name}?`)) {
      const success = deletePet(id);
      if (success) {
        setSuccessMessage(`Perfil de ${name} excluído com sucesso`);
        // Atualizar a lista de pets
        loadPets();
        
        // Limpar a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError('Falha ao excluir o perfil. Verifique suas permissões.');
      }
    }
  };

  // Formatar data
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Head>
        <title>Administração | Memórias de Pets</title>
        <meta name="description" content="Painel de administração" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-indigo-700">Painel de Administração</h1>
              {authenticated && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sair
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                <p>{successMessage}</p>
              </div>
            )}

            {!authenticated ? (
              <form onSubmit={handleLogin} className="max-w-md mx-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                    Senha de Administrador
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Entrar
                </button>
              </form>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Gerenciar Perfis de Pets</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">Carregando perfis...</p>
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Nenhum perfil de pet encontrado.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left">Nome</th>
                          <th className="py-3 px-4 text-left">Tipo</th>
                          <th className="py-3 px-4 text-left">Criado em</th>
                          <th className="py-3 px-4 text-left">Expira em</th>
                          <th className="py-3 px-4 text-left">ID do Usuário</th>
                          <th className="py-3 px-4 text-left">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pets.map((pet) => (
                          <tr key={pet.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">{pet.name}</td>
                            <td className="py-3 px-4">{pet.type}</td>
                            <td className="py-3 px-4">{formatDate(pet.createdAt)}</td>
                            <td className="py-3 px-4">{formatDate(pet.expiresAt)}</td>
                            <td className="py-3 px-4">
                              <span className="text-xs">{pet.userId.substring(0, 10)}...</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link href={`/pet/${pet.id}`} passHref>
                                  <div className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                    Ver
                                  </div>
                                </Link>
                                <button
                                  onClick={() => handleDeletePet(pet.id, pet.name)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Excluir
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
