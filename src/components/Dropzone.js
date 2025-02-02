import React, { useState, useCallback, useEffect } from 'react';
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons"
import Image from "next/image";
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dropzone = ({ selectedFiles, setSelectedFiles }) => {
    const MAX_FILES = 10;
    const [isDragging, setIsDragging] = useState(false);
    
    useEffect(() => {
        console.log('selectedFiles has been updated:', selectedFiles);
    }, [selectedFiles]);

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

    const handleDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.items) {
            const files = [];
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    const file = event.dataTransfer.items[i].getAsFile();
                    if (!selectedFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
                        files.push(file);
                    }
                }
            }

            if (selectedFiles.length + files.length > MAX_FILES) {
                toast(`이미지는 ${MAX_FILES}개까지만 업로드할 수 있어요.`);
                return;
            }

            // 파일들을 로컬 상태에 저장합니다.
            setSelectedFiles(prevFiles => [...prevFiles, ...files]);
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files && files.length > 0) {
            const nonDuplicateFiles = files.filter(file => 
                !selectedFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)
            );


            if (selectedFiles.length + files.length > MAX_FILES) {
                toast(`이미지는 ${MAX_FILES}개까지만 업로드할 수 있어요.`);
                return;
            }

            // 파일들을 로컬 상태에 저장합니다.
            setSelectedFiles(prevFiles => [...prevFiles, ...nonDuplicateFiles]);
        }
    };

    const handleDelete = (index) => {
        const updatedFiles = [...selectedFiles];
        // 복사본에서 index에 해당하는 파일을 제거합니다.
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full w-full border-2 border-dashed rounded-xl p-6 text-center content-center flex-col ${isDragging ? 'bg-gray-200' : 'bg-gray-50'}`}
        >
            <ToastContainer
            position='top-center'
                hideProgressBar={true}
                transition={Slide} />
            <input
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="fileUpload"
                accept="image/*" 
                multiple
            />
            {selectedFiles.length === 0 ? (
                <label htmlFor="fileUpload" className="cursor-pointer text-neutral-400 text-lg h-full w-full flex items-center justify-center flex-col">
                    <Icon icon={IconNames.MOBILE_PHONE} size={50} className='mb-2' />
                    <div className="">클릭 또는 드래그 드롭으로</div>
                    <div className="">스크린샷 이미지 업로드</div>
                </label>
            ) : (
                <div className="flex items-center justify-start h-full w-full gap-6">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex h-56 w-fit items-center justify-center">
                                <div className='flex my-auto'>
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        width={80}
                                        height={80}
                                        className="object-cover mx-auto max-h-48 w-auto"
                                    />
                                    <button onClick={() => handleDelete(index)}
                                        className='p-1 h-fit w-fit rounded-full bg-black text-white relative right-3 -top-2 flex items-center text-center'>
                                        <Icon icon={IconNames.CROSS} size={12} className='h-3 w-3' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    {selectedFiles.length < MAX_FILES && (
                        <div className='addfile mb-12'>
                            <div className='bubble mb-6 bg-black text-white px-8 py-4 font-light rounded break-keep'>
                                최대 10장까지!
                            </div>
                            <label htmlFor="fileUpload" className="cursor-pointer flex items-center m-10 my-auto mx-auto w-12 h-12 bg-neutral-200 rounded-full">
                                <Icon icon={IconNames.PLUS} large className='m-auto' />
                            </label>
                        </div>
                    )}
                </div>
            )}
           
        </div>
    );
};

export default Dropzone;
