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

    const [tags, setTags] = useState("");
    const [albumId, setAlbumId] = useState("0");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

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
                        {/* Upload content remains the same */}
                        {/* ... */}
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
