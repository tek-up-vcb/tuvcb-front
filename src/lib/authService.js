import { ethers } from 'ethers';

const API_BASE_URL = 'http://app.localhost/api/auth';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask n\'est pas installé');
    }

    try {
      // Demander la connexion à MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Aucun compte sélectionné');
      }

      const address = accounts[0];
      return address;
    } catch (error) {
      console.error('Erreur lors de la connexion à MetaMask:', error);
      throw error;
    }
  }

  async getNonce(address) {
    try {
      const response = await fetch(`${API_BASE_URL}/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du nonce');
      }

      const data = await response.json();
      return data.nonce;
    } catch (error) {
      console.error('Erreur getNonce:', error);
      throw error;
    }
  }

  async signMessage(message) {
    if (!window.ethereum) {
      throw new Error('MetaMask n\'est pas disponible');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      throw error;
    }
  }

  async authenticate() {
    try {
      // 1. Connecter le wallet
      const address = await this.connectWallet();
      
      // 2. Obtenir le nonce
      const nonce = await this.getNonce(address);
      
      // 3. Créer le message à signer
      const message = `Connectez-vous à TUVCB\n\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
      
      // 4. Signer le message
      const signature = await this.signMessage(message);
      
      // 5. Vérifier la signature et obtenir le token
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur d\'authentification');
      }

      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user_address', address);
      
      // Récupérer immédiatement les informations du profil
      try {
        const profile = await this.getProfile();
        localStorage.setItem('user_profile', JSON.stringify(profile));
      } catch (error) {
        console.warn('Impossible de récupérer le profil utilisateur:', error);
      }
      
      return { token: this.token, address };
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      throw error;
    }
  }

  async getProfile() {
    if (!this.token) {
      throw new Error('Non authentifié');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getProfile:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_address');
    localStorage.removeItem('user_profile');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUserAddress() {
    return localStorage.getItem('user_address');
  }

  getUserProfile() {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }
}

export default new AuthService();
