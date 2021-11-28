module.exports.registerErrors = (err) => {
    let errors = { firstname: "", lastname: "", email: "", password: "" };

    if (err.message.includes("lastname")) errors.lastname = "Lastname manquante";

    if (err.message.includes("firstname")) errors.firstname = "Firstname manquante";

    if (err.message.includes("email")) errors.email = "Votre email n'est pas correct";
  
    if (err.message.includes("password"))
      errors.password = "Le mot de passe doit faire 6 caractères minimum";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Cet email existe déjà";
  
    return errors;
  };
