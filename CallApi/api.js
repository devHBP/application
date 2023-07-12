import axios from 'axios';

//check des stocks par produits

export const checkStock = async (productId) => {
  try {
    const stockResponse = await axios.get(`http://localhost:8080/getStockByProduct/${productId}`);
    const stockByProduct = stockResponse.data;
    return stockByProduct; 
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du stock :", error);
  }
}
