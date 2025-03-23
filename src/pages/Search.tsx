// src/pages/Search.tsx
import { useState } from 'react';
import { photoService } from '@/services/photoService';
import { Photo } from '@/types/photo';
import { Loader2 } from 'lucide-react';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsLoading(true);
        try {
            const results = await photoService.searchPhotos(searchQuery);
            setSearchResults(results);
            
            // Load images
            const urls: Record<string, string> = {};
            for (const photo of results) {
                try {
                    const response = await fetch(photoService.getPhotoUrl(photo.id));
                    if (response.ok) {
                        const blob = await response.blob();
                        urls[photo.id] = URL.createObjectURL(blob);
                    }
                } catch (error) {
                    console.error(`Failed to load image for photo ${photo.id}:`, error);
                }
            }
            setPhotoUrls(urls);
        } catch (error) {
            console.error('Error searching photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Search Photos</h1>
                
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search photos by tags (e.g., sunset, beach, family)..."
                            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>
                </form>
                
                {/* Display search results */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="photo-gallery">
                        <div className="masonry-grid">
                            {[0, 1, 2].map(columnIndex => (
                                <div key={columnIndex} className="masonry-column">
                                    {searchResults
                                        .filter((_, index) => index % 3 === columnIndex)
                                        .map((photo) => (
                                            <div key={photo.id} className="masonry-item">
                                                {photoUrls[photo.id] ? (
                                                    <img
                                                        src={photoUrls[photo.id]}
                                                        alt={photo.tags?.join(', ') || 'Photo'}
                                                        className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
                                                        onError={(e) => {
                                                            console.error(`Failed to load image: ${photo.id}`);
                                                            e.currentTarget.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                                    </div>
                                                )}
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
                ) : searchQuery && (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-500">No photos found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
