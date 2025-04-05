"use client"

import { useState, useEffect, useRef } from "react"
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./firebase"
import {
  Upload,
  ImageIcon,
  Trash2,
  Save,
  Youtube,
  Video,
  Home,
  Image,
  FileText,
  Menu,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Search,
  Database,
} from "lucide-react"

export default function MainPanel() {
  const [heroImages, setHeroImages] = useState([])
  const [brandImages, setBrandImages] = useState([])
  const [productImages, setProductImages] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [productFiles, setProductFiles] = useState([])
  const [productDetails, setProductDetails] = useState([])
  const [uploadedImages, setUploadedImages] = useState({})

  const [uploadedProducts, setUploadedProducts] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [thumbnailImages, setThumbnailImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [productCategoriesState, setProductCategoriesState] = useState([])
  const [brandNames, setBrandNames] = useState([
    "CD Exclusive",
    "Wall panelling",
    "Exterior",
    "Rafter",
    "Laminates",
  ])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [brandImageFiles, setBrandImageFiles] = useState([])
  const [youtubeLinks, setYoutubeLinks] = useState([])
  const [youtubeInput, setYoutubeInput] = useState("")
  const [uploadedYoutubeLinks, setUploadedYoutubeLinks] = useState([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [visitors, setVisitors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)
  const [latestImages, setLatestImages] = useState([])
  const [latestImageCaptions, setLatestImageCaptions] = useState([])
  const [productPositions, setProductPositions] = useState([])
  const [galleryPositions, setGalleryPositions] = useState([])
  const [brochurePositions, setBrochurePositions] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadStatus, setUploadStatus] = useState({})
  const [isClicked, setIsClicked] = useState(false)
  const [editingBrochureIndex, setEditingBrochureIndex] = useState(null)
  const [editingBrochureTitle, setEditingBrochureTitle] = useState("")

  const fileInputRef = useRef()

  const showAlertAndReload = (message) => {
    alert(message)
    window.location.reload()
  }

  const productCategories = ["Glorio", "Greenlam", "Display-KIT", "CDexclusive", "Additional"]
  const productCategories2 = [
    "Flute Story",
    "Crysta",
    "Stencils",
    "Miracco",
    "Iris Club",
    "Antique Panel",
    "Emporio",
    "Pluto",
    "Styrio",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "data", "adminImages")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUploadedImages(docSnap.data())
        }

        const productsDocRef = doc(db, "data", "adminProducts")
        const productsDocSnap = await getDoc(productsDocRef)
        if (productsDocSnap.exists()) {
          setUploadedProducts(productsDocSnap.data().products || [])
        }

        const filesDocRef = doc(db, "data", "adminFiles")
        const filesDocSnap = await getDoc(filesDocRef)
        if (filesDocSnap.exists()) {
          setUploadedFiles(filesDocSnap.data().files || [])
        }

        const videosDocRef = doc(db, "data", "galleryVideos")
        const videosDocSnap = await getDoc(videosDocRef)
        if (videosDocSnap.exists() && videosDocSnap.data().videos) {
          setUploadedYoutubeLinks(videosDocSnap.data().videos || [])
        }

        const visitorsCollectionRef = collection(db, "visitors")
        const visitorsQuery = query(visitorsCollectionRef, orderBy("createdAt", "desc"))
        const visitorsSnapshot = await getDocs(visitorsQuery)
        const visitorsData = visitorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setVisitors(visitorsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleFileChange = async (e, setState) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      setLoading(true)
      setState(files)
    } finally {
      setLoading(false)
    }
  }

  const uploadToCloudinary = async (file, type = "default") => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "Glorio")
    data.append("cloud_name", "dze3eqftf")

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dze3eqftf/image/upload", {
        method: "POST",
        body: data,
      })

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`)
      }

      const uploadImgurl = await res.json()

      let transformUrl = uploadImgurl.secure_url

      switch (type) {
        case "gallery":
          transformUrl = transformUrl.replace("/upload/", "/upload/q_auto,f_auto,w_1600,c_limit/")
          break
        case "product":
          transformUrl = transformUrl.replace("/upload/", "/upload/q_auto,f_auto,w_800,c_limit/")
          break
        case "thumbnail":
          transformUrl = transformUrl.replace("/upload/", "/upload/q_auto,f_auto,w_400,c_limit/")
          break
        default:
          transformUrl = transformUrl.replace("/upload/", "/upload/q_auto,f_auto,w_1200,c_limit/")
      }

      return transformUrl
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw error
    }
  }

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault()
    if (!youtubeInput.trim()) return

    try {
      if (youtubeInput.includes("youtube.com") || youtubeInput.includes("youtu.be")) {
        let videoId = ""
        if (youtubeInput.includes("youtube.com/watch?v=")) {
          videoId = youtubeInput.split("youtube.com/watch?v=")[1].split("&")[0]
        } else if (youtubeInput.includes("youtu.be/")) {
          videoId = youtubeInput.split("youtu.be/")[1].split("?")[0]
        }

        if (videoId) {
          const newVideo = {
            id: videoId,
            url: youtubeInput,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            addedAt: new Date().toISOString(),
          }

          setYoutubeLinks([...youtubeLinks, newVideo])
          setYoutubeInput("")
        } else {
          alert("Invalid YouTube URL. Please enter a valid YouTube video link.")
        }
      } else {
        alert("Please enter a valid YouTube URL")
      }
    } catch (error) {
      console.error("Error adding YouTube video:", error)
      alert("Error adding YouTube video. Please try again.")
    }
  }

  const handleRemoveYoutubeLink = (index) => {
    const updatedLinks = [...youtubeLinks]
    updatedLinks.splice(index, 1)
    setYoutubeLinks(updatedLinks)
  }

  const handleDeleteYoutubeLink = async (index) => {
    try {
      const updatedLinks = [...uploadedYoutubeLinks]
      updatedLinks.splice(index, 1)

      const docRef = doc(db, "data", "galleryVideos")
      await updateDoc(docRef, { videos: updatedLinks })

      setUploadedYoutubeLinks(updatedLinks)
      alert("YouTube video deleted successfully!")
    } catch (error) {
      console.error("Error deleting YouTube video:", error)
      alert("Error deleting YouTube video.")
    }
  }

  const handleSaveImages = async () => {
    setLoading(true)
    try {
      if (productFiles.length > 0 && thumbnailImages.length !== productFiles.length) {
        alert("Please upload a thumbnail image for each product file.")
        setLoading(false)
        return
      }

      const uploadedHeroImages =
        heroImages.length > 0
          ? await Promise.all(heroImages.map((image) => uploadToCloudinary(image)))
          : uploadedImages.heroImages || []

      const uploadedBrandImages = await Promise.all(brandImages.map((image) => uploadToCloudinary(image)))

      let combinedBrandImages = [...(uploadedImages.brandImages || []), ...uploadedBrandImages]
      if (combinedBrandImages.length > 4) {
        const imagesToDelete = combinedBrandImages.slice(0, combinedBrandImages.length - 5)
        for (const imageUrl of imagesToDelete) {
          try {
            const updatedImages = { ...uploadedImages }
            updatedImages.brandImages = updatedImages.brandImages.filter((url) => url !== imageUrl)
            await updateDoc(doc(db, "data", "adminImages"), updatedImages)
          } catch (deleteError) {
            console.error("Error deleting image:", deleteError)
          }
        }
        combinedBrandImages = combinedBrandImages.slice(-5)
      }

      const uploadedBrandImagesWithName = await Promise.all(
        brandImageFiles.map((image) => uploadToCloudinary(image)),
      ).then((urls) =>
        urls.map((url) => ({
          url,
          brandName: selectedBrand,
        })),
      )

      const uploadedGalleryImages = await Promise.all(
        galleryImages.map(async (image, index) => {
          const cloudinaryUrl = await uploadToCloudinary(image, "gallery")
          return {
            url: cloudinaryUrl,
            position: galleryPositions[index] || 0,
          }
        }),
      )

      const uploadedProductImages = await Promise.all(
        productImages.map(async (image, index) => {
          const cloudinaryUrl = await uploadToCloudinary(image, "product")
          return {
            url: cloudinaryUrl,
            position: productPositions[index] || 0,
          }
        }),
      )

      const uploadedThumbnailImages = await Promise.all(
        thumbnailImages.map((image) => uploadToCloudinary(image, "thumbnail")),
      )

      const uploadedLatestImagesWithCaptions = await Promise.all(
        latestImages.map((image, index) =>
          uploadToCloudinary(image).then((url) => ({
            url,
            caption: latestImageCaptions[index] || "",
            uploadedAt: new Date().toISOString(),
          })),
        ),
      )

      const updatedData = {
        heroImages: uploadedHeroImages,
        brandImages: combinedBrandImages,
        productImages: [...(uploadedImages.productImages || []), ...uploadedProductImages],
        galleryImages: [...(uploadedImages.galleryImages || []), ...uploadedGalleryImages],
        brandImagesWithName: [...(uploadedImages.brandImagesWithName || []), ...uploadedBrandImagesWithName],
        latestImages: [...(uploadedImages.latestImages || []), ...uploadedLatestImagesWithCaptions],
      }
      await setDoc(doc(db, "data", "adminImages"), updatedData)
      setUploadedImages(updatedData)

      const updatedProducts = [...uploadedProducts]
      productDetails.forEach((product, index) => {
        updatedProducts.push({
          heading: product.heading,
          description: product.description,
          imageUrl: uploadedProductImages[index].url,
          category: productCategoriesState[index],
          position: productPositions[index] || 0,
        })
      })
      await setDoc(doc(db, "data", "adminProducts"), { products: updatedProducts })
      setUploadedProducts(updatedProducts)

      const uploadedProductFiles = await Promise.all(
        productFiles.map(async (file, index) => {
          // For Google Drive URLs, we don't need to upload to Cloudinary
          const thumbnailUrl = await uploadToCloudinary(thumbnailImages[index], "thumbnail")
          return {
            url: file.url, // Use the Google Drive URL directly
            title: file.title || "PDF Document",
            thumbnailUrl: thumbnailUrl,
            position: brochurePositions[index] || 0,
          }
        }),
      )

      const updatedFiles = [...uploadedFiles, ...uploadedProductFiles]
      await setDoc(doc(db, "data", "adminFiles"), { files: updatedFiles })
      setUploadedFiles(updatedFiles)

      if (youtubeLinks.length > 0) {
        const docRef = doc(db, "data", "galleryVideos")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const existingVideos = docSnap.data().videos || []
          await updateDoc(docRef, {
            videos: [...existingVideos, ...youtubeLinks],
          })
        } else {
          await setDoc(docRef, {
            videos: youtubeLinks,
          })
        }
      }

      alert("Images uploaded to Cloudinary and saved successfully!")
      showAlertAndReload("Upload successful!")
    } catch (error) {
      console.error("Error saving data:", error)
      alert(`Error saving data: ${error.message}`)
    } finally {
      setLoading(false)
      setUploadProgress({})
      setUploadStatus({})
    }
  }

  const handleDeleteImage = async (category, index) => {
    try {
      const imageUrl = uploadedImages[category][index].url || uploadedImages[category][index]

      const updatedImages = { ...uploadedImages }
      updatedImages[category] = updatedImages[category].filter((_, i) => i !== index)
      await updateDoc(doc(db, "data", "adminImages"), updatedImages)

      setUploadedImages(updatedImages)
      alert("Image deleted successfully!")
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Error deleting image.")
    }
  }

  const handleDelete = async (index) => {
    try {
      const updatedProducts = [...uploadedProducts]
      updatedProducts.splice(index, 1)
      await setDoc(doc(db, "data", "adminProducts"), { products: updatedProducts })
      setUploadedProducts(updatedProducts)
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product.")
    }
  }

  const handleDeleteFile = async (index) => {
    try {
      const updatedFiles = [...uploadedFiles]
      updatedFiles.splice(index, 1)
      await setDoc(doc(db, "data", "adminFiles"), { files: updatedFiles })
      setUploadedFiles(updatedFiles)
      alert("File deleted successfully!")
    } catch (error) {
      console.error("Error deleting file:", error)
      alert("Error deleting file.")
    }
  }

  const handleProductDetails = (index, event) => {
    const updatedProductDetails = [...productDetails]
    if (!updatedProductDetails[index]) {
      updatedProductDetails[index] = {}
    }
    updatedProductDetails[index][event.target.name] = event.target.value
    setProductDetails(updatedProductDetails)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm) ||
      (visitor.email && visitor.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visitor.addInfo && visitor.addInfo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visitor.type && visitor.type.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const displayedVisitors = filteredVisitors.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const handleDeleteLatestImage = async (index) => {
    try {
      const imageToDelete = uploadedImages.latestImages[index]
      const updatedImages = { ...uploadedImages }
      updatedImages.latestImages = updatedImages.latestImages.filter((_, i) => i !== index)
      await updateDoc(doc(db, "data", "adminImages"), updatedImages)

      setUploadedImages(updatedImages)
      alert("Image deleted successfully!")
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Error deleting image.")
    }
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "brand", label: "Brand Images", icon: <Image className="w-5 h-5" /> },
    { id: "product", label: "Product Images", icon: <Image className="w-5 h-5" /> },
    { id: "gallery", label: "Gallery Images", icon: <Image className="w-5 h-5" /> },
    { mainid: "broch", id: "brochures", label: "Brochures", icon: <FileText className="w-5 h-5" /> },
    { id: "youtube", label: "YouTube Videos", icon: <Youtube className="w-5 h-5" /> },
    { id: "latest", label: "Latest Images", icon: <Image className="w-5 h-5" /> },
    { id: "leads", label: "Leads", icon: <Database className="w-5 h-5" /> },
  ]

  const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-blue-600 opacity-75 animate-pulse"></div>
      </div>
    </div>
  )

  const handleSaveBrochureTitle = async (index) => {
    try {
      const updatedFiles = [...uploadedFiles]
      updatedFiles[index].title = editingBrochureTitle
      await setDoc(doc(db, "data", "adminFiles"), { files: updatedFiles })
      setUploadedFiles(updatedFiles)
      setEditingBrochureIndex(null)
      setEditingBrochureTitle("")
      alert("Brochure title updated successfully!")
    } catch (error) {
      console.error("Error updating brochure title:", error)
      alert("Error updating brochure title.")
    }
  }

  const BrochuresUploadSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Add Brochure from Google Drive</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Google Drive PDF URL:</span>
              <input
                type="text"
                name="pdfUrl"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://drive.google.com/file/d/..."
                onChange={(e) => {
                  const newFiles = [...productFiles]
                  if (!newFiles[0]) newFiles[0] = { url: "", title: "PDF Document" }
                  newFiles[0].url = e.target.value
                  setProductFiles(newFiles)
                }}
                value={productFiles[0]?.url || ""}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the shareable link from Google Drive (make sure it's set to "Anyone with the link can view")
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">PDF Title:</span>
              <input
                type="text"
                name="pdfTitle"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a title for this PDF"
                onChange={(e) => {
                  const newFiles = [...productFiles]
                  if (!newFiles[0]) newFiles[0] = { url: "", title: "" }
                  newFiles[0].title = e.target.value
                  setProductFiles(newFiles)
                }}
                value={productFiles[0]?.title || ""}
              />
            </label>
          </div>

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
                      newThumbnails[0] = file
                      setThumbnailImages(newThumbnails)
                    }
                  }}
                />
              </div>
            </label>
            {thumbnailImages[0] && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Thumbnail:</h3>
                <img
                  src={URL.createObjectURL(thumbnailImages[0]) || "/placeholder.svg"}
                  alt="Thumbnail Preview"
                  className="h-24 w-full object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>

          <label className="block mt-4">
            <span className="text-sm font-medium text-gray-700">Display Position:</span>
            <input
              type="number"
              value={brochurePositions[0] || ""}
              onChange={(e) => {
                const newPositions = [...brochurePositions]
                newPositions[0] = Number.parseInt(e.target.value) || 0
                setBrochurePositions(newPositions)
              }}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lower numbers display first"
            />
          </label>
        </div>
      </div>

      {/* Uploaded Brochures display section remains the same */}
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
                      {editingBrochureIndex === index ? (
                        <div className="mb-3">
                          <input
                            type="text"
                            value={editingBrochureTitle}
                            onChange={(e) => setEditingBrochureTitle(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            placeholder="Enter brochure title"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveBrochureTitle(index)}
                              className="text-green-600 hover:text-green-800 px-3 py-1 bg-green-50 rounded-md flex items-center justify-center text-sm"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingBrochureIndex(null)
                                setEditingBrochureTitle("")
                              }}
                              className="text-gray-600 hover:text-gray-800 px-3 py-1 bg-gray-50 rounded-md flex items-center justify-center text-sm"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-800">{file.title}</h3>
                          <button
                            onClick={() => {
                              setEditingBrochureIndex(index)
                              setEditingBrochureTitle(file.title || "")
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-md"
                            title="Edit title"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                        </div>
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
                        <button
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-600 hover:text-red-800 px-3 py-2 bg-red-50 rounded-md flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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

  const handleClick = () => {
    console.log(isClicked)
    setIsClicked(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-blue-100 text-sm">Image Management Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md hover:bg-blue-700"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>

        {loading && <LoadingSpinner />}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`bg-white shadow-md z-20 ${sidebarOpen ? "fixed inset-0 w-64" : "hidden"} md:relative md:block md:w-64 md:min-w-64 transition-all duration-300`}
          >
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">Navigation</h2>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li id="navbar-key" key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 mt-auto border-t">
              <button
                onClick={handleSaveImages}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? "Uploading..." : "Save All"}
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4">
            <div className="container mx-auto">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-medium text-blue-800">Hero Images</h3>
                        <p className="text-3xl font-bold text-blue-600">{uploadedImages.heroImages?.length || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h3 className="text-lg font-medium text-green-800">Brand Images</h3>
                        <p className="text-3xl font-bold text-green-600">{uploadedImages.brandImages?.length || 0}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h3 className="text-lg font-medium text-purple-800">Product Images</h3>
                        <p className="text-3xl font-bold text-purple-600">{uploadedProducts.length || 0}</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <h3 className="text-lg font-medium text-amber-800">Gallery Images</h3>
                        <p className="text-3xl font-bold text-amber-600">{uploadedImages.galleryImages?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Count
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Products</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {uploadedProducts.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => setActiveTab("product")}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                              onClick={handleClick}
                            >
                              Brochures
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {uploadedFiles.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => setActiveTab("brochures")}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              YouTube Videos
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {uploadedYoutubeLinks.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => setActiveTab("youtube")}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Brand Images Tab */}
              {activeTab === "brand" && (
                <div className="space-y-6">
                  {/* Brand Images with Brand Name */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-800">
                        Brand Images (adding images for specific brand carousel)
                      </h2>
                    </div>
                    <div className="p-4">
                      <label className="block mb-4">
                        <span className="text-sm font-medium text-gray-700">Select Brand:</span>
                        <select
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a brand</option>
                          {brandNames.map((brand, index) => (
                            <option key={index} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block mb-4">
                        <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                          <span className="flex flex-col items-center space-y-2">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="font-medium text-gray-600">
                              Drop brand images to upload or <span className="text-blue-600 underline">browse</span>
                            </span>
                            <span className="text-xs text-gray-500">(Select multiple images if needed)</span>
                          </span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setBrandImageFiles)}
                          />
                        </div>
                      </label>
                      {brandImageFiles.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Brand Images:</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {brandImageFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt="Preview"
                                  className="h-24 w-full object-cover rounded-md border border-gray-200"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs">{file.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display Uploaded Brand Images with Names */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Uploaded Brand Images with Names</h2>
                    </div>
                    <div className="p-6">
                      {!uploadedImages.brandImagesWithName || uploadedImages.brandImagesWithName.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p>No brand images with names have been uploaded yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {uploadedImages.brandImagesWithName.map((image, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                              <div className="relative group">
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={`Brand image for ${image.brandName}`}
                                  className="h-48 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                  <Trash2
                                    className="w-5 h-5 text-white cursor-pointer"
                                    onClick={() => handleDeleteImage("brandImagesWithName", index)}
                                  />
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-800">{image.brandName}</h3>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display Uploaded Brand Images */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Uploaded Brand Images</h2>
                    </div>
                    <div className="p-6">
                      {!uploadedImages.brandImages || uploadedImages.brandImages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p>No brand images have been uploaded yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {uploadedImages.brandImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={typeof image === "object" ? image.url : image}
                                alt="Uploaded brand image"
                                className="h-40 w-full object-cover rounded-md border border-gray-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                <Trash2
                                  className="w-5 h-5 text-white cursor-pointer"
                                  onClick={() => handleDeleteImage("brandImages", index)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Product Images Tab */}
              {activeTab === "product" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-800">
                        Upload Product Images [for product section] (Select single image at a time)
                      </h2>
                    </div>
                    <div className="p-4">
                      <label className="block mb-4">
                        <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                          <span className="flex flex-col items-center space-y-2">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="font-medium text-gray-600">
                              Drop files to upload or <span className="text-blue-600 underline">browse</span>
                            </span>
                            <span className="text-xs text-gray-500">(Select single image at a time)</span>
                          </span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setProductImages)}
                          />
                        </div>
                      </label>
                      {productImages.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Product Images:</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {productImages.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt="Preview"
                                  className="h-24 w-full object-cover rounded-md border border-gray-200"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs">{file.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details with Position */}
                  {productImages.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Product Details</h2>
                      </div>
                      <div className="p-4">
                        {productImages.map((image, index) => (
                          <div key={index} className="space-y-4 mb-6 pb-6 border-b border-gray-200 last:border-0">
                            <label className="block">
                              <span className="text-sm font-medium text-gray-700">Heading:</span>
                              <input
                                type="text"
                                name="heading"
                                value={productDetails[index]?.heading || ""}
                                onChange={(e) => handleProductDetails(index, e)}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm font-medium text-gray-700">Description:</span>
                              <textarea
                                name="description"
                                value={productDetails[index]?.description || ""}
                                onChange={(e) => handleProductDetails(index, e)}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm font-medium text-gray-700">Category:</span>
                              <select
                                name="category"
                                value={productCategoriesState[index] || ""}
                                onChange={(e) => {
                                  const newCategories = [...productCategoriesState]
                                  newCategories[index] = e.target.value
                                  setProductCategoriesState(newCategories)
                                }}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select a category</option>
                                {productCategories2.map((category, i) => (
                                  <option key={i} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="block">
                              <span className="text-sm font-medium text-gray-700">Display Position:</span>
                              <input
                                type="number"
                                value={productPositions[index] || ""}
                                onChange={(e) => {
                                  const newPositions = [...productPositions]
                                  newPositions[index] = Number.parseInt(e.target.value) || 0
                                  setProductPositions(newPositions)
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

                  {/* Display Uploaded Products */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Uploaded Products</h2>
                    </div>
                    <div className="p-6">
                      {uploadedProducts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p>No products have been uploaded yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {uploadedProducts
                            .sort((a, b) => (a.position || 0) - (b.position || 0))
                            .map((product, index) => (
                              <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                                <img
                                  src={product.imageUrl || "/placeholder.svg"}
                                  alt="Product preview"
                                  className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                  <h3 className="text-lg font-medium text-gray-800 mb-2">{product.heading}</h3>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">{product.description}</p>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {product.category}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-500">
                                        Position: {product.position || 0}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDelete(index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-5 h-5" />
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
              )}

              {/* Gallery Images Tab */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-800">Upload Gallery Images</h2>
                    </div>
                    <div className="p-4">
                      <label className="block mb-4">
                        <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                          <span className="flex flex-col items-center space-y-2">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="font-medium text-gray-600">
                              Drop files to upload or <span className="text-blue-600 underline">browse</span>
                            </span>
                            <span className="text-xs text-gray-500">(Select multiple files if needed)</span>
                          </span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setGalleryImages)}
                          />
                        </div>
                      </label>
                      {galleryImages.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Gallery Images:</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {galleryImages.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt="Preview"
                                  className="h-24 w-full object-cover rounded-md border border-gray-200"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs">{file.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Image Positions */}
                  {galleryImages.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Gallery Image Positions</h2>
                      </div>
                      <div className="p-4">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="space-y-4 mb-6 pb-6 border-b border-gray-200 last:border-0">
                            <div className="flex items-center gap-4">
                              <img
                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                alt="Preview"
                                className="h-24 w-24 object-cover rounded-md border border-gray-200"
                              />
                              <label className="block flex-1">
                                <span className="text-sm font-medium text-gray-700">Display Position:</span>
                                <input
                                  type="number"
                                  value={galleryPositions[index] || ""}
                                  onChange={(e) => {
                                    const newPositions = [...galleryPositions]
                                    newPositions[index] = Number.parseInt(e.target.value) || 0
                                    setGalleryPositions(newPositions)
                                  }}
                                  className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Lower numbers display first"
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Display Uploaded Gallery Images */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Uploaded Gallery Images</h2>
                    </div>
                    <div className="p-6">
                      {!uploadedImages.galleryImages || uploadedImages.galleryImages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p>No gallery images have been uploaded yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {uploadedImages.galleryImages
                            ?.sort((a, b) => (a.position || 0) - (b.position || 0))
                            .map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={typeof image === "object" ? image.url : image}
                                  alt="Uploaded gallery image"
                                  className="h-40 w-full object-cover rounded-md border border-gray-200"
                                />
                                <div className="absolute inset-0 flex flex-col justify-between p-2 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                  <div className="text-white text-xs">Position: {image.position || 0}</div>
                                  <div className="flex justify-end">
                                    <Trash2
                                      className="w-5 h-5 text-white cursor-pointer"
                                      onClick={() => handleDeleteImage("galleryImages", index)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Brochures Tab */}
              {activeTab === "brochures" && <BrochuresUploadSection />}

              {/* YouTube Videos Tab */}
              {activeTab === "youtube" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
                      <Youtube className="w-5 h-5 text-red-600 mr-2" />
                      <h2 className="font-semibold text-gray-800">Add YouTube Videos</h2>
                    </div>
                    <div className="p-4">
                      <form onSubmit={handleYoutubeSubmit} className="mb-4">
                        <label className="block mb-2">
                          <span className="text-sm font-medium text-gray-700">Add YouTube Video URL:</span>
                          <div className="mt-1 flex">
                            <input
                              type="text"
                              value={youtubeInput}
                              onChange={(e) => setYoutubeInput(e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="flex-1 p-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="submit"
                              className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                            >
                              Add Video
                            </button>
                          </div>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Paste a YouTube video URL (e.g., https://www.youtube.com/watch?v=XXXXXXXXXXX or
                          https://youtu.be/XXXXXXXXXXX)
                        </p>
                      </form>

                      {youtubeLinks.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected YouTube Videos:</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {youtubeLinks.map((video, index) => (
                              <div key={index} className="border rounded-md overflow-hidden bg-gray-50">
                                <div className="aspect-video bg-gray-200 relative">
                                  <img
                                    src={video.thumbnailUrl || "/placeholder.svg"}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-red-600/80 flex items-center justify-center">
                                      <Video className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 truncate flex-1">{video.url}</span>
                                    <button
                                      onClick={() => handleRemoveYoutubeLink(index)}
                                      className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display Uploaded YouTube Videos */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Youtube className="w-6 h-6 text-red-600 mr-2" />
                        Uploaded YouTube Videos
                      </h2>
                    </div>
                    <div className="p-6">
                      {uploadedYoutubeLinks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Video className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p>No YouTube videos have been uploaded yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {uploadedYoutubeLinks.map((video, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                              <div className="aspect-video bg-gray-200 relative">
                                <img
                                  src={video.thumbnailUrl || "/placeholder.svg"}
                                  alt="Video thumbnail"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-red-600/80 flex items-center justify-center hover:bg-red-700/80 transition-colors"
                                  >
                                    <Video className="w-6 h-6 text-white" />
                                  </a>
                                </div>
                              </div>
                              <div className="p-3">
                                <div className="flex justify-between items-center">
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1"
                                  >
                                    {video.url}
                                  </a>
                                  <button
                                    onClick={() => handleDeleteYoutubeLink(index)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Added: {new Date(video.addedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Latest Images Tab */}
              {activeTab === "latest" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-800">Upload Latest Images with Captions</h2>
                    </div>
                    <div className="p-4">
                      <label className="block mb-4">
                        <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                          <span className="flex flex-col items-center space-y-2">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="font-medium text-gray-600">
                              Drop files to upload or <span className="text-blue-600 underline">browse</span>
                            </span>
                            <span className="text-xs text-gray-500">(Select multiple files if needed)</span>
                          </span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setLatestImages)}
                          />
                        </div>
                      </label>
                      {latestImages.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Latest Images:</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {latestImages.map((file, index) => (
                              <div key={index} className="border rounded-md p-4 bg-gray-50">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="relative group w-full md:w-1/3">
                                    <img
                                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                                      alt="Preview"
                                      className="h-48 w-full object-cover rounded-md border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                      <span className="text-white text-xs">{file.name}</span>
                                    </div>
                                  </div>
                                  <div className="w-full md:w-2/3">
                                    <label className="block">
                                      <span className="text-sm font-medium text-gray-700">Caption:</span>
                                      <textarea
                                        value={latestImageCaptions[index] || ""}
                                        onChange={(e) => {
                                          const newCaptions = [...latestImageCaptions]
                                          newCaptions[index] = e.target.value
                                          setLatestImageCaptions(newCaptions)
                                        }}
                                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter a caption for this image"
                                        rows={3}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display Uploaded Latest Images */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Uploaded Latest Images</h2>
                    </div>
                    <div className="p-6">
                      {!uploadedImages.latestImages || uploadedImages.latestImages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p>No latest images have been uploaded yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {uploadedImages.latestImages.map((image, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt="Latest image"
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-4">
                                <p className="text-gray-700">{image.caption}</p>
                                <div className="mt-4 flex justify-end">
                                  <button
                                    onClick={() => handleDeleteLatestImage(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-5 h-5" />
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
              )}

              {/* Leads Tab */}
              {activeTab === "leads" && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Website Visitors
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search visitors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {visitors.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No visitor data available yet.</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Additional Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {displayedVisitors.map((visitor) => (
                                <tr key={visitor.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <User className="h-5 w-5 text-gray-400 mr-2" />
                                      <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                      <div className="text-sm text-gray-500">{visitor.phone}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                      <div className="text-sm text-gray-500">{visitor.email || "—"}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500 max-w-xs break-words">
                                      {visitor.addInfo || "—"}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                      <div className="text-sm text-gray-500">{formatDate(visitor.createdAt)}</div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {visibleCount < filteredVisitors.length && (
                          <div className="mt-6 text-center">
                            <button
                              onClick={loadMore}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                              Load More
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Example button to demonstrate functionality */}
    </>
  )
}

export { MainPanel }

