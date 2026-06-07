import { useState } from "react";
import axios from "axios";
import { useAuthApi } from "../Api/AuthApi";

const FileUploader = ({ onUploadComplete, onError, accept = "image/*" }) => {
    const [uploading, setUploading] = useState(false);
    const { token } = useAuthApi();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (onUploadComplete) {
                onUploadComplete(response.data);
            }
        } catch (error) {
            console.error("Error al subir archivo:", error);
            if (onError) {
                onError(error.response?.data?.message || "Error al subir archivo");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
            <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                id="file-uploader"
            />
            <label
                htmlFor="file-uploader"
                className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {uploading ? "Subiendo..." : "Subir imagen"}
            </label>
            {uploading && (
                <div className="mt-2 text-xs text-gray-500">Subiendo archivo...</div>
            )}
        </div>
    );
};

export default FileUploader;