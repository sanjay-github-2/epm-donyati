// utils/crypto.js

import CryptoJS from "crypto-js";

const SECRET_KEY = "sanjaygouda";
// Replace with your own secret key

// Function to encrypt data
export const encryptData = (data) => {
  console.log(data);
  console.log(SECRET_KEY);

  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  console.log(encryptedData); // Log the encrypted value
  return encryptedData;
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  console.log(encryptData);
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  console.log(decryptedData);
  return decryptedData;
};
