const crypto = require('crypto');
require('dotenv').config();

// Encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
// Use a static IV for simplicity (in production, consider using a random IV per encryption)
const IV_LENGTH = 16;

/**
 * Encrypts sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text
 */
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypts encrypted data
 * @param {string} text - Text to decrypt
 * @returns {string} - Decrypted text
 */
const decrypt = (text) => {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

module.exports = {
  encrypt,
  decrypt
};
