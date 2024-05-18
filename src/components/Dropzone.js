import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons"

const Dropzone = ({ onFileUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const storedFiles = localStorage.getItem('uploadedFiles');
        if (storedFiles) {
            setUploadedFiles(JSON.parse(storedFiles));
        }
    }, []);

    const updateUploadedFiles = (files) => {
        setUploadedFiles(files);
        localStorage.setItem('uploadedFiles', JSON.stringify(files));
        onFileUpload(files);
    };

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                const updatedFiles = [...uploadedFiles, ...imageFiles];
                updateUploadedFiles(updatedFiles);
            } else {
                alert('이미지 파일을 업로드해주세요.');
            }
        }
    }, [uploadedFiles, updateUploadedFiles]);

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                const updatedFiles = [...uploadedFiles, ...imageFiles];
                updateUploadedFiles(updatedFiles);
            } else {
                alert('이미지 파일을 업로드해주세요.');
            }
        }
    };

    const handleDeleteImage = (index) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles.splice(index, 1);
        setUploadedFiles(updatedFiles);
        localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
        onFileUpload(updatedFiles);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full w-full border-2 border-dashed rounded-xl p-6 text-center content-center flex-col ${isDragging ? 'bg-gray-200' : 'bg-gray-50'}`}
        >
            <input
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="fileUpload"
                accept="image/*" 
                multiple
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
                <span className="text-neutral-400">  <Icon icon={IconNames.CLOUD_UPLOAD} /> 이미지 업로드...</span>
            </label>
            {uploadedFiles.length > 0 && (
                <div>
                    <ul className='flex'>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>
                                <img src={URL.createObjectURL(file)} alt={`Uploaded Image ${index}`} width="150" />
                                {file.name}
                                <button onClick={() => handleDeleteImage(index)}>삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropzone;
