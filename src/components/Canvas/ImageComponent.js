import React, { useRef, useState, useEffect } from 'react';
import { Image } from "react-konva";
import useImage from 'use-image';

const ImageComponent = ({ image, shapeProps, onDimensionsChange }) => {
    const [img, status] = useImage(image);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const shapeRef = useRef();

    useEffect(() => {
        if (status === 'loaded') {
            const newDimensions = { width: img.width, height: img.height };
            setDimensions(newDimensions);
            onDimensionsChange(newDimensions);
        }
    }, [status, onDimensionsChange]);

    return (
        <Image
            image={img}
            ref={shapeRef}
            {...shapeProps}
            // {...dimensions}
        />
    );
};

export default ImageComponent;