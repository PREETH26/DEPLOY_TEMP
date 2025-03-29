// import express from "express";
// import { uploadFile, getFiles } from "../Controllers/fileController.js";
// import AuthMiddle from "../Middlewares/AuthMiddleware.js";
// import upload from "../Middlewares/fileUpload.js"

// const router = express.Router();

// // Route to upload a file
// router.post("/upload", AuthMiddle, upload.single("file"), uploadFile);

// // Route to get files for a chat
// router.get("/", AuthMiddle, getFiles);

// export default router;

import express from "express";
import { uploadFile, getFiles } from "../Controllers/fileController.js";
import AuthMiddle from "../Middlewares/AuthMiddleware.js";
import upload from "../Middlewares/fileUpload.js";
import axios from "axios";
import cloudinary from "../Config/cloudinary.js";

const router = express.Router();




router.get("/proxy-file", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    console.error("Proxy Error: URL is required");
    return res.status(400).json({ success: false, message: "URL is required" });
  }

  console.log(`Proxy Request: Fetching file from URL: ${url}`);
  console.log(`Range Header: ${req.headers.range || "None"}`);

  try {
    // Get the Range header from the client request (if any)
    const range = req.headers.range;

    // Set up headers for the request to the original file server
    const headers = {};
    if (range) {
      headers.Range = range;
    }

    // Fetch the file from the provided URL (e.g., Cloudinary)
    const response = await axios.get(url, {
      responseType: "stream",
      headers,
    });

    console.log(`Proxy Response: Status ${response.status}`);
    console.log(`Content-Type: ${response.headers["content-type"]}`);
    console.log(`Content-Length: ${response.headers["content-length"]}`);
    if (range) {
      console.log(`Content-Range: ${response.headers["content-range"]}`);
    }
    console.log(`Content-Disposition: ${response.headers["content-disposition"] || "None"}`);

    // Determine the Content-Type based on the file extension
    let contentType = response.headers["content-type"];
    const urlLower = url.toLowerCase();
    if (urlLower.endsWith(".pdf") || contentType === "application/octet-stream") {
      contentType = "application/pdf";
    } else if (urlLower.endsWith(".txt")) {
      contentType = "text/plain";
    } else if (urlLower.endsWith(".docx") || urlLower.endsWith(".doc")) {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (urlLower.endsWith(".pptx")) {
      contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    }

    // Set response headers
    if (range) {
      // If a range request was made, set the appropriate headers
      const contentRange = response.headers["content-range"];
      const contentLength = response.headers["content-length"];
      res.status(206); // Partial Content
      res.setHeader("Content-Range", contentRange);
      res.setHeader("Content-Length", contentLength);
    } else {
      // Full file request
      res.status(200);
      res.setHeader("Content-Length", response.headers["content-length"]);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Accept-Ranges", "bytes"); // Indicate that range requests are supported

    // Ensure the Content-Disposition is set to "inline" for displayable files
    if (
      contentType === "application/pdf" ||
      contentType === "text/plain" ||
      contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      res.setHeader("Content-Disposition", "inline");
    } else if (response.headers["content-disposition"]?.includes("attachment")) {
      res.setHeader("Content-Disposition", "inline");
    }

    // Stream the file to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
      console.error(`Data: ${error.response.data}`);
    }
    res.status(500).json({ success: false, message: "Failed to fetch file", error: error.message });
  }
});


export const getSignedUrlForPptx = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "File URL is required" });
  }

  try {
    // Extract the public ID from the URL
    const urlParts = url.split("/raw/upload/");
    if (urlParts.length < 2) {
      throw new Error("Invalid Cloudinary URL format");
    }
    const publicId = urlParts[1].split("?")[0]; // e.g., chat_files/subject/k0pqr7h8qu2y6jfzdvea

    // Generate a signed URL with a 10-minute expiry
    const signedUrl = cloudinary.url(publicId, {
      resource_type: "raw",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 600, // URL valid for 10 minutes
      attachment: false, // Ensure the file is not forced to download
    });

    console.log("Generated signed URL:", signedUrl); // Debug log
    res.status(200).json({ success: true, signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ success: false, message: "Failed to generate signed URL", error: error.message });
  }
};
router.get("/get-signed-url-for-pptx", getSignedUrlForPptx);

router.post("/upload", AuthMiddle, upload.single("file"), uploadFile);

// Route to get files for a chat
router.get("/", AuthMiddle, getFiles);

// Route to download a file
router.get("/download/:fileId", AuthMiddle, async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        // Fetch the file from Cloudinary
        const response = await axios({
            url: file.fileUrl,
            method: "GET",
            responseType: "stream",
        });

        // Set the correct headers for download
        res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
        res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");

        // Stream the file to the client
        response.data.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;