export  const validateLastName = (value) => {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/;
    if (!value) {
      return "Le nom est obligatoire";
    } else if (!regex.test(value) || value.length < 2 || value.length > 30) {
      return "Le nom doit être composé de 2 à 30 caractères alphabétiques";
    } else {
      return "";
    }
}

export  const validateFirstName = (value) => {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/;
    if (!value) {
      return "Le prénom est obligatoire";
    } else if (!regex.test(value) || value.length < 2 || value.length > 30) {
      return "Le prénom doit être composé de 2 à 30 caractères alphabétiques";
    } else {
      return "";
    }
}

export const validateEmail = (value) => {
    // regex qui correspond à une structure d'e-mail standard
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    if (!value.match(emailRegex)) {
      return "Email non valide";
    }
    return "";
  };

  
  export const validatePassword = password => {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,30}$/
    if (!pattern.test(password)) {
        return "Veuillez entrer une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir une longueur de 5 à 30 caractères." 
    } else {
        return ""
    }
};