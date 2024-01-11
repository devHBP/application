import axios from 'axios';
import {  API_BASE_URL } from '@env';

//check des stocks par produits
// export const checkStock = async (productId) => {
//   try {
//     const stockResponse = await axios.get(`${API_BASE_URL}/getStockByProduct/${productId}`);
//     const stockByProduct = stockResponse.data;
//     console.log('res', stockByProduct.data)
//     return stockByProduct; 
//   } catch (error) {
//     console.error("Une erreur s'est produite lors de la récupération du stock :", error);
//   }
// }

// Dans votre fichier API (par exemple apiService.js)

export const getAllStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllStores`);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des magasins:", error);
    throw error; // Renvoie l'erreur pour permettre au composant appelant de la gérer
  }
};


export const fetchAllProductsClickandCollect = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllProductsClickandCollect`);
    return response.data;
  } catch (error) {
    console.error('Une erreur s\'est produite, error products :', error);
    throw error; // Pour propager l'erreur et
  }
}

export const checkStockFormule = async (productIds) => {
  try {
    let stocks = [];
    for (let productId of productIds) {
      const stockResponse = await axios.get(`${API_BASE_URL}/getStockByProduct/${productId}`);
      stocks.push(stockResponse.data);
    }
    //console.log('res', stocks)
    return stocks;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du stock :", error);
  }
}
export const checkStockForSingleProduct = async (productId) => {
  try {
    const stockResponse = await axios.get(`${API_BASE_URL}/getStockByProduct/${productId}`);
    //console.log('res', stockResponse.data)
    return stockResponse.data; 
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du stock :", error);
  }
}

//check des stocks par produits
// export const checkStock = async (productIds) => {
//   try {
//     let stockByProduct = [];
//     for(let i = 0; i < productIds.length; i++){
//       const stockResponse = await axios.get(`${API_BASE_URL}/getStockByProduct/${productIds[i]}`);
//       stockByProduct.push(stockResponse.data);
//     }
//     return stockByProduct; 
//   } catch (error) {
//     console.error("Une erreur s'est produite lors de la récupération du stock :", error);
//   }
// }

//modifier un user
export const modifyUser = async (userId, userUpdate) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/modifyUser/${userId}`, userUpdate);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la mise à jour de l'utilisateur :", error);
    throw error; // Lancer une erreur pour pouvoir la gérer dans votre composant
  }
};

//lister les produits par catégories pour les formules
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProductsofOneCategory/${category}`);
    return response.data;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des produits par catégorie:', error);
    throw error;
  }
};

//recupérer un produit 
export const fetchOneProduct = async  (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getOneProduct/${id}`);
      //console.log('fetchOneproduct', response.data)
      return response.data;
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des produits par catégorie:', error);
      throw error;
    }
};

export const getFamilyProductDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getOneFamillyProduct/${id}`);
     //console.log('res', response.data.familleProduit.nom_famille_produit)
    return { 
      id: response.data.familleProduit.id_famille_produit, 
      name: response.data.familleProduit.nom_famille_produit
  }; 
  } catch (error) {
    // console.error('Une erreur s\'est produite lors de la récupération des détails de la famille de produits:', error);
    return null;
  }
};

//recuperer le nom du magasin
export const getStoreById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getOneStore/${id}`);
    return response.data;
  } catch (error) {
    console.error('Une erreur s est produite lors de la récupération des données du magasin :', error);
    return null;
  }
};

//recuperer famille du produit
export const getFamilyOfProduct = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getFamillyOfProduct/${id}`);
    return response.data;
  } catch (error) {
    console.error('Une erreur s est produite lors de la récupération des données du magasin :', error);
    return null;
  }
};

//recupérer la liste des desserts
export const fetchDessertIds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getDessertIds/ids`);
    //console.log('ids', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dessert IDs:', error);
  }
}

//recupérer la liste des boissons
export const fetchBoissonIds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getBoissonIds/ids`);
    //console.log('ids', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching boisson IDs:', error);
  }
}

export const checkIfUserOrderedOffreSUNToday = async userId => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ordersOfUser/${userId}`);
    const orders = response.data;
    if (orders.length === 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const order of orders) {
      const createdAt = new Date(order.createdAt);
      createdAt.setHours(0, 0, 0, 0);

      if (createdAt.getTime() !== today.getTime()) {
        continue;
      }

      const cartItems = JSON.parse(order.cartString);

      for (const item of cartItems) {
        if (item.type_produit === 'offreSUN') {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error(error);
    throw new Error(
      "An error occurred while trying to fetch the user's orders.",
    );
  }
};

export const fetchAllProductsClickAndCollect = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getAllProductsClickandCollect`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des produits:",
      error,
    );
  }
};

export const updateAntigaspiStock = async item => {
  if (item.antigaspi) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/getUpdateStockAntigaspi`,
        {
          productId: item.productId,
          quantityPurchased: item.qty,
        },
      );

      if (response.status === 200) {
        console.log(
          'Stock antigaspi mis à jour avec succès pour le produit',
          item.libelle,
        );
      }
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du stock antigaspi pour le produit',
        item.libelle,
        ':',
        error,
      );
    }
  }
};

export const updateStock = async item => {
  if (item) {
    try {
      const response = await axios.put(`${API_BASE_URL}/getUpdateStock`, {
        productId: item.productId,
        quantityPurchased: item.qty,
      });

      if (response.status === 200) {
        console.log(
          'Stock mis à jour avec succès pour le produit',
          item.libelle,
        );
      }
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du stock pour le produit',
        item.libelle,
        ':',
        error,
      );
    }
  }
};



