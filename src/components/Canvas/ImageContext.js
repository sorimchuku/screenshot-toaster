import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const setImageAtStage = (index, imageSrc) => {
        const newImages = [...images];
        newImages[index] = imageSrc;
        setImages(newImages);
    };

    return (
        <ImageContext.Provider value={{ images, setImageAtStage }}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImages = () => useContext(ImageContext);