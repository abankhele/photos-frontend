"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImagePlus, X, Check, Loader2 } from "lucide-react";
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch user photos when component mounts
    useEffect(() => {
        const fetchUserPhotos = async () => {
            setIsLoading(true);
            try {
                const photos = await photoService.getUserPhotos();
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
            
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
            setSelectedFiles([]);
        }
    };

    const handleBatchUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Get user ID from localStorage
            const userInfo = localStorage.getItem('user');
            const user = userInfo ? JSON.parse(userInfo) : null;
            const userId = user?.id || "";

            const formData = new FormData();

            // Append all files
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            formData.append('userId', userId);
            formData.append('albumId', albumId);
            formData.append('tags', tags);

            const data = await photoService.batchUploadPhotos(formData);
            
            setUploadedFiles(data.map((item, index) => ({
                name: selectedFiles[index]?.name || `File ${index + 1}`,
                status: 'success',
                data: item
            })));

            setUploadProgress(100);
            
            // Refresh the photo gallery
            const photos = await photoService.getUserPhotos();
            setUserPhotos(photos);
            
        } catch (error) {
            console.error('Batch upload error:', error);
        } finally {
            setIsUploading(false);
            setSelectedFiles([]);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl mx-auto"
            >
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="upload">Upload Photos</TabsTrigger>
                        <TabsTrigger value="gallery">My Gallery</TabsTrigger>
                        <TabsTrigger value="albums">Albums</TabsTrigger>
                    </TabsList>

                    {/* Upload Tab Content */}
                    <TabsContent value="upload" className="space-y-6">
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
                                            <AnimatePresence>
                                                {selectedFiles.map((file, index) => (
                                                    <motion.div
                                                        key={`${file.name}-${index}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
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
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
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

                                {/* Upload Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={handleUpload}
                                        disabled={selectedFiles.length === 0 || isUploading}
                                        className="flex-1"
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
                                    
                                    <Button
                                        onClick={handleBatchUpload}
                                        disabled={selectedFiles.length === 0 || isUploading}
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing Batch...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Batch Upload
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Recently Uploaded */}
                                {uploadedFiles.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-medium mb-2">Recently Uploaded</h3>
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded"
                                                >
                                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                                    <span className="text-green-700 dark:text-green-300">
                                                        {file.name} uploaded successfully
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Gallery Tab Content */}
                    <TabsContent value="gallery">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">My Gallery</h2>
                                
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                    </div>
                                ) : userPhotos.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {userPhotos.map((photo) => (
                                            <motion.div
                                                key={photo.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="relative group"
                                            >
                                                <img
                                                    src={photo.gcsUrl}
                                                    alt="User photo"
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-end justify-start">
                                                    <div className="p-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white text-xs truncate">
                                                            {new Date(photo.uploadedOn).toLocaleDateString()}
                                                        </p>
                                                        {photo.tags && photo.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {photo.tags.map((tag, i) => (
                                                                    <span key={i} className="bg-blue-500 bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-10">You haven't uploaded any photos yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Albums Tab Content */}
                    <TabsContent value="albums">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">My Albums</h2>
                                <p className="text-gray-500">Your photo albums will appear here.</p>
                                {/* Albums content would go here */}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
