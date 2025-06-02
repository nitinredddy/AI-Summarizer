import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { summarizeText } from "../utils/openai.util.js";
import axios from 'axios'

const createANote = asyncHandler(async(req,res)=>{
    const {originalText} = req.body
    const file = req.file

    const fileLocalPath = file.path

    let extractedText = originalText

    if(!originalText && !file){
        throw new ApiError(400,"Either original or file is required")
    }

    let fileName = null

    if(file){
        const uploaded = await uploadCloudinary(fileLocalPath)
        fileName = uploaded.original_filename
        const fileUrl = uploaded.secure_url

        const response = await axios.get(fileUrl)
        extractedText = response.data
    }    

    let summary;

    try {
        summary = await summarizeText(extractedText)
    } catch (error) {
        console.log("OpenAI error : ",error)
        throw new ApiError(500,"Summarization failed")
    }

    const note = await Note.create({
        originalText:extractedText,
        summary:summary,
        fileName:fileName,
        user:req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200,note,"Note created successfully"))
})

export {createANote}