import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    queries:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Note"
        }
    ],
    password:{
        type:String,
        required:true
    }

},{timestamps:true})

export const User = mongoose.model("User",userSchema)