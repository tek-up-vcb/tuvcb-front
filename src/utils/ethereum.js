/**
 * Utilitaires pour la validation des adresses Ethereum
 */

/**
 * Valide si une chaîne est une adresse Ethereum valide
 * @param {string} address - L'adresse à valider
 * @returns {boolean} - True si l'adresse est valide, false sinon
 */
export const isValidEthereumAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return false
  }
  
  // Validation basique : 0x suivi de 40 caractères hexadécimaux
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethAddressRegex.test(address)
}

/**
 * Formate une adresse Ethereum pour l'affichage (raccourcie)
 * @param {string} address - L'adresse à formater
 * @param {number} startLength - Nombre de caractères à afficher au début (défaut: 6)
 * @param {number} endLength - Nombre de caractères à afficher à la fin (défaut: 4)
 * @returns {string} - L'adresse formatée
 */
export const formatEthereumAddress = (address, startLength = 6, endLength = 4) => {
  if (!isValidEthereumAddress(address)) {
    return address
  }
  
  if (address.length <= startLength + endLength) {
    return address
  }
  
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`
}

/**
 * Valide et normalise une adresse Ethereum (met en minuscules)
 * @param {string} address - L'adresse à normaliser
 * @returns {string|null} - L'adresse normalisée ou null si invalide
 */
export const normalizeEthereumAddress = (address) => {
  if (!isValidEthereumAddress(address)) {
    return null
  }
  
  return address.toLowerCase()
}

/**
 * Messages d'erreur pour la validation des adresses
 */
export const ETHEREUM_ADDRESS_ERRORS = {
  REQUIRED: 'L\'adresse wallet est requise',
  INVALID_FORMAT: 'L\'adresse wallet n\'est pas valide',
  INVALID_LENGTH: 'L\'adresse wallet doit contenir exactement 42 caractères',
  MISSING_PREFIX: 'L\'adresse wallet doit commencer par 0x',
  INVALID_CHARACTERS: 'L\'adresse wallet ne peut contenir que des caractères hexadécimaux'
}

/**
 * Validation détaillée d'une adresse Ethereum avec message d'erreur spécifique
 * @param {string} address - L'adresse à valider
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateEthereumAddressDetailed = (address) => {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: ETHEREUM_ADDRESS_ERRORS.REQUIRED }
  }
  
  const trimmedAddress = address.trim()
  
  if (trimmedAddress.length === 0) {
    return { isValid: false, error: ETHEREUM_ADDRESS_ERRORS.REQUIRED }
  }
  
  if (!trimmedAddress.startsWith('0x')) {
    return { isValid: false, error: ETHEREUM_ADDRESS_ERRORS.MISSING_PREFIX }
  }
  
  if (trimmedAddress.length !== 42) {
    return { isValid: false, error: ETHEREUM_ADDRESS_ERRORS.INVALID_LENGTH }
  }
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
    return { isValid: false, error: ETHEREUM_ADDRESS_ERRORS.INVALID_CHARACTERS }
  }
  
  return { isValid: true, error: null }
}
