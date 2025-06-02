import {connectDB} from './db/index.db.js';
import dotenv from 'dotenv'
import {app} from './app.js';

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Some error has occurred :",error)
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`Server listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed !!! ",error)
})
