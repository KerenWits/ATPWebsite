import { storage } from "/firebase/firebase.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getBytes,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

class FirebaseStorageService {
  static sImgUsers = "users";
  static sImgAdmins = "admins";

  async uploadImage({ imageBytes, image, storagePath, rethrowError }) {
    let uploadBytes;
    if (imageBytes) {
      uploadBytes = imageBytes;
    } else if (image) {
      uploadBytes = image;
    } else {
      throw new Error("No image provided");
    }
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, uploadBytes);
      return await getDownloadURL(storageRef);
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
      return "";
    }
  }

  async downloadImageFromURL({ downloadURL, rethrowError }) {
    try {
      const storageRef = ref(storage, downloadURL);
      const downloadedBytes = await getBytes(storageRef);
      if (!downloadedBytes) {
        throw new Error("Image not found");
      } else {
        return downloadedBytes;
      }
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
      return null;
    }
  }

  async downloadFileFromURL({ downloadURL, rethrowError }) {
    try {
      const storageRef = ref(storage, downloadURL);
      const downloadedBytes = await getBytes(storageRef);
      if (!downloadedBytes) {
        throw new Error("File not found");
      } else {
        return downloadedBytes;
      }
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
      return null;
    }
  }

  async downloadImageFromPath({ storagePath, rethrowError }) {
    try {
      const storageRef = ref(storage, storagePath);
      const downloadedBytes = await getBytes(storageRef);
      if (!downloadedBytes) {
        throw new Error("Image not found");
      } else {
        return downloadedBytes;
      }
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
      return null;
    }
  }

  async deleteImage({ downloadURL, rethrowError }) {
    try {
      const storageRef = ref(storage, downloadURL);
      await deleteObject(storageRef);
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
    }
  }

  async uploadFile({ fileBytes, storagePath, rethrowError }) {
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileBytes);
      return await getDownloadURL(storageRef);
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
      return "";
    }
  }

  async downloadFile({ storagePath, rethrowError }) {
    try {
      const storageRef = ref(storage, storagePath);
      const downloadedBytes = await getBytes(storageRef);
      if (!downloadedBytes) {
        throw new Error("File not found");
      } else {
        return downloadedBytes;
      }
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
      return null;
    }
  }

  async deleteFile({ storagePath, rethrowError }) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (e) {
      if (rethrowError) throw e;
      console.error(e);
    }
  }

  constructor() {
    if (FirebaseStorageService._instance) {
      return FirebaseStorageService._instance;
    }
    FirebaseStorageService._instance = this;
  }

  static get instance() {
    return this._instance || new FirebaseStorageService();
  }
}

// Singleton instance
FirebaseStorageService._instance = null;

export { FirebaseStorageService };
