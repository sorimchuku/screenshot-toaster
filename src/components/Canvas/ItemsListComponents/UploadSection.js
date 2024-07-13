import React, { useState, useEffect } from "react";
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core';
import { uploadFile } from "@/firebase";
import { deleteFile } from "@/firebase";

export default function UploadSection(props) {
    const [deleteMode, setDeleteMode] = useState({});

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

    const UploadButton = () => {
        const handleUpload = async (e) => {
            let img = e.target.files[0];
            try {
                const fileInfo = await uploadFile(img);
                console.log('File uploaded successfully:', fileInfo);
                props.setUploadedImages((prevState) => [...prevState, fileInfo.url]);
            } catch (error) {
                console.error('Failed to upload file:', error);
            }
        };
        return (
            <div className="uploadImageWrap bg-neutral-200 rounded-md w-[72px] h-[72px]">
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
                    <Icon icon={IconNames.PLUS} />
                    {/* <span className="uploadImageText">업로드</span> */}
                </label>
            </div>
        );
    };

    const UploadedImages = () => {
        return props.uploadedImages?.map((item, i) => (
            <div className="imageContainer group relative w-[72px] h-[72px]" key={i}>
                <button onClick={() => handleDeleteClick(i)} className="absolute top-0 right-0 p-1 z-50 collapse group-hover:visible transition-all">
                    {deleteMode[i] 
                        ? <div className="px-2 rounded-full bg-red-500 text-white">삭제</div> 
                        : <Icon icon={IconNames.CROSS} className="bg-black rounded-full text-white" />}
                </button>
                <img
                    src={item}
                    alt=""
                    className="itemsImage w-full h-full object-cover rounded-md  transition-all group-hover:brightness-50"
                    draggable="true"
                    elementcategory={item}
                    onClick={(e) => {
                        props.handleImageClick(e.target.src);
                    }}
                />
                
            </div>
        ));
    };

    return (
        <div className="itemsSection flex flex-wrap gap-1">
                <UploadedImages />
            <UploadButton />
        </div>
    );
}
