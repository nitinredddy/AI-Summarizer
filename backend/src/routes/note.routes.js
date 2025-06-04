import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { createANote } from '../controllers/note.controller.js'

const router = Router()

router.route("/create").post(verifyJWT,upload.single("file"),createANote)

export default router