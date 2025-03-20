// src/types/photo.ts
export interface Photo {
    id: string;
    userId: string;
    albumId?: string;
    gcsUrl: string;
    uploadedOn: string;
    tags?: string[];
    size: number;
    format: string;
}
