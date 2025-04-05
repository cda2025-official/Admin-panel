"use client"

import { useState } from "react"
import {
  User,
  Phone,
  Mail,
  Calendar,
  Search,
  Upload,
  Trash2,
  Youtube,
  Video,
  Home,
  FileText,
  Package,
  Briefcase,
  Image,
  Film,
  BarChart3,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("visitors")
  const [visitors, setVisitors] = useState([
    {
      id: "1",
      name: "John Smith",
      phone: "555-123-4567",
      email: "john@example.com",
      createdAt: "2023-03-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "555-987-6543",
      email: "sarah@example.com",
      createdAt: "2023-03-14T14:45:00Z",
    },
    {
      id: "3",
      name: "Michael Brown",
      phone: "555-456-7890",
      email: "michael@example.com",
      createdAt: "2023-03-13T09:15:00Z",
    },
    {
      id: "4",
      name: "Emily Davis",
      phone: "555-789-0123",
      email: "emily@example.com",
      createdAt: "2023-03-12T16:20:00Z",
    },
    {
      id: "5",
      name: "David Wilson",
      phone: "555-234-5678",
      createdAt: "2023-03-11T11:10:00Z",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)

  // Mock data for different sections
//   const [heroImages, setHeroImages] = useState([
//     { id: 1, url: "/placeholder.svg?height=300&width=600", name: "Hero Banner 1" },
//     { id: 2, url: "/placeholder.svg?height=300&width=600", name: "Hero Banner 2" },
//     { id: 3, url: "/placeholder.svg?height=300&width=600", name: "Hero Banner 3" },
//   ])

//   const [brandImages, setBrandImages] = useState([
//     { id: 1, url: "/placeholder.svg?height=200&width=200", name: "Brand Logo 1" },
//     { id: 2, url: "/placeholder.svg?height=200&width=200", name: "Brand Logo 2" },
//     { id: 3, url: "/placeholder.svg?height=200&width=200", name: "Brand Logo 3" },
//     { id: 4, url: "/placeholder.svg?height=200&width=200", name: "Brand Logo 4" },
//   ])

  const [products, setProducts] = useState([
    {
      id: 1,
      heading: "Product 1",
      description: "High-quality product with premium features",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Glorio",
    },
    {
      id: 2,
      heading: "Product 2",
      description: "Affordable option with great value",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Greenlam",
    },
    {
      id: 3,
      heading: "Product 3",
      description: "Luxury edition with exclusive design",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Display-KIT",
    },
  ])

  const [brochures, setBrochures] = useState([
    // {
    //   id: 1,
    //   title: "Product Catalog 2023",
    //   description: "Complete product lineup",
    //   type: "PDF",
    //   size: "2.4 MB",
    //   thumbnailUrl: "/placeholder.svg?height=200&width=150",
    // },
    // {
    //   id: 2,
    //   title: "Price List Q2 2023",
    //   description: "Current pricing information",
    //   type: "PDF",
    //   size: "1.2 MB",
    //   thumbnailUrl: "/placeholder.svg?height=200&width=150",
    // },
    // {
    //   id: 3,
    //   title: "Installation Guide",
    //   description: "Step-by-step instructions",
    //   type: "PDF",
    //   size: "3.5 MB",
    //   thumbnailUrl: "/placeholder.svg?height=200&width=150",
    // },
  ])

  const [galleryImages, setGalleryImages] = useState([
    // { id: 1, url: "/placeholder.svg?height=250&width=350", name: "Gallery Image 1" },
    // { id: 2, url: "/placeholder.svg?height=250&width=350", name: "Gallery Image 2" },
    // { id: 3, url: "/placeholder.svg?height=250&width=350", name: "Gallery Image 3" },
    // { id: 4, url: "/placeholder.svg?height=250&width=350", name: "Gallery Image 4" },
    // { id: 5, url: "/placeholder.svg?height=250&width=350", name: "Gallery Image 5" },
    // { id: 6, url: "/placeholder.svg?height=250&width=350", name: "Gallery Image 6" },
  ])

  const [videos, setVideos] = useState([
    // {
    //   id: 1,
    //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    //   thumbnailUrl: "/placeholder.svg?height=200&width=350",
    //   addedAt: "2023-02-15T10:30:00Z",
    // },
    // {
    //   id: 2,
    //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    //   thumbnailUrl: "/placeholder.svg?height=200&width=350",
    //   addedAt: "2023-02-10T14:45:00Z",
    // },
    // {
    //   id: 3,
    //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    //   thumbnailUrl: "/placeholder.svg?height=200&width=350",
    //   addedAt: "2023-02-05T09:15:00Z",
    // },
  ])

  // Brand-specific images
  const [brandSpecificImages, setBrandSpecificImages] = useState({
    // brandA: [
    //   { id: 1, url: "/placeholder.svg?height=200&width=300", name: "Brand A Image 1" },
    //   { id: 2, url: "/placeholder.svg?height=200&width=300", name: "Brand A Image 2" },
    // ],
    // brandB: [
    //   { id: 1, url: "/placeholder.svg?height=200&width=300", name: "Brand B Image 1" },
    //   { id: 2, url: "/placeholder.svg?height=200&width=300", name: "Brand B Image 2" },
    // ],
    // brandC: [{ id: 1, url: "/placeholder.svg?height=200&width=300", name: "Brand C Image 1" }],
    // brandD: [
    //   { id: 1, url: "/placeholder.svg?height=200&width=300", name: "Brand D Image 1" },
    //   { id: 2, url: "/placeholder.svg?height=200&width=300", name: "Brand D Image 2" },
    //   { id: 3, url: "/placeholder.svg?height=200&width=300", name: "Brand D Image 3" },
    // ],
  })

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm) ||
      (visitor.email && visitor.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const displayedVisitors = filteredVisitors.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const handleDeleteImage = (collection, id) => {
    // In a real app, this would delete from Firebase
    if (collection === "hero") {
      setHeroImages(heroImages.filter((img) => img.id !== id))
    } else if (collection === "brands") {
      setBrandImages(brandImages.filter((img) => img.id !== id))
    } else if (collection === "gallery") {
      setGalleryImages(galleryImages.filter((img) => img.id !== id))
    } else if (collection.startsWith("brand")) {
      const brand = collection
      setBrandSpecificImages({
        ...brandSpecificImages,
        [brand]: brandSpecificImages[brand].filter((img) => img.id !== id),
      })
    }
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleDeleteBrochure = (id) => {
    setBrochures(brochures.filter((brochure) => brochure.id !== id))
  }

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter((video) => video.id !== id))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-center">Business Name Panel</h1>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "hero" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("hero")}
            >
              <Home className="mr-2 h-5 w-5" />
              Hero Images
            </Button>
            <Button
              variant={activeTab === "brochures" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("brochures")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Brochures
            </Button>
            <Button
              variant={activeTab === "products" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Package className="mr-2 h-5 w-5" />
              Products
            </Button>
            <Button
              variant={activeTab === "brands" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("brands")}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Brands
            </Button>

            <div className="pl-4 space-y-1 mt-2">
              <Button
                variant={activeTab === "brandA" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab("brandA")}
              >
                Brand A
              </Button>
              <Button
                variant={activeTab === "brandB" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab("brandB")}
              >
                Brand B
              </Button>
              <Button
                variant={activeTab === "brandC" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab("brandC")}
              >
                Brand C
              </Button>
              <Button
                variant={activeTab === "brandD" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab("brandD")}
              >
                Brand D
              </Button>
            </div>

            <Button
              variant={activeTab === "gallery" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("gallery")}
            >
              <Image className="mr-2 h-5 w-5" />
              Gallery
            </Button>
            <Button
              variant={activeTab === "videos" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("videos")}
            >
              <Film className="mr-2 h-5 w-5" />
              Videos (gallery)
            </Button>
            <Button
              variant={activeTab === "visitors" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "visitors" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
              onClick={() => setActiveTab("visitors")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Leads Dashboard
            </Button>
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Hero Images Section */}
          {activeTab === "hero" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Home className="w-5 h-5 mr-2 text-blue-600" />
                      Hero Images
                    </CardTitle>
                    <CardDescription>Manage hero banner images for your website</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {heroImages.map((image) => (
                    <div key={image.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage("hero", image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{image.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brochures Section */}
          {activeTab === "brochures" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Brochures
                    </CardTitle>
                    <CardDescription>Manage downloadable brochures and files</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brochures.map((brochure) => (
                    <div key={brochure.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={brochure.thumbnailUrl || "/placeholder.svg"}
                          alt={brochure.title}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteBrochure(brochure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{brochure.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{brochure.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {brochure.type} • {brochure.size}
                          </span>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Section */}
          {activeTab === "products" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Products
                    </CardTitle>
                    <CardDescription>Manage product listings and details</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.heading}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{product.heading}</h3>
                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brands Section */}
          {activeTab === "brands" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                      Brands
                    </CardTitle>
                    <CardDescription>Manage brand logos and information</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {brandImages.map((image) => (
                    <div key={image.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-32 object-contain p-4"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage("brands", image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2 text-center border-t">
                        <h3 className="text-sm font-medium">{image.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brand Specific Sections */}
          {(activeTab === "brandA" || activeTab === "brandB" || activeTab === "brandC" || activeTab === "brandD") && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                      {activeTab.replace("brand", "Brand ")} Images
                    </CardTitle>
                    <CardDescription>Manage images for {activeTab.replace("brand", "Brand ")}</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brandSpecificImages[activeTab].map((image) => (
                    <div key={image.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage(activeTab, image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{image.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gallery Section */}
          {activeTab === "gallery" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Image className="w-5 h-5 mr-2 text-blue-600" />
                      Gallery
                    </CardTitle>
                    <CardDescription>Manage gallery images for your website</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage("gallery", image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2">
                        <h3 className="text-sm font-medium">{image.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos Section */}
          {activeTab === "videos" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Youtube className="w-5 h-5 mr-2 text-red-600" />
                      Videos
                    </CardTitle>
                    <CardDescription>Manage YouTube videos for your gallery</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input placeholder="Enter YouTube URL..." className="flex-1" />
                    <Button>Add Video</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="border rounded-md overflow-hidden bg-white">
                      <div className="relative">
                        <img
                          src={video.thumbnailUrl || "/placeholder.svg"}
                          alt="Video thumbnail"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600/80 flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1"
                          >
                            {video.url}
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Added: {formatDate(video.addedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visitors/Leads Section */}
          {activeTab === "visitors" && (
            <Card className="w-full">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Enquiries
                    </CardTitle>
                    <CardDescription>View and manage website visitor data</CardDescription>
                  </div>
                  <Button>Export</Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search visitors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-4">TABLE Of Leads</h3>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Loading visitors data...</p>
                    </div>
                  ) : visitors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p>No visitor data available yet.</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                              >
                                Phone
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                              >
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {displayedVisitors.map((visitor) => (
                              <tr key={visitor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap border-r">
                                  <div className="flex items-center">
                                    <User className="h-5 w-5 text-gray-400 mr-2" />
                                    <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r">
                                  <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                    <div className="text-sm text-gray-500">{visitor.phone}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r">
                                  <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                    <div className="text-sm text-gray-500">{visitor.email || "—"}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r">
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
                          <Button
                            onClick={loadMore}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          >
                            Load More
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

