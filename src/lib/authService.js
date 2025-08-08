import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getNonce(address) {
  console.log(`Envoi de la requête nonce pour l'adresse: ${address}`)
  try {
    const response = await axios.get(`${API_BASE}/auth/nonce`, {
      params: { address },
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération du nonce:', error)
    throw error
  }
}
