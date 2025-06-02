import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    originalText:{
        type:String,
        required:true
    },
    summary:String,
    fileName:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const Note = mongoose.model("Note",noteSchema)