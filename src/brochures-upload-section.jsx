"use client"

import { useState } from "react"
import { Upload, FileText, Download, Trash2 } from "react-feather"

const BrochuresUploadSection = () => {
  const [loading, setLoading] = useState(false)
  const [productFiles, setProductFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  const [uploadStatus, setUploadStatus] = useState([])
  const [thumbnailImages, setThumbnailImages] = useState([])
  const [brochurePositions, setBrochurePositions] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileChange = (e, setFiles) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDeleteFile = (index) => {
    // Implement delete file logic here
    console.log(`Deleting file at index ${index}`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Upload Brochures Files (Select PDF file)</h2>
        </div>
        <div className="p-4">
          <label className="block mb-4">
            <div
              className={`flex flex-col items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-md appearance-none cursor-pointer ${
                loading ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:border-blue-500 bg-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                  <span className="text-gray-600">Uploading PDFs...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-gray-600">
                    Drop files to upload or <span className="text-blue-600 underline">browse</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    (Files up to 50MB allowed, will be compressed to under 10MB)
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e, setProductFiles)}
              disabled={loading}
            />
          </label>

          {productFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {productFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="h-24 w-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-600 text-center px-2 truncate w-full">{file.name}</span>
                      {/* Progress indicator */}
                      {uploadProgress[index] > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-300 h-1">
                          <div
                            className="bg-blue-500 h-1 transition-all duration-300"
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col items-center justify-center">
                      <span className="text-white text-xs mb-1">{file.name}</span>
                      <span className="text-white text-xs">
                        {uploadStatus[index] === "analyzing" && "Analyzing..."}
                        {uploadStatus[index] === "compressing" && "Compressing..."}
                        {uploadStatus[index] === "compressing-aggressive" && "Deep compression..."}
                        {uploadStatus[index] === "uploading" && `Uploading: ${uploadProgress[index]}%`}
                        {uploadStatus[index] === "completed" && "Completed"}
                        {uploadStatus[index] === "failed" && "Failed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {productFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Brochures Files</h2>
          </div>
          <div className="p-4">
            {productFiles.map((file, index) => (
              <div key={index} className="space-y-4 mb-6 pb-6 border-b border-gray-200 last:border-0">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">File Name:</span>
                  <input
                    type="text"
                    name="fileName"
                    value={file.name || ""}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </label>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Thumbnail Image (Required)</h3>
                  <label className="block">
                    <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                      <span className="flex flex-col items-center space-y-2">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-600">
                          Drop thumbnail image to upload or <span className="text-blue-600 underline">browse</span>
                        </span>
                        <span className="text-xs text-gray-500">(Only one image allowed)</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const newThumbnails = [...thumbnailImages]
                            newThumbnails[index] = file
                            setThumbnailImages(newThumbnails)
                          }
                        }}
                      />
                    </div>
                  </label>
                  {thumbnailImages[index] && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Thumbnail:</h3>
                      <img
                        src={URL.createObjectURL(thumbnailImages[index]) || "/placeholder.svg"}
                        alt="Thumbnail Preview"
                        className="h-24 w-full object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Display Position:</span>
                  <input
                    type="number"
                    value={brochurePositions[index] || ""}
                    onChange={(e) => {
                      const newPositions = [...brochurePositions]
                      newPositions[index] = Number.parseInt(e.target.value) || 0
                      setBrochurePositions(newPositions)
                    }}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lower numbers display first"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Uploaded Brochures</h2>
        </div>
        <div className="p-6">
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No brochures have been uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedFiles
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((file, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={file.thumbnailUrl || "/placeholder.svg"}
                      alt="File thumbnail"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{file.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      {file.pagesIncluded && file.totalPages && file.pagesIncluded < file.totalPages && (
                        <p className="text-amber-600 text-xs mb-2">
                          Note: Contains first {file.pagesIncluded} of {file.totalPages} pages due to size limits
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mb-3">Position: {file.position || 0}</p>
                      <div className="flex flex-col space-y-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 px-3 py-2 bg-blue-50 rounded-md flex items-center justify-center"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Open PDF
                        </a>
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 px-3 py-2 bg-indigo-50 rounded-md flex items-center justify-center"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View with Google Docs
                        </a>
                        <a
                          href={file.url}
                          onClick={(e) => {
                            e.preventDefault();
                            // Force download by creating a temporary link
                            const link = document.createElement('a');
                            
                            // For Cloudinary URLs, modify to ensure proper download
                            let downloadUrl = file.url;
                            
                            // If it's a Cloudinary URL, add the fl_attachment flag to force download
                            if (downloadUrl.includes('cloudinary.com')) {
                              // Insert fl_attachment before the upload part of the URL
                              downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
                            }
                            
                            link.href = downloadUrl;
                            link.setAttribute('download', `${file.title}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="text-green-600 hover:text-green-800 px-3 py-2 bg-green-50 rounded-md flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </a>
                        <a
                          href={`https://drive.google.com/file/d/${file.id}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 px-3 py-2 bg-blue-50 rounded-md flex items-center justify-center"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View on Google Drive
                        </a>
                        <button
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-600 hover:text-red-800 px-3 py-2 bg-red-50 rounded-md flex items-center justify-center"
                        >
                          {/* <Trash2 className="w-4 h-4 mr-2" /> */}
                          Deletesdfs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrochuresUploadSection