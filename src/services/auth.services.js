const db = require("../models/mysql");

const registerUser = async (username, password, firstName, lastName, email, phone) => {
    try {

        const newUser = await db.User.create({ username, password, firstName, lastName, email, phone });
        
        return newUser;
       
    } catch (error) {
        throw error;
   }
}

const loginUser = async (username, password) => {
    try {
      const user = await db.User.findOne({ where: { username } });
      if (!user) throw new Error('Invalid username or password');
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error('Invalid username or password');
  
      const token = user.generateAuthToken();
  
      return token;
    } catch (error) {
      throw new Error(`Error logging in user: ${error.message}`);
    }
  };
  

module.exports = {registerUser, loginUser};