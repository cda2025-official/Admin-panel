import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import  * as workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export default function PdfToImage() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);

  const convertPdfToImage = async () => {
    if (!pdfUrl) return alert("Enter a valid PDF URL");
    
    try {
      let directUrl = pdfUrl;
      if (pdfUrl.includes('drive.google.com')) {
        const fileId = pdfUrl.match(/file\/d\/([^\/]+)/)?.[1] || 
                      pdfUrl.match(/id=([^&]+)/)?.[1];
        if (fileId) {
          directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }

      const pdf = await pdfjsLib.getDocument({
        url: directUrl,
        withCredentials: false
      }).promise;
      
      const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
      const scale = 2;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport
      }).promise;
      
      setImageSrc(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to process PDF: ${error.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">PDF to Image Converter</h2>
      <input
        type="text"
        placeholder="Enter PDF URL"
        className="border p-2 w-full"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
      />
      <input
        type="number"
        min="1"
        className="border p-2"
        placeholder="Page number"
        value={pageNumber}
        onChange={(e) => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={convertPdfToImage}
        disabled={!pdfUrl}
      >
        Convert to Image
      </button>
      {imageSrc && (
        <div className="mt-4">
          <img 
            src={imageSrc} 
            alt="PDF page preview" 
            className="max-w-full border"
          />
        </div>
      )}
    </div>
  );
}