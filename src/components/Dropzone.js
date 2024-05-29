import React, { useState, useCallback, useEffect } from 'react';
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons"
import Image from "next/image";
import { deleteFile, uploadFile, getUserFiles, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dropzone = ({ onFileUpload }) => {
    const MAX_FILES = 10;
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async (userId) => {
            try {
                if (userId) {
                    const files = await getUserFiles(userId);
                    setUploadedFiles(files);
                    onFileUpload(files);
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchFiles(user.uid);
            }
        });

        return () => unsubscribe();
    }, [onFileUpload]);

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

    const handleDrop = async (event) => {
        event.preventDefault();
        if (event.dataTransfer.items) {
            const files = [];
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    files.push(event.dataTransfer.items[i].getAsFile());
                }
            }

            if (uploadedFiles.length + files.length > MAX_FILES) {
                toast(`이미지는 ${MAX_FILES}개까지만 업로드할 수 있어요.`);
                return;
            }

            try {
                const newUploadedFiles = await handleFilesUpload(files);
                setUploadedFiles(prevFiles => {
                    const updatedFiles = [...prevFiles, ...newUploadedFiles];
                    onFileUpload(updatedFiles);
                    return updatedFiles;
                });
            } catch (error) {
                console.error('Error uploading files:', error);
                toast('업로드에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleFileSelect = async (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (uploadedFiles.length + files.length > MAX_FILES) {
                toast(`이미지는 ${MAX_FILES}개까지만 업로드할 수 있어요.`);
                return;
            }
            try {
                const newUploadedFiles = await handleFilesUpload(files);
                setUploadedFiles(prevFiles => {
                    const updatedFiles = [...prevFiles, ...newUploadedFiles];
                    onFileUpload(updatedFiles);
                    return updatedFiles;
                });
            } catch (error) {
                console.error('Error uploading files:', error);
                toast('업로드에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleFilesUpload = async (files) => {
        const newUploadedFiles = [];
        for (const file of files) {
            // Check if the file is already in uploadedFiles
            if (uploadedFiles.some(uploadedFile => uploadedFile.path === file.path)) {
                toast("이미 등록된 파일이에요.");
                continue;
            }

            try {
                const uploadedFile = await uploadFile(file);
                newUploadedFiles.push(uploadedFile);
            } catch (error) {
                console.error('Error uploading file:', error);
                toast('업로드에 실패했습니다. 다시 시도해 주세요.');
            }
        }
        return newUploadedFiles;
    };

    const handleDelete = async (file) => {
        try {
            await deleteFile(file.path);
            const updatedFiles = uploadedFiles.filter(f => f.path !== file.path);
            setUploadedFiles(updatedFiles);
            onFileUpload(updatedFiles);
        } catch (error) {
            console.error('Error deleting file:', error);
            toast('삭제에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full w-full border-2 border-dashed rounded-xl p-6 text-center content-center flex-col ${isDragging ? 'bg-gray-200' : 'bg-gray-50'}`}
        >
            <ToastContainer
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
            {uploadedFiles.length === 0 ? (
                <label htmlFor="fileUpload" className="cursor-pointer text-neutral-400 text-lg">
                    <Icon icon={IconNames.MEDIA} size={50} />
                    <div className="">클릭 또는 드래그 드롭으로</div>
                    <div className="">스크린샷 이미지 업로드</div>
                </label>
            ) : (
                <div className="flex items-center justify-start h-full w-full">
                    {uploadedFiles.map(file => (
                        <div key={file.path} className="flex h-56 px-4 w-fit items-center justify-center">
                            <div className='flex my-auto'>
                                <Image
                                    src={file.url}
                                    alt={file.name}
                                    width={80}
                                    height={80}
                                    // priority={index === 0} // 첫 번째 이미지를 우선 처리
                                    className="object-cover mx-auto"
                                />                                
                            <button onClick={() => handleDelete(file)}
                            className='h-4 w-4 rounded-full bg-black text-white relative right-3 -top-2 flex items-center justify-center'>
                                    <Icon icon={IconNames.CROSS} size={12}/>
                            </button>
                            </div>
                            {/* <span className="flex-1 overflow-hidden">{file.name}</span> */}
                        </div>
                    ))}
                    {uploadedFiles.length < MAX_FILES && (
                        <div className='addfile mb-12'>
                            <div className='bubble mb-6 bg-black text-white px-8 py-4 font-light rounded'>
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
