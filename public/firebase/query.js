import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from "./firebase.js";

class FirestoreService {
  constructor(collectionPath) {
    this.db = db;
    this.collectionReference = collection(this.db, collectionPath);
  }

  async createDocument({ docID = null, data, rethrowError = false }) {
    try {
      if (docID === null) {
        await addDoc(this.collectionReference, data);
      } else {
        const docRef = doc(this.collectionReference, docID);
        await setDoc(docRef, data);
      }
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error creating document:", e);
    }
  }

  async getCreatedDocumentRef({ docID = null, data, rethrowError = false }) {
    try {
      let docRef;
      if (docID !== null) {
        docRef = doc(this.collectionReference, docID);
        await setDoc(docRef, data);
      } else {
        docRef = await addDoc(this.collectionReference, data);
      }
      return docRef;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting document reference:", e);
    }
  }

  async getCreatedDocument({ docID = null, data, rethrowError = false }) {
    try {
      let docSnap;
      if (docID !== null) {
        const docRef = doc(this.collectionReference, docID);
        await setDoc(docRef, data);
        docSnap = await getDoc(docRef);
      } else {
        const docRef = await addDoc(this.collectionReference, data);
        docSnap = await getDoc(docRef);
      }
      return docSnap;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting document:", e);
    }
  }

  async readDocument({ docID, rethrowError = false }) {
    try {
      const docRef = doc(this.collectionReference, docID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        if (rethrowError) throw e;
        console.log(`Document with ID ${docID} does not exist`);
        // throw new Error(`Document with ID ${docID} does not exist`);
      }
      return docSnap;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error reading document:", e);
    }
  }

  async getDocuments({
    whereConditions = [],
    orderByFields = [],
    rethrowError = false,
  }) {
    try {
      let q = query(this.collectionReference);
      whereConditions.forEach((condition) => {
        q = query(
          q,
          where(condition[0], condition[1], condition[2])
        );
      });
      orderByFields.forEach((field) => {
        q = query(q, orderBy(field));
      });
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting documents:", e);
    }
  }

  getDocumentsStream({
    whereConditions = [],
    orderByFields = [],
    rethrowError = false,
  }) {
    try {
      let q = query(this.collectionReference);
      whereConditions.forEach((condition) => {
        q = query(
          q,
          where(condition.field, condition.comparison, condition.value)
        );
      });
      orderByFields.forEach((field) => {
        q = query(q, orderBy(field));
      });
      return onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      });
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error in getDocumentsStream:", e);
    }
  }

  async updateDocument({ docID, data, rethrowError = false }) {
    try {
      // Validate that data is an object
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error(
          "Data must be an object with string keys and any type of values."
        );
      }

      // Validate that all keys in data are strings
      for (const key in data) {
        if (typeof key !== "string") {
          throw new Error("All keys in data must be strings.");
        }
      }

      const docRef = doc(this.collectionReference, docID);
      await setDoc(docRef, data, { merge: true });
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error updating document:", e);
    }
  }

  async getNewUpdatedDocument({ docID, data, rethrowError = false }) {
    try {
      // Validate that data is an object
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error(
          "Data must be an object with string keys and any type of values."
        );
      }

      // Validate that all keys in data are strings
      for (const key in data) {
        if (typeof key !== "string") {
          throw new Error("All keys in data must be strings.");
        }
      }

      const docRef = doc(this.collectionReference, docID);
      await setDoc(docRef, data, { merge: true });
      return await getDoc(docRef);
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting new updated document:", e);
    }
  }

  async getOldUpdatedDocument({ docID, data, rethrowError = false }) {
    try {
      // Validate that data is an object
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error(
          "Data must be an object with string keys and any type of values."
        );
      }

      // Validate that all keys in data are strings
      for (const key in data) {
        if (typeof key !== "string") {
          throw new Error("All keys in data must be strings.");
        }
      }

      const docRef = doc(this.collectionReference, docID);
      const oldData = await getDoc(docRef);
      await setDoc(docRef, data, { merge: true });
      return oldData;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting old updated document:", e);
    }
  }

  async getBothUpdatedDocument({ docID, data, rethrowError = false }) {
    try {
      // Validate that data is an object
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error(
          "Data must be an object with string keys and any type of values."
        );
      }

      // Validate that all keys in data are strings
      for (const key in data) {
        if (typeof key !== "string") {
          throw new Error("All keys in data must be strings.");
        }
      }

      const docRef = doc(this.collectionReference, docID);
      const oldData = await getDoc(docRef);
      await setDoc(docRef, data, { merge: true });
      const newData = await getDoc(docRef);
      return [oldData, newData];
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting both updated documents:", e);
    }
  }

  async deleteDocument({ docID, rethrowError = false }) {
    try {
      const docRef = doc(this.collectionReference, docID);
      await deleteDoc(docRef);
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error deleting document:", e);
    }
  }

  async getDeletedDocument({ docID, rethrowError = false }) {
    try {
      const docRef = doc(this.collectionReference, docID);
      const docSnap = await getDoc(docRef);
      await deleteDoc(docRef);
      return docSnap;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error getting deleted document:", e);
    }
  }
}

export default FirestoreService;
