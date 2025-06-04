import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))


import userRouter from './routes/user.routes.js'
import noteRouter from './routes/note.routes.js'

app.use("/api/v1/user",userRouter)
app.use("/api/v1/notes",noteRouter)

export {app}