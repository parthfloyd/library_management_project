const AdminCheck = async(req,res,next)=> {
    if(req.role === "ADMIN"){
        next();
    } else {
        res.send("Only Admin Access Allowed");
    }
}

module.exports = AdminCheck;