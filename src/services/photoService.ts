// src/services/photoService.ts
import { Photo } from '@/types/photo';
import { fetchWithAuth } from '@/services/fetchWithAuth';

const API_URL = 'http://localhost:8090/api';

export const photoService = {
    async getUserPhotos(): Promise<Photo[]> {
        const userInfo = localStorage.getItem('user');
        const user = userInfo ? JSON.parse(userInfo) : null;
        const userId = user?.id;

        if (!userId) {
            throw new Error('User not authenticated');
        }

        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/photos/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch photos');
        }

        return await response.json();
    },

    async uploadPhoto(formData: FormData): Promise<Photo> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/photos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload photo');
        }

        return await response.json();
    },

    async batchUploadPhotos(formData: FormData): Promise<Photo[]> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/photos/batch`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to batch upload photos');
        }

        return await response.json();
    },

    getPhotoUrl(photoId: string): string {
        const token = localStorage.getItem('token');
        return `http://localhost:8090/api/photos/image/${photoId}?token=${token}`;
    }
};
