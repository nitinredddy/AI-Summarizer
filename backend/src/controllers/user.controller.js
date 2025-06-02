import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const generateAccessAndRefreshToken = async(userId)=>{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
}

const signup = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new ApiError(400,"Both fields are required")
    }

    const existingUser = await User.findOne({email:email.toLowerCase()})

    if(existingUser){
        throw new ApiError(400,"User with this email exists.")
    }

    const user = await User.create({
        email:email.toLowerCase(),
        password:password
    })

    const userToSend = user.toObject()
    delete userToSend.password
    delete userToSend.refreshToken

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly:true,
        secure:true,
        sameSite:"strict"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,userToSend,"User created successfully"))

})

const afterSignUp = asyncHandler(async(req,res)=>{
    const {name} = req.body
    if(!name){
        throw new ApiError(400,"Your name is required")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken")
    user.name=name

    await user.save()

    const userToSend = user.toObject()
    delete userToSend.password
    delete userToSend.refreshToken
    

    return res 
    .status(200)
    .json(new ApiResponse(200,userToSend,"Name updated successfully"))
})

const login = asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        throw new ApiError(400,"Both fields are required")
    }

    const user = await User.findOne({email:email})

    if(!user){
        throw new ApiError(400,"Couldn't find a user with this email")
    }

    const verifyPassword = await user.checkPassword(password)

    if(!verifyPassword){
        throw new ApiError(400,"Incorrect password")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const userToSend = user.toObject()
    delete userToSend.password
    delete userToSend.refreshToken

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,userToSend,"User logged in successfully"))

})

export {signup,afterSignUp,login}