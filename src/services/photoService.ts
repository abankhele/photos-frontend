// src/services/photoService.ts
import { Photo } from '@/types/photo';

const API_URL = "http://localhost:8090/api/photos";

export const photoService = {
    getUserPhotos: async (): Promise<Photo[]> => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user?.id;

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch photos");
        }

        return response.json();
    },

    uploadPhoto: async (formData: FormData): Promise<Photo> => {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to upload photo");
        }

        return response.json();
    },

    batchUploadPhotos: async (formData: FormData): Promise<Photo[]> => {
        const response = await fetch(`${API_URL}/batch`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to batch upload photos");
        }

        return response.json();
    }
};
