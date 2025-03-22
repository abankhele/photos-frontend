// src/pages/Dashboard.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ImagePlus, X, Check, Loader2, Plus } from "lucide-react";
import { photoService } from "@/services/photoService";
import { Photo } from "@/types/photo";

export default function Dashboard() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [tags, setTags] = useState("");
    const [albumId, setAlbumId] = useState("0");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

    // Load images when userPhotos changes
    useEffect(() => {
        const loadImages = async () => {
            const urls: Record<string, string> = {};
            for (const photo of userPhotos) {
                try {
                    const response = await fetch(photoService.getPhotoUrl(photo.id));
                    if (response.ok) {
                        const blob = await response.blob();
                        urls[photo.id] = URL.createObjectURL(blob);
                    } else {
                        console.error(`Failed to load image: ${photo.id}, status: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`Failed to load image for photo ${photo.id}:`, error);
                }
            }
            setPhotoUrls(urls);
        };

        if (userPhotos.length > 0) {
            loadImages();
        }

        // Cleanup function to revoke object URLs when component unmounts
        return () => {
            Object.values(photoUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [userPhotos]);

    // Fetch user photos when component mounts
    useEffect(() => {
        const fetchUserPhotos = async () => {
            setIsLoading(true);
            try {
                const photos = await photoService.getUserPhotos();
                console.log("Fetched photos:", photos);
                setUserPhotos(photos);
            } catch (error) {
                console.error("Error fetching photos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPhotos();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Get user ID from localStorage
            const userInfo = localStorage.getItem('user');
            const user = userInfo ? JSON.parse(userInfo) : null;
            const userId = user?.id || "";

            // For each file, create a form and upload
            for (let i = 0; i < selectedFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', selectedFiles[i]);
                formData.append('userId', userId);
                formData.append('albumId', albumId);
                formData.append('tags', tags);

                const data = await photoService.uploadPhoto(formData);

                setUploadedFiles(prev => [...prev, {
                    name: selectedFiles[i].name,
                    status: 'success',
                    data
                }]);

                // Update progress
                setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }

            // Refresh the photo gallery
            const photos = await photoService.getUserPhotos();
            setUserPhotos(photos);
            setShowUploadForm(false);

        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
            setSelectedFiles([]);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Header with title and upload button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Photos</h1>
                    <Button
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="flex items-center gap-2"
                    >
                        {showUploadForm ? (
                            <>Hide Upload Form</>
                        ) : (
                            <><Plus size={18} /> Upload Photos</>
                        )}
                    </Button>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                    >
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Upload Photos</h2>

                                {/* File Upload Area */}
                                <div
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg mb-2">Drag and drop your images here</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or click to browse</p>
                                    <Button variant="outline" onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}>
                                        <ImagePlus className="mr-2 h-4 w-4" />
                                        Select Files
                                    </Button>
                                </div>

                                {/* Selected Files */}
                                {selectedFiles.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-2">Selected Files ({selectedFiles.length})</h3>
                                        <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
                                            {selectedFiles.map((file, index) => (
                                                <div
                                                    key={`${file.name}-${index}`}
                                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mr-3">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="truncate max-w-xs">{file.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile(index)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags Input */}
                                <div className="mb-6">
                                    <Label htmlFor="tags" className="block mb-2">
                                        Tags (comma separated)
                                    </Label>
                                    <Input
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="vacation, family, beach, etc."
                                        className="w-full"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Add tags to help organize and find your photos later
                                    </p>
                                </div>

                                {/* Album Selection */}
                                <div className="mb-6">
                                    <Label htmlFor="album" className="block mb-2">
                                        Album (optional)
                                    </Label>
                                    <Input
                                        id="album"
                                        value={albumId}
                                        onChange={(e) => setAlbumId(e.target.value)}
                                        placeholder="Select or create an album"
                                        className="w-full"
                                    />
                                </div>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Uploading...</span>
                                            <span className="text-sm">{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <Button
                                    onClick={handleUpload}
                                    disabled={selectedFiles.length === 0 || isUploading}
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Photo Gallery */}
                <div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : userPhotos.length > 0 ? (
                        <div className="photo-gallery">
                            <div className="masonry-grid">
                                {/* Create columns first */}
                                {[0, 1, 2].map(columnIndex => (
                                    <div key={columnIndex} className="masonry-column">
                                        {/* Filter photos for this column (every 3rd item) */}
                                        {userPhotos
                                            .filter((_, index) => index % 3 === columnIndex)
                                            .map((photo) => (
                                                <div key={photo.id} className="masonry-item">
                                                    <img
                                                        src={photoUrls[photo.id] || ''}
                                                        alt="User photo"
                                                        className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
                                                        onError={(e) => {
                                                            console.error(`Failed to load image: ${photo.id}`);
                                                            e.currentTarget.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(photo.uploadedOn).toLocaleDateString()}
                                                        </p>
                                                        {photo.tags && photo.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {photo.tags.map((tag, i) => (
                                                                    <span key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : (
                        <div className="text-center py-20">
                            <div className="text-gray-400 mb-4">
                                <ImagePlus size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No photos yet</h3>
                            <p className="text-gray-500 mb-6">Upload your first photo to get started</p>
                            <Button onClick={() => setShowUploadForm(true)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photos
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
