"use server";

import { put } from "@vercel/blob";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File) {
  try {
    if (!file || file.size === 0) return null;

    // Check if Vercel Blob Token exists
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("Using Vercel Blob for upload...");
      const blob = await put(file.name, file, {
        access: "public",
      });
      return blob.url;
    } 
    
    // Local Fallback for development
    console.log("BLOB_READ_WRITE_TOKEN not found. Falling back to local storage...");
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to prevent collisions
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}
