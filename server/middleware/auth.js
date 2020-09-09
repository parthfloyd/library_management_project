const jwt = require('jsonwebtoken');
const {Admin,Token, User} = require('../database/sequelize');

const Auth = async (req, res, next) => {
    try {
        const token_value = req.header('Authorization').replace('Bearer ','');
        let decoded = null;
        try{
            decoded = jwt.verify(token_value ,process.env.JWT_SECRET_ADMIN);
        } catch (e){
            decoded = jwt.verify(token_value ,process.env.JWT_SECRET_USER);
        }
        console.log("DECODED"+decoded.role);
        //AUTHENTICATION FOR ADMIN
        if(decoded.role == "ADMIN"){
            const admin = await Admin.findOne({where: {
                email: decoded.email
            }});
    
            if(!admin){
                throw new Error();
            } 
            else {
                const token = await Token.findOne({
                    where: {
                    token_value: token_value
                }})
                if(await admin.hasToken(token)){
                    req.token = token_value;
                    req.email = decoded.email;
                    req.role = decoded.role;
                    next();
                } else {
                    throw new Error();
                }
            }
        }
        //AUTHENTICATION FOR USER 
        else {
            const user = await User.findOne({where: {
                email: decoded.email
            }});
    
            if(!user){
                throw new Error();
            } 
            else {
                const token = await Token.findOne({
                    where: {
                    token_value: token_value
                }})
                if(await user.hasToken(token)){
                    req.token = token_value;
                    req.email = decoded.email;
                    req.role = decoded.role;
                    next();
                } else {
                    throw new Error();
                }
            }
        }
    } catch (e) {
        res.status(401).send({error:"Please authenticate"});
    }
}


module.exports = Auth;