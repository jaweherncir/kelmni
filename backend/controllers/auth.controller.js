import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const signup=async(req,res)=>{
try{
    const{fullName,username,password,confirmPassword,gender} =req.body
    if(password!=confirmPassword)
        {
            return res.status(400).json({error:"Password don't match"})
        }
        const user=await User.findOne({username})
        if(user)
            {
                return res.status(400).json({error:"Username already exists"})
            }
            //hasg password here
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
const boyProfilPic=`https://avatar.iran.liara.run/public/boy?username=${username}`
const girlProfilPic=`https://avatar.iran.liara.run/public/girl?username=${username}`
const newUser=new User({
    fullName,
    username,
    password:hashedPassword,
    gender,
    profilPic:gender ==="male"? boyProfilPic:girlProfilPic

})
if(newUser){
    //Generate JWT TOKEN HERE
    generateTokenAndSetCookie(newUser._id, res);
        await newUser.save()
    return res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        username:newUser.username,
        profilPic:newUser.profilPic
    })
   
}
else{
    return res.status(400).json({error:"Ivalid user data"})
  
}


}
catch(error)
{
    console.log("Error in singup controller",error.message)
    return res.status(500).json({error:"Internal server error"})

}
}
export const login=async(req,res)=>{
    try{
 const {username,password}=req.body
 const user =await User.findOne({username})
 const isPasswordCorrect=await bcrypt.compare(password,user.password || "")
 if(!user || ! isPasswordCorrect){
    return res.status(400).json({error:"Invalid username or password "})
 }
 generateTokenAndSetCookie(user._id,res);
 res.status(200).json({
    _id:user._id,
    fullName:user.fullName,
    username:user.username,
    profilPic:user.profilPic
})

    }
    catch(error)
    { console.log("Error in login controller",error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }
    catch(error)
    {
        console.log("Error in login controller",error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}