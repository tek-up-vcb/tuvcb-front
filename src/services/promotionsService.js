/**
 * Service pour la gestion des promotions
 */

const API_BASE_URL = '/api/promotions';

class PromotionsService {
  /**
   * Récupère toutes les promotions
   * @returns {Promise<Array>} Liste des promotions
   */
  async getAllPromotions() {
    try {
      const response = await fetch(API_BASE_URL, {
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
      console.error('Erreur lors de la récupération des promotions:', error);
      throw error;
    }
  }

  /**
   * Récupère toutes les promotions actives
   * @returns {Promise<Array>} Liste des promotions actives
   */
  async getActivePromotions() {
    try {
      const response = await fetch(`${API_BASE_URL}/active`, {
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
      console.error('Erreur lors de la récupération des promotions actives:', error);
      throw error;
    }
  }

  /**
   * Récupère une promotion par son ID
   * @param {string} id - ID de la promotion
   * @returns {Promise<Object>} Promotion
   */
  async getPromotionById(id) {
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
      console.error(`Erreur lors de la récupération de la promotion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle promotion
   * @param {Object} promotionData - Données de la promotion
   * @param {string} promotionData.nom - Nom de la promotion
   * @param {string} promotionData.description - Description (optionnel)
   * @param {number} promotionData.annee - Année de la promotion
   * @returns {Promise<Object>} Promotion créée
   */
  async createPromotion(promotionData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la promotion:', error);
      throw error;
    }
  }

  /**
   * Met à jour une promotion
   * @param {string} id - ID de la promotion
   * @param {Object} promotionData - Données à mettre à jour
   * @returns {Promise<Object>} Promotion mise à jour
   */
  async updatePromotion(id, promotionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la promotion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une promotion
   * @param {string} id - ID de la promotion
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deletePromotion(id) {
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
      console.error(`Erreur lors de la suppression de la promotion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère le nombre total de promotions
   * @returns {Promise<number>} Nombre de promotions
   */
  async getPromotionsCount() {
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
      console.error('Erreur lors de la récupération du nombre de promotions:', error);
      throw error;
    }
  }
}

// Export d'une instance unique
const promotionsService = new PromotionsService();
export default promotionsService;
