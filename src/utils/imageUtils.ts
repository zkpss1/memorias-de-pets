import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Firebase Storage
 * @param file - The file to upload
 * @param petId - The unique identifier for the pet
 * @returns A promise that resolves to the download URL of the uploaded image
 */
export const uploadImage = async (file: File, petId: string): Promise<string> => {
  try {
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${petId}/${uuidv4()}.${fileExtension}`;
    
    // Create a reference to the storage location
    const storageRef = ref(storage, `pet-images/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Uploads multiple images to Firebase Storage
 * @param files - Array of files to upload
 * @param petId - The unique identifier for the pet
 * @returns A promise that resolves to an array of download URLs
 */
export const uploadMultipleImages = async (files: File[], petId: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, petId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Converts a FilePond file object to a standard File object
 * @param filepondFile - The FilePond file object
 * @returns A standard File object
 */
export const filepondToFile = (filepondFile: any): File => {
  if (!filepondFile || !filepondFile.file) {
    console.error('Erro: filepondFile inválido', filepondFile);
    throw new Error('Arquivo inválido');
  }
  
  console.log('Convertendo arquivo:', filepondFile.filename);
  return filepondFile.file;
};
