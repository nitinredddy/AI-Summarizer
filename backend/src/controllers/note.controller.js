import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { summarizeText } from "../utils/openai.util.js";
import axios from 'axios'
import { User } from "../models/user.model.js";

const createANote = asyncHandler(async (req, res) => {
    try {
        const { originalText } = req.body;
        const file = req.file;

        if (!originalText && !file) {
            throw new ApiError(400, "Either originalText or file is required");
        }

        let extractedText = originalText;
        let fileName = null;

        if (file) {
            console.log("Received file:", file);

            const uploaded = await uploadCloudinary(file.path);
            fileName = uploaded.original_filename;
            const fileUrl = uploaded.secure_url;

            const response = await axios.get(fileUrl);
            extractedText = response.data;
        }

        const summary = await summarizeText(extractedText);

        const note = await Note.create({
            originalText: extractedText,
            summary,
            file: fileName,
            user: req.user._id,
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { queries: note._id },
        });

        return res.status(200).json(new ApiResponse(200, note, "Note created successfully"));

    } catch (error) {
        console.error("Backend error in createANote:", error);
        return res.status(500).json({ success: false, message: "Server error", details: error.message });
    }
});


export {createANote}