import React, { useState, useEffect } from "react";
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core';
import { uploadFile } from "@/firebase";

// images can be uploaded to client side manually
// for temporary storing data of images I used localstorage

export default function UploadSection(props) {


    const UploadButton = () => {
        const handleUpload = async (e) => {
            let img = e.target.files[0];
            props.setUploadedImages((prevState) => [...prevState, URL.createObjectURL(img)]);

            try {
                const fileInfo = await uploadFile(img);
                console.log('File uploaded successfully:', fileInfo);
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
            <div className="imageContainer" key={i}>
                <img
                    src={item}
                    alt=""
                    className="itemsImage w-[72px] h-[72px] object-cover rounded-md transition-all hover:brightness-50"
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
    // const checkUploadedImagesNotEmpty = () => {
    //     if (uploadedImages.length > 0) {
    //         return true;
    //     }
    //     return false;
    // };


    return (
        <div className="itemsSection flex flex-wrap gap-1">
                <UploadedImages />
            <UploadButton />
        </div>
    );
}
