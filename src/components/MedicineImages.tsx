import React, { useState, useEffect } from 'react';
import { Images } from 'lucide-react';

interface MedicineImagesProps {
    medicineName: string;
}

const MedicineImages: React.FC<MedicineImagesProps> = ({ medicineName }) => {
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8009/getimages?medicine=${encodeURIComponent(medicineName)}`
                );
                
                const data = await response.json();
                setImages(data.images);
                // console.log(data.images);
            } catch (err) {
                setError('Failed to fetch images. Please try again later.');
            }
        };

        if (medicineName) {
            fetchImages();
        }
    }, [medicineName]);

    if (!medicineName) return null;

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-3">
                <Images className="h-5 w-5 flex-shrink-0" style={{ color: '#107E7D' }} />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Images</h3>
            </div>
            {error ? (
                <p className="text-red-600 text-sm sm:text-base">{error}</p>
            ) : images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((src, index) => (
                        <div key={index} className="overflow-hidden rounded-lg">
                            <img
                                src={src}
                                alt={`Image ${index + 1}`}
                                className="w-full h-48 object-contain shadow-md"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm sm:text-base">
                    No images found for {medicineName}.
                </p>
            )}
        </div>
    );
};

export default MedicineImages;
