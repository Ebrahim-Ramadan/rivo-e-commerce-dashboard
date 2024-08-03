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




export async function deleteOrderById(orderId) {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await deleteDoc(orderDocRef);
    console.log(`Order with ID ${orderId} has been deleted.`);
    return true;
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}: `, error);
    return false;
  }
}

export async function checkIfOrderExists(orderId) {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (orderId in data) {
        console.log(`Order ID ${orderId} exists as a key in document`);
        return [{ id: doc.id, ...data }]; // The orderId exists as a key in this document
      }
    }
    
    return false; // The orderId was not found as a key in any document
  } catch (error) {
    console.error("Error checking if order ID exists as key: ", error);
    return false;
  }
}