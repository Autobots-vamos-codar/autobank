import ncrypt from 'ncrypt-js';

const Key = 'c9be5f56edf99f81616694c272c810dc0f6b2e654a7f42cc566bd2e54c862a7d';
const ncryptObject = new ncrypt(Key);

function encrypt(text) {
  const encryptedData = ncryptObject.encrypt(text);
  return encryptedData;
}
function decrypt(text) {
  const decryptedData = ncryptObject.decrypt(text);
  return decryptedData;
}

export {
  encrypt,
  decrypt,
};
