
const bcrypt = require('bcryptjs');
const hashpassword =async (password)=>{
    try {
        const saltRounds =10;
        const hashedpassword = await bcrypt.hash(password,saltRounds);
        return hashedpassword;
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = hashpassword;