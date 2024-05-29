import React, { useState, useEffect } from "react";
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core';
import { getUserFiles, uploadFile } from "@/firebase";

// images can be uploaded to client side manually
// for temporary storing data of images I used localstorage

function UploadSection(props) {
    const [uploadedImages, setUploadedImage] = useState([]);

    // clear localstorage on tab close to prevent loading blank images
    window.onbeforeunload = function () {
        const emptyArray = []
        localStorage.setItem("uploadedImages", JSON.stringify(emptyArray));
    };

    // saving state to local storage to prevent deleting uploaded images after closing tab with "uploads"
    useEffect(() => {
        const loadImagesFromFirebase = async () => {
            const userId = localStorage.getItem('userUid'); // 로컬 스토리지에서 사용자 ID를 가져옵니다.
            const files = await getUserFiles(userId); // 사용자의 모든 파일 정보를 가져옵니다.
            const images = files.map(file => file.url); // 파일 정보에서 이미지 URL을 가져옵니다.
            setUploadedImage(images);
        };

        loadImagesFromFirebase();
    }, []);

    const UploadButton = () => {
        const handleUpload = async (e) => {
            let img = e.target.files[0];
            setUploadedImage((prevState) => [...prevState, URL.createObjectURL(img)]);

            try {
                const fileInfo = await uploadFile(img);
                console.log('File uploaded successfully:', fileInfo);
            } catch (error) {
                console.error('Failed to upload file:', error);
            }
        };
        return (
            <div className="uploadImageWrap">
                <label
                    htmlFor="contained-button-upload"
                    className="uploadImageButton"
                    onChange={(e) => handleUpload(e)}
                >
                    <input
                        type="file"
                        accept="image/*"
                        id="contained-button-upload"
                        hidden
                    />
                    <Icon icon={IconNames.UPLOAD} />
                    <span className="uploadImageText">Upload</span>
                </label>
            </div>
        );
    };

    const UploadedImages = () => {
        return uploadedImages?.map((item, i) => (
            <div className="imageContainer" key={i}>
                <img
                    src={item}
                    alt=""
                    className="itemsImage"
                    draggable="true"
                    elementcategory={item}
                    onDragStart={(e) => {
                        props.onChangeDragUrl(e.target.src);
                    }}
                    onClick={(e) => {
                        props.handleAddOnClick(e.target.src);
                    }}
                />
            </div>
        ));
    };

    // check if localstorage is empty, if empty display tooltip instead array of images
    const checkUploadedImagesNotEmpty = () => {
        if (uploadedImages.length > 0) {
            return true;
        }
        return false;
    };


    return (
        <div className="itemsSection">
            <UploadButton />
            {checkUploadedImagesNotEmpty() ? (
                <UploadedImages />
            ) : (
                <p className="uploadTooltip">Upload your images with button above.</p>
            )}
        </div>
    );
}

export default UploadSection;