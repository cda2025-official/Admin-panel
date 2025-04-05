import React, { useState } from "react";

const UploadPDF = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Glorio"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dze3eqftf/raw/upload", // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setPdfUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto text-center">
      <h2 className="text-lg font-semibold mb-4">Upload PDF to Cloudinary</h2>
      <input type="file" accept="application/pdf" onChange={handleUpload} className="mb-4" />
      {loading && <p className="text-blue-500">Uploading...</p>}
      {pdfUrl && (
        <div>
          <p className="text-green-500">Upload successful!</p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
