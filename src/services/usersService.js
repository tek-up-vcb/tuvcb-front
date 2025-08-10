/**
 * Service pour la gestion des utilisateurs
 */

const API_BASE_URL = '/api/users';

class UsersService {
  /**
   * Récupère tous les utilisateurs
   * @param {string} role - Filtrer par rôle (optionnel)
   * @returns {Promise<Array>} Liste des utilisateurs
   */
  async getAllUsers(role = null) {
    try {
      let url = API_BASE_URL;
      if (role) {
        url += `?role=${role}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Utilisateur
   */
  async getUserById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son adresse wallet
   * @param {string} walletAddress - Adresse Ethereum
   * @returns {Promise<Object>} Utilisateur
   */
  async getUserByWallet(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur avec l'adresse ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @param {string} userData.nom - Nom de famille
   * @param {string} userData.prenom - Prénom
   * @param {string} userData.role - Rôle (Admin, Teacher, Guest)
   * @param {string} userData.walletAddress - Adresse Ethereum
   * @returns {Promise<Object>} Utilisateur créé
   */
  async createUser(userData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met à jour un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @param {Object} userData - Données à mettre à jour
   * @returns {Promise<Object>} Utilisateur mis à jour
   */
  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère le nombre total d'utilisateurs
   * @returns {Promise<number>} Nombre d'utilisateurs
   */
  async getUsersCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Filtre les utilisateurs par rôle
   * @param {string} role - Rôle à filtrer (Admin, Teacher, Guest)
   * @returns {Promise<Array>} Liste des utilisateurs filtrés
   */
  async getUsersByRole(role) {
    return this.getAllUsers(role);
  }
}

// Export d'une instance unique
const usersService = new UsersService();
export default usersService;
