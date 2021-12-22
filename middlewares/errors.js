const errorStatus = {   
  cpfAlreadyRegistered: { code: 400, message: 'CPF já cadastrado' },
  EmailAlreadyRegistered: { code: 409, message: 'Email already registered' },
  AllFieldsRequired: { code: 401, message: 'All fields must be filled' },
  InvalidEntries: { code: 400, message: 'Invalid entries. Try again.' },
  userLoginError: { message: 'Incorrect username or password', code: 401 },
  ONLYJPG: { code: 404, message: 'Only jpeg files are allowed' },
  RecipeNotFound: { code: 404, message: 'Recipe not found' },
};

module.exports = (err, _req, res, _next) => {  
  // if (err.code && err.message) {
  //   const { code, message } = err;
  //   return res.status(code).json({ message });
  // }
  // console.log(err)
  // const { error } = err;
  const { code, message } = errorStatus[err];
  // console.log(code, message)

  res.status(code).json({ message: message });
};