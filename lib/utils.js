import { supabase } from './supabaseClient'; // Import the Supabase client
import { getFirestore, collection, addDoc , doc, updateDoc, deleteDoc, where, getDocs, query, limit, getDoc, startAfter } from 'firebase/firestore';
import firebase_app from './firebaseConfig';



const db = getFirestore(firebase_app);
let lastVisibleDocument = null;

// Fetch all orders with pagination
export const getAllOrders = async (isLoadingMore = false) => {
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (isLoadingMore && lastVisibleDocument) {
      query = query.lt('created_at', lastVisibleDocument.created_at);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length > 0) {
      lastVisibleDocument = data[data.length - 1];
    }

    console.log('ordersData', data);

    return {
      orders: data,
      hasMore: data.length === 10, // Check if there are more orders to load
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

// Fetch product details by document ID
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

// Mark an order as done
export async function markOrderAsDone(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Done' })
      .eq('id', orderId);

    if (error) throw error;

    console.log(`Order with ID ${orderId} has been marked as done.`);
    return true;
  } catch (error) {
    console.error(`Error marking order with ID ${orderId} as done: `, error);
    return false;
  }
}

// Check if an order exists by ID
export async function checkIfOrderExists(orderId) {
  try {
    // Step 1: Check if the order ID exists as a document ID
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;

    if (data) {
      console.log(`Order ID ${orderId} exists as a document`);
      return [data]; // The document exists
    }

    // Step 2: If the document does not exist, check if the order ID exists as a key in any document
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    for (const order of orders) {
      if (orderId in order) {
        console.log(`Order ID ${orderId} exists as a key in document`);
        return [order]; // The orderId exists as a key in this document
      }
    }

    return false; // The orderId was not found as a document ID or a key in any document
  } catch (error) {
    console.error('Error checking if order ID exists: ', error);
    return false;
  }
}

// Search for an order by document ID
export async function searchByDocID(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;

    if (data) {
      console.log(`Order ID ${orderId} exists in the document`);
      return data; // The document exists
    } else {
      return false; // The document does not exist
    }
  } catch (error) {
    console.error('Error checking if order ID exists as a document: ', error);
    return false;
  }
}

// Shipping costs (unchanged)
export const Shipping_costs = [
  { "Cairo": "50" },
  { "Giza": "50" },
  { "Qaluibiya": "50" },
  { "Gharbiya": "50" },
  { "Minufia": "50" },
  { "Dakahilia": "50" },
  { "Ismailia": "50" },
  { "Sharqia": "50" },
  { "Alexandria": "55" },
  { "Behira": "55" },
  { "Damietta": "55" },
  { "Kafr ash Shaykh": "55" },
  { "Elseweais": "55" },
  { "Bort Said": "55" },
  { "Fayoum": "55" },
  { "Beni Suef": "55" },
  { "Sinia North": "55" },
  { "Al Minia": "70" },
  { "Sinia South": "70" },
  { "Matrouh": "80" },
  { "Asyuit": "80" },
  { "Sohag": "80" },
  { "Red Sea": "80" },
  { "Qena": "90" },
  { "Aswan": "90" },
  { "Luxur": "90" },
  { "New Valley": "90" }
];