"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImagePlus, X, Check, Loader2 } from "lucide-react";

export default function Dashboard() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [tags, setTags] = useState("");
    const [albumId, setAlbumId] = useState("0");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
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

                const response = await fetch('http://localhost:8080/api/photo/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    setUploadedFiles(prev => [...prev, {
                        name: selectedFiles[i].name,
                        status: 'success',
                        data
                    }]);
                } else {
                    setUploadedFiles(prev => [...prev, {
                        name: selectedFiles[i].name,
                        status: 'error'
                    }]);
                }

                // Update progress
                setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }
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

            const response = await fetch('http://localhost:8080/api/photo/batch-upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(data.map((item, index) => ({
                    name: selectedFiles[index]?.name || `File ${index + 1}`,
                    status: 'success',
                    data: item
                })));
            }

            setUploadProgress(100);
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

                    <TabsContent value="upload" className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Upload Photos</h2>

                                {/* File Drop Zone */}
                                <motion.div
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center mb-6"
                                    whileHover={{ scale: 1.01, borderColor: '#3b82f6' }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                    />

                                    <motion.div
                                        initial={{ scale: 1 }}
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                    </motion.div>

                                    <p className="text-lg mb-1">Drag & drop photos here</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
                                </motion.div>

                                {/* Selected Files */}
                                {selectedFiles.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-medium mb-2">Selected Files ({selectedFiles.length})</h3>
                                        <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                                            <AnimatePresence>
                                                {selectedFiles.map((file, index) => (
                                                    <motion.div
                                                        key={`${file.name}-${index}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
                                                    >
                                                        <div className="flex items-center">
                                                            <ImagePlus className="h-5 w-5 mr-2 text-blue-500" />
                                                            <span className="truncate max-w-xs">{file.name}</span>
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                ({(file.size / 1024).toFixed(1)} KB)
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 h-auto"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <Label htmlFor="album" className="block mb-1">Album</Label>
                                        <Input
                                            id="album"
                                            value={albumId}
                                            onChange={(e) => setAlbumId(e.target.value)}
                                            placeholder="Album ID"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tags" className="block mb-1">Tags (comma separated)</Label>
                                        <Input
                                            id="tags"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder='e.g. "sunset", "beach", "vacation"'
                                        />
                                    </div>
                                </div>

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
                                                Uploading ({uploadProgress}%)
                                            </>
                                        ) : (
                                            <>Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}</>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={handleBatchUpload}
                                        disabled={selectedFiles.length === 0 || isUploading}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Batch Upload
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recently Uploaded */}
                        {uploadedFiles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold mb-4">Recently Uploaded</h3>
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                                                >
                                                    <div className="flex items-center">
                                                        {file.status === 'success' ? (
                                                            <Check className="h-5 w-5 mr-2 text-green-500" />
                                                        ) : (
                                                            <X className="h-5 w-5 mr-2 text-red-500" />
                                                        )}
                                                        <span>{file.name}</span>
                                                    </div>
                                                    <span className={file.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                                                        {file.status === 'success' ? 'Uploaded' : 'Failed'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="gallery">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">My Gallery</h2>
                                <p className="text-gray-500">Your uploaded photos will appear here.</p>
                                {/* Gallery content would go here */}
                            </CardContent>
                        </Card>
                    </TabsContent>

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
