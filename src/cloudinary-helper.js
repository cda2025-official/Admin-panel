/**
 * Helper functions for Cloudinary integration
 */

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dsztdjn02"
const CLOUDINARY_UPLOAD_PRESET = "chintamani" // You may need to create an upload preset in your Cloudinary dashboard

/**
 * Uploads an image to Cloudinary and returns the optimized image URL
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<string>} - The Cloudinary URL of the uploaded image
 */
export const uploadToCloudinary = async (file, onProgress = null) => {
  try {
    // Create a FormData object to send the image to Cloudinary
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME)

    // Add transformation parameters for compression
    formData.append("quality", "auto:good") // Use Cloudinary's auto quality
    formData.append("fetch_format", "auto") // Auto select best format

    // Use XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Set up progress tracking if callback provided
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        }
      }

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, true)

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          console.log("Cloudinary upload successful:", response)
          resolve(response)
        } else {
          console.error("Cloudinary upload failed:", xhr.responseText)
          reject(new Error("Upload failed"))
        }
      }

      xhr.onerror = () => {
        console.error("Cloudinary XHR error")
        reject(new Error("Upload failed"))
      }

      xhr.send(formData)
    })
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error)
    throw error
  }
}

/**
 * Compresses an image using Cloudinary and returns a File object
 * @param {File} image - The image file to compress
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<File>} - A new File object with the compressed image
 */
export const compressImage = async (image, onProgress = null) => {
  try {
    // Upload to Cloudinary
    const data = await uploadToCloudinary(image, onProgress)

    // Convert Cloudinary URL to Blob
    const compressedImageResponse = await fetch(data.secure_url)
    const compressedImageBlob = await compressedImageResponse.blob()

    // Create a File object from the Blob
    const compressedFile = new File([compressedImageBlob], image.name, {
      type: image.type,
      lastModified: new Date().getTime(),
    })

    console.log(
      `Compressed image: ${image.name}. Original size: ${(image.size / 1024).toFixed(2)}KB, New size: ${(compressedFile.size / 1024).toFixed(2)}KB`,
    )

    return {
      file: compressedFile,
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      originalSize: image.size,
      compressedSize: compressedFile.size,
      compressionRatio: ((1 - compressedFile.size / image.size) * 100).toFixed(2) + "%",
    }
  } catch (error) {
    console.error("Error compressing image:", error)
    // Return original image if compression fails
    return {
      file: image,
      error: error.message,
      originalSize: image.size,
      compressedSize: image.size,
      compressionRatio: "0%",
    }
  }
}

