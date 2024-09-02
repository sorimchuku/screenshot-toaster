import React, { useState, useEffect } from "react";
import { IconNames } from '@blueprintjs/icons';
import { Icon, Spinner } from '@blueprintjs/core';
import { uploadFile } from "@/firebase";
import { deleteFile } from "@/firebase";
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadSection(props) {
    const [deleteMode, setDeleteMode] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    const handleDeleteClick = (i) => {
        if (deleteMode[i]) {
            // 이미 삭제 모드이면 이미지를 삭제
            handleDelete(i);
        } else {
            // 아니면 삭제 모드로 전환하고, 다른 이미지의 삭제 모드를 해제
            setDeleteMode({ [i]: true });
        }
    };

    const handleDelete = async (index) => {
        const updatedFiles = [...props.uploadedImages];
        const fileToDelete = updatedFiles[index];

        // Firebase에서 파일 삭제
        try {
            await deleteFile(fileToDelete);
        } catch (error) {
            console.error('Failed to delete file:', error);
        }

        // 로컬 상태에서 파일 제거
        updatedFiles.splice(index, 1);
        props.setUploadedImages(updatedFiles);
    };

    const handleImageClick = (i) => {
        setDeleteMode((prevState) => ({
            ...prevState,
            [i]: false,
        }));
    };

    const UploadButton = () => {
        const handleUpload = async (e) => {
            let img = e.target.files[0];
            const uploadedImages = Array.isArray(props.uploadedImages) ? props.uploadedImages : [];
        // 파일 이름 중복 확인
        if (uploadedImages.some(image => image.name === img.name)) {
            toast("이미 등록된 파일이에요.");
            return;
        }

            setIsUploading(true);
            try {
                const fileInfo = await uploadFile(img);
                console.log('File uploaded successfully:', fileInfo);
                props.setUploadedImages((prevState) => [...prevState, fileInfo]);
            } catch (error) {
                console.error('Failed to upload file:', error);
            } finally {
                setIsUploading(false);
            }
        };
        return (
            <div className="uploadImageWrap bg-neutral-200 rounded-md w-full h-[68px]">
                <label
                    htmlFor="contained-button-upload"
                    className="uploadImageButton h-full w-full flex justify-center items-center cursor-pointer"
                    onChange={(e) => handleUpload(e)}
                >
                    <input
                        type="file"
                        accept="image/*"
                        id="contained-button-upload"
                        hidden
                    />
                    {isUploading ? <Spinner size={30} /> : <Icon icon={IconNames.PLUS} />}
                    {/* <span className="uploadImageText">업로드</span> */}
                </label>
            </div>
        );
    };

    const UploadedImages = () => {
        const uploadedImages = Array.isArray(props.uploadedImages) ? props.uploadedImages : [props.uploadedImages];
        return uploadedImages?.map((item, i) => (
            <div className="imageContainer group relative w-full h-[68px]" key={i}>
                <button onClick={(e) =>{ e.stopPropagation(); handleDeleteClick(i);}} className="absolute top-0 right-0 p-1 z-50 collapse group-hover:visible transition-all">
                    {deleteMode[i] 
                        ? <div className="px-2 rounded-full bg-red-500 text-white">삭제</div> 
                        : <Icon icon={IconNames.CROSS} className="bg-black rounded-full text-white" />}
                </button>
                <img
                    item={item}
                    src={item.url}
                    alt=""
                    className="itemsImage w-full h-full object-cover rounded-md  transition-all group-hover:brightness-50"
                    draggable="true"
                    elementcategory={item}
                    onClick={(e) => { deleteMode[i] ? handleImageClick(i) :
                        props.handleImageClick(item);
                    }}
                />
                
            </div>
        ));
    };

    return (
        <><ToastContainer
        hideProgressBar={true}
        transition={Slide} />
        <div className="itemsSection grid grid-cols-3 gap-1">
                <UploadedImages />
            <UploadButton />
        </div></>
    );
}
