import { getFirestore, collection, addDoc , doc, updateDoc, deleteDoc, where, getDocs, query, limit, getDoc } from 'firebase/firestore';
import firebase_app from './firebaseConfig';



const db = getFirestore(firebase_app);


export const getAllOrders = async () => {
    try {
      const framesCollection = collection(db, 'orders');
      // Create a query with a limit of 100 documents
      const framesQuery = query(framesCollection, limit(10));
      const querySnapshot = await getDocs(framesQuery);
  
  
      let ordersData = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        ordersData.push({ id: doc.id, ...data });
      });
      console.log('ordersData', ordersData);
      return ordersData;
    } catch (error) {
      console.error('Error getting users by access token:', error);
      return false;
    }
  };

  
  export async function getProductDetails(docId) {
    try {
      const docRef = doc(db, "frames", docId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        let data = docSnap.data();
        data.id = docSnap.id;
         // Convert keys to lowercase and trim spaces
         data = Object.keys(data).reduce((acc, key) => {
          const normalizedKey = key.trim().toLowerCase();
          acc[normalizedKey] = data[key];
          return acc;
        }, {});

        if (data.images) data.images = data.images.split(',').map(item => item.trim());

  
        return data;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      return false;
    }
  }