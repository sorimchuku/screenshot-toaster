import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import SideBar from "./Sidebar";
import ImageComponent from "./ImageComponent";
import { getUserFiles } from "@/firebase";
import { parseCookies } from "nookies";
import Template from "./Template";

export default function Editor() {

    const [images, setImages] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [numStages, setNumStages] = useState(0);
    const [activeStage, setActiveStage] = useState(0);
    const [stageSize, setStageSize] = useState({ width: 280, height: 600 });

    useEffect(() => {
        const cookies = parseCookies();
        const loadImagesFromFirebase = async () => {
            const userId = cookies.userUid;
            const files = await getUserFiles(userId);
            const images = files.map(file => file.url);
            setUploadedImages(images);
            setNumStages(images.length);
        };
        loadImagesFromFirebase();
    }, []);

    useEffect(() => {
        setNumStages(uploadedImages.length);
    }, [uploadedImages]);

    const handleAddPage = () => {
        setNumStages(prevNumStages => prevNumStages + 1); // Increase the number of stages by 1
    };

    const handleStageClick = (index) => {
        setActiveStage(index); // Set the clicked stage as the active stage
    };

    const zoomIn = () => {
        setStageDimensions(prevState => ({
            ...prevState,
            scale: prevState.scale * 1.1,
        }));
    };

    const zoomOut = () => {
        setStageDimensions(prevState => ({
            ...prevState,
            scale: prevState.scale / 1.1,
        }));
    };

    return (
        <div className="body-container w-full h-full flex relative">
            <SideBar
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                handleAddPage={handleAddPage}
            />
            <div className="workspace-wrap overflow-y-hidden overflow-x-auto flex flex-grow items-center justify-center gap-4">
                {Array.from({length: numStages }).map((_, index) => (
                    <div onClick={() => handleStageClick(index)} key={index}
                    className={`stage-wrap bg-slate-200 shadow ${index === activeStage ? 'outline outline-2 outline-blue-300' : ''}`}>
                        <Template templateName="template1" stageSize={stageSize} stageIndex={index} image={uploadedImages[index]} />
                    </div>
                    
                ))}
            </div>
        </div>
    );
}