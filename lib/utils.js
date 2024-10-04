import { getFirestore, collection, addDoc , doc, updateDoc, deleteDoc, where, getDocs, query, limit, getDoc, startAfter } from 'firebase/firestore';
import firebase_app from './firebaseConfig';



const db = getFirestore(firebase_app);

let lastVisibleDocument = null;

export const getAllOrders = async (isLoadingMore = false) => {
  try {
    const framesCollection = collection(db, 'orders');
    let framesQuery;

    if (isLoadingMore && lastVisibleDocument) {
      framesQuery = query(
        framesCollection,
        startAfter(lastVisibleDocument),
        limit(2)
      );
    } else {
      // Initial query
      framesQuery = query(framesCollection, limit(2));
    }

    const querySnapshot = await getDocs(framesQuery);

    lastVisibleDocument = querySnapshot.docs[querySnapshot.docs.length - 1];

    let ordersData = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      ordersData.push({ id: doc.id, ...data });
    });

    console.log('ordersData', ordersData);
    
    return {
      orders: ordersData,
      hasMore: querySnapshot.docs.length === 2
    };
  } catch (error) {
    console.error('Error getting orders:', error);
    return false;
  }
};

// Function to reset pagination
export const resetOrdersPagination = () => {
  lastVisibleDocument = null;
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

        if (data.images && typeof data.images == 'string') data.images = data.images.split(',').map(item => item.trim());

  
        return data;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      return false;
    }
  }



  export async function markOrderAsDone(orderId) {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        status: "Done"
      });
      console.log(`Order with ID ${orderId} has been marked as done.`);
      return true;
    } catch (error) {
      console.error(`Error marking order with ID ${orderId} as done: `, error);
      return false;
    }
  }

export async function checkIfOrderExists(orderId) {
  try {
    // Step 1: Check if the order ID exists as a document ID
    const orderRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
      console.log(`Order ID ${orderId} exists as a document`);
      return [{ id: docSnap.id, ...docSnap.data() }]; // The document exists
    }

    // Step 2: If the document does not exist, check if the order ID exists as a key in any document
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (orderId in data) {
        console.log(`Order ID ${orderId} exists as a key in document`);
        return [{ id: doc.id, ...data }]; // The orderId exists as a key in this document
      }
    }

    return false; // The orderId was not found as a document ID or a key in any document
  } catch (error) {
    console.error("Error checking if order ID exists: ", error);
    return false;
  }
}

export async function searchByDocID(orderId) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(orderRef);
    
    if (docSnap.exists()) {
      console.log(`Order ID ${orderId} exists in the document`);
      return { id: docSnap.id, ...docSnap.data() }; // The document exists
    } else {
      return false; // The document does not exist
    }
  } catch (error) {
    console.error("Error checking if order ID exists as a document: ", error);
    return false;
  }
}

export const Shipping_costs = [
  {'Cairo':'50'},
  {'Giza':'50'},
  {'Qaluibiya':'50'},
  {'Gharbiya':'50'},
  {'Minufia':'50'},
  {'Dakahilia':'50'},
  {'Ismailia':'50'},
  {'Alexandria':'55'},
  {'Behira':'55'},
  {'Damietta':'55'},
  {'Kafr-ash-Shaykh':'55'},
  {'Elseweais':'55'},
  {'Bort Said':'55'},
  {'Fayoum':'55'},
  {'Beni Suef':'55'},
  {'Sinia North':'55'},
  {'Al Minia':'70'},
  {'Sinia South':'70'},
  {'Matrouh':'80'},
  {'Asyuit':'80'},
  {'Sohag':'80'},
  {'Red Sea':'80'},
  {'Qena':'90'},
  {'Aswan':'90'},
  {'Luxur':'90'},
  {'New Valley':'90'},
]