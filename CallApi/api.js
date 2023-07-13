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

export const modifyUser = async (userId, userUpdate) => {
  try {
    const response = await axios.patch(`http://127.0.0.1:8080/modifyUser/${userId}`, userUpdate);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la mise à jour de l'utilisateur :", error);
    throw error; // Lancer une erreur pour pouvoir la gérer dans votre composant
  }
};
