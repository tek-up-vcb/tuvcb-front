/**
 * Service pour la gestion des diplômes
 */

const API_BASE_URL = '/api/diplomas';

class DiplomasService {
  /**
   * Récupère tous les diplômes disponibles
   * @returns {Promise<Array>} Liste des diplômes
   */
  async getAllDiplomas() {
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
      console.error('Erreur lors de la récupération des diplômes:', error);
      throw error;
    }
  }

  /**
   * Crée un nouveau diplôme
   * @param {Object} diplomaData - Données du diplôme
   * @returns {Promise<Object>} Diplôme créé
   */
  async createDiploma(diplomaData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diplomaData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du diplôme:', error);
      throw error;
    }
  }

  /**
   * Récupère toutes les demandes de diplômes
   * @returns {Promise<Array>} Liste des demandes
   */
  async getAllDiplomaRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
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
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle demande de diplôme
   * @param {Object} requestData - Données de la demande
   * @returns {Promise<Object>} Demande créée
   */
  async createDiplomaRequest(requestData) {
    try {
      console.log('=== DIPLOMA SERVICE CREATE REQUEST ===');
      console.log('API URL:', `${API_BASE_URL}/requests`);
      console.log('Request data:', requestData);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      throw error;
    }
  }

  /**
   * Signe une demande de diplôme
   * @param {string} requestId - ID de la demande
   * @param {Object} signatureData - Données de signature
   * @returns {Promise<Object>} Demande mise à jour
   */
  async signDiplomaRequest(requestId, signatureData) {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(signatureData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      throw error;
    }
  }

  /**
   * Supprime une demande de diplôme
   * @param {string} requestId - ID de la demande
   * @returns {Promise<void>}
   */
  async deleteDiplomaRequest(requestId) {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }

  async requestAnchor(requestId, batchId, diplomeLabel){
    const token = localStorage.getItem('auth_token');
    const r = await fetch(`${API_BASE_URL}/requests/${requestId}/anchor-request`, {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({batchId, diplomeLabel})
    });
    if(!r.ok) throw new Error('Erreur requête ancrage');
    return r.json();
  }

  async confirmAnchor(requestId, txHash){
    const r = await fetch(`${API_BASE_URL}/requests/${requestId}/anchor-confirm`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({txHash})
    });
    if(!r.ok) throw new Error('Erreur confirmation ancrage');
    return r.json();
  }

  /**
   * Récupère les demandes d'un utilisateur spécifique
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des demandes
   */
  async getDiplomaRequestsByUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/user/${userId}`, {
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
      console.error('Erreur lors de la récupération des demandes utilisateur:', error);
      throw error;
    }
  }
}

export default new DiplomasService();
