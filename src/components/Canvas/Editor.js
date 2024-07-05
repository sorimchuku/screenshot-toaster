import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideBar from "./Sidebar";
import ImageComponent from "./ImageComponent";
import { getUserFiles, database } from "@/firebase";
import { ref, get, set } from 'firebase/database';
import { parseCookies } from "nookies";
import Template from "./Template";
import { useGlobalContext } from "../context/GlobalContext";
import { Icon } from "@blueprintjs/core";

export default function Editor() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [numStages, setNumStages] = useState(0);
    const [activeStage, setActiveStage] = useState(0);
    const [stageSize, setStageSize] = useState({ width: 240, height: 540 });
    const [stageScale, setStageScale] = useState(1);
    const router = useRouter();
    const scrollContainerRef = useRef();
    const { templateName } = useGlobalContext();
    const [template, setTemplate] = useState('');
    const sampleImage = 'images/screenshot-sample.png';

    useEffect(() => {
        const isInitialized = localStorage.getItem('initialized');
        localStorage.setItem('pageLoaded', 'true');
        if (isInitialized !== 'true') {
            const cookies = parseCookies();
            const userId = cookies.userUid;
            if (!userId) return;
            const loadImagesFromFirebase = async () => {
                const files = await getUserFiles(userId);
                const images = files.map(file => file.url);
                setTemplate(templateName);
                setUploadedImages(images);
                setImageList(images);
                setNumStages(images.length);
                await saveUserEdit(userId, templateName, images.length, images, images);
                localStorage.setItem('initialized', 'true');
            };
            loadImagesFromFirebase();
        } else return;
        console.log('Editor initialized');
    }, []);

    useEffect(() => {
        const isInitialized = localStorage.getItem('initialized');
        const cookies = parseCookies();
        const userId = cookies.userUid;
        if (!userId) return; // userId가 없으면 종료
        if(isInitialized === 'true') {
        const fetchEditorState = async () => {
            const editorStateRef = ref(database, `users/${userId}/editor`);
            try {
                const snapshot = await get(editorStateRef);
                if (snapshot.exists()) {
                    const editorState = snapshot.val();
                    setNumStages(editorState.numStages);
                    setImageList(editorState.imageList);
                    setUploadedImages(editorState.uploadedImages);
                    setTemplate(editorState.template);
                    console.log('Editor state fetched successfully:', editorState)
                } else {
                    console.log("No editor state available for this user.");
                }
            } catch (error) {
                console.error('Error fetching editor state:', error);
            }
        };

        fetchEditorState();
    } else return;
    }, []);

    const saveUserEdit = async (userId, templateName, numStages, uploadedImages, imageList) => {
        const editorStateRef = ref(database, `users/${userId}/editor`);
        try {
            await set(editorStateRef, {
                template: templateName,
                numStages: numStages,
                uploadedImages: uploadedImages,
                imageList: imageList
            });
            console.log('Editor state saved successfully');
        } catch (error) {
            console.error('Error saving editor state:', error);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            requestAnimationFrame(() => {
            const clientWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollLeft = (activeStage * stageSize.width) + (stageSize.width / 2) - (clientWidth / 2);
        });}
    }, [activeStage, numStages]); 

    const handleAddPage = () => {
        setNumStages(prevNumStages => prevNumStages + 1); // Increase the number of stages by 1
        setImageList(prevImages => [...prevImages, sampleImage]); // Add a new empty image to the uploaded images
        setActiveStage(numStages); // Set the new stage as the active stage
    };

    const handleStageClick = (index) => {
        setActiveStage(index); // Set the clicked stage as the active stage
    };

    const handleStageDelete = (index) => {
        const updatedImageList = [...imageList];
        updatedImageList.splice(index, 1);
        setImageList(updatedImageList);
        setNumStages(prevNumStages => prevNumStages - 1);
        if(index !== 0){
        setActiveStage(activeStage - 1);
        }
    }

    const updateImageAtIndex = (newImage, index) => {
        const updatedImageList = [...imageList];
        updatedImageList[index] = newImage;
        setImageList(updatedImageList);
    };

    return (
        <div className="body-container max-w-full h-full flex relative">
            <SideBar
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                handleAddPage={handleAddPage}
                updateImageAtIndex={updateImageAtIndex}
                activeStage={activeStage}
            />
            <div className="workspace-wrap w-full overflow-y-hidden overflow-x-auto flex  items-center gap-4 px-10 pb-9 pt-10"
                ref={scrollContainerRef}>
                {Array.from({length: numStages }).map((_, index) => (
                    <div className="flex flex-col items-end self-end">
                        {index === activeStage &&
                            <div onClick={() => handleStageDelete(index)}
                                className="border-2 rounded-xl px-4 py-2 mb-2 font-bold text-red-600 cursor-pointer">
                                    <Icon icon="trash" />
                            </div>
                            }
                        <div onClick={() => handleStageClick(index)} key={index}
                            className={`stage-wrap bg-slate-200 shadow ${index === activeStage ? 'outline outline-2 outline-blue-300' : ''}`}>
                            <Template templateName={template} stageSize={stageSize} stageScale={stageScale} stageIndex={index} image={imageList[index]} isEdit={true} />
                        </div>
                    </div>
                   
                    
                ))}
            </div>
        </div>
    );
}