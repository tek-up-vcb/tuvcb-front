/**
 * Service pour la gestion des étudiants
 */

const API_BASE_URL = '/api/students';

class StudentsService {
  /**
   * Récupère tous les étudiants
   * @param {string} promotionId - Filtrer par promotion (optionnel)
   * @returns {Promise<Array>} Liste des étudiants
   */
  async getAllStudents(promotionId = null) {
    try {
      let url = API_BASE_URL;
      if (promotionId) {
        url += `?promotionId=${promotionId}`;
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
      console.error('Erreur lors de la récupération des étudiants:', error);
      throw error;
    }
  }

  /**
   * Récupère un étudiant par son ID
   * @param {string} id - ID de l'étudiant
   * @returns {Promise<Object>} Étudiant
   */
  async getStudentById(id) {
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
      console.error(`Erreur lors de la récupération de l'étudiant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un étudiant par son ID étudiant
   * @param {string} studentId - ID étudiant
   * @returns {Promise<Object>} Étudiant
   */
  async getStudentByStudentId(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/student-id/${studentId}`, {
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
      console.error(`Erreur lors de la récupération de l'étudiant avec l'ID ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un étudiant par son email
   * @param {string} email - Email de l'étudiant
   * @returns {Promise<Object>} Étudiant
   */
  async getStudentByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/email/${email}`, {
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
      console.error(`Erreur lors de la récupération de l'étudiant avec l'email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouvel étudiant
   * @param {Object} studentData - Données de l'étudiant
   * @param {string} studentData.studentId - ID étudiant unique
   * @param {string} studentData.nom - Nom de famille
   * @param {string} studentData.prenom - Prénom
   * @param {string} studentData.email - Email
   * @param {string} studentData.promotionId - ID de la promotion
   * @returns {Promise<Object>} Étudiant créé
   */
  async createStudent(studentData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'étudiant:', error);
      throw error;
    }
  }

  /**
   * Met à jour un étudiant
   * @param {string} id - ID de l'étudiant
   * @param {Object} studentData - Données à mettre à jour
   * @returns {Promise<Object>} Étudiant mis à jour
   */
  async updateStudent(id, studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'étudiant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un étudiant
   * @param {string} id - ID de l'étudiant
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteStudent(id) {
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
      console.error(`Erreur lors de la suppression de l'étudiant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère le nombre total d'étudiants
   * @returns {Promise<number>} Nombre d'étudiants
   */
  async getStudentsCount() {
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
      console.error('Erreur lors de la récupération du nombre d\'étudiants:', error);
      throw error;
    }
  }

  /**
   * Filtre les étudiants par promotion
   * @param {string} promotionId - ID de la promotion à filtrer
   * @returns {Promise<Array>} Liste des étudiants filtrés
   */
  async getStudentsByPromotion(promotionId) {
    return this.getAllStudents(promotionId);
  }

  /**
   * Supprime plusieurs étudiants en lot
   * @param {Array<string>} studentIds - Liste des IDs des étudiants à supprimer
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteMultipleStudents(studentIds) {
    try {
      const deletePromises = studentIds.map(id => this.deleteStudent(id));
      await Promise.all(deletePromises);
      return { success: true, deletedCount: studentIds.length };
    } catch (error) {
      console.error('Erreur lors de la suppression en lot:', error);
      throw error;
    }
  }

  /**
   * Met à jour plusieurs étudiants avec la même promotion
   * @param {Array<string>} studentIds - Liste des IDs des étudiants à modifier
   * @param {string} promotionId - ID de la nouvelle promotion
   * @returns {Promise<Object>} Confirmation de mise à jour
   */
  async updateMultipleStudentsPromotion(studentIds, promotionId) {
    try {
      const updatePromises = studentIds.map(id => 
        this.updateStudent(id, { promotionId })
      );
      await Promise.all(updatePromises);
      return { success: true, updatedCount: studentIds.length };
    } catch (error) {
      console.error('Erreur lors de la mise à jour en lot:', error);
      throw error;
    }
  }

  /**
   * Met à jour les promotions de plusieurs étudiants
   * @param {Array<string>} studentIds - Liste des IDs des étudiants à modifier
   * @param {Array<string>} promotionIds - Liste des IDs des promotions
   * @returns {Promise<Array>} Étudiants mis à jour
   */
  async bulkUpdatePromotions(studentIds, promotionIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk/promotions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentIds,
          promotionIds
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour groupée des promotions:', error);
      throw error;
    }
  }

  /**
   * KPIs étudiants
   */
  async getKpi() {
    const r = await fetch(`${API_BASE_URL}/kpi`);
    if(!r.ok) throw new Error('Erreur KPI étudiants');
    return r.json();
  }
}

// Export d'une instance unique
const studentsService = new StudentsService();
export default studentsService;
