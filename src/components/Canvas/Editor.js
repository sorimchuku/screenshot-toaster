import React, { useRef, useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import SideBar from "./Sidebar";
import { getUserFiles, database } from "@/firebase";
import { ref, get, set } from 'firebase/database';
import { parseCookies } from "nookies";
import Template from "./Template";
import { useGlobalContext } from "../context/GlobalContext";
import { Icon } from "@blueprintjs/core";
import { v4 as uuidv4 } from 'uuid';
import { templates } from "./Data/templates";

export default function Editor() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [stages, setStages] = useState([]);
    const [activeStage, setActiveStage] = useState(0);
    const [stageSize, setStageSize] = useState({ width: 240, height: 540 });
    const [stageScale, setStageScale] = useState(1);
    const router = useRouter();
    const scrollContainerRef = useRef();
    const { templateName, startSaving, finishSaving, setLastSaved } = useGlobalContext();
    const [template, setTemplate] = useState('');
    const sampleImage = 'images/screenshot-sample.png';

    const prevStateRef = useRef({ template, uploadedImages, stages });

    useEffect(() => {
        const isInitialized = localStorage.getItem('initialized');
        localStorage.setItem('pageLoaded', 'true');
        const cookies = parseCookies();
        const userId = cookies.userUid;
        if (isInitialized !== 'true') {
            if (!userId) return;
            const loadImagesFromFirebase = async () => {
                const files = await getUserFiles(userId);
                const images = files.map(file => file.url);
                setTemplate(templateName);
                setUploadedImages(images);
                const newStages = Array.from({ length: images.length }, (_, index) => newStage(images[index], index));
                setStages(newStages);
                console.log('Images loaded from Firebase:', newStages);
                
                await saveUserEdit(userId, templateName, images, newStages);
                localStorage.setItem('initialized', 'true');
            };
            loadImagesFromFirebase();
        } else return;
        
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
                    setUploadedImages(editorState.uploadedImages);
                    setTemplate(editorState.template);
                    setStages(editorState.stages);
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

    useEffect(() => {
        const userId = parseCookies().userUid;
        if (!userId) return; // userId가 없으면 종료

        const intervalId = setInterval(() => {
            // ref의 현재 값을 사용하여 saveUserEdit 호출
            saveUserEdit(prevStateRef.current.userId, prevStateRef.current.template,  prevStateRef.current.uploadedImages, prevStateRef.current.stages);
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        prevStateRef.current = { template,  uploadedImages, stages };
    }, [template,  uploadedImages, stages]);

    const newStage = (image = null, layoutIndex = 4) => {
        const stageId = uuidv4();
        const stage = {
            id:stageId,
            image:image || sampleImage,
            layoutIndex:layoutIndex,
        }
        return stage;
    }

    const saveUserEdit = async (userId, templateName, uploadedImages, stages) => {
        startSaving();
        const editorStateRef = ref(database, `users/${userId}/editor`);
        try {
            await set(editorStateRef, {
                template: templateName,
                uploadedImages: uploadedImages,
                stages: stages,
            });
            const now = new Date();
            const hours = now.getHours().toString();
            const minutes = now.getMinutes().toString();
            const formattedTime = `${hours}:${minutes}`; // hh:mm 형식으로 조합

            setLastSaved(formattedTime);
        } catch (error) {
            console.error('Error saving editor state:', error);
        } finally {
            finishSaving();
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            requestAnimationFrame(() => {
            const clientWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollLeft = (activeStage * stageSize.width) + (stageSize.width / 2) - (clientWidth / 2);
        });}
    }, [activeStage]); 

    const handleAddPage = () => {
        const stage = newStage(); // 새로운 스테이지 생성
        const updatedStages = [...stages]; // stages 배열 복사
        updatedStages.splice(activeStage + 1, 0, stage); // 활성화된 스테이지 다음 위치에 새 스테이지 삽입
        setStages(updatedStages); // 수정된 배열을 상태에 설정
        setActiveStage(activeStage + 1); // 새로운 스테이지를 활성화된 스테이지로 설정
    };

    const handleStageClick = (index) => {
        setActiveStage(index); // Set the clicked stage as the active stage
    };

    const handleStageDelete = (index) => {
        const updatedStages = stages.filter((_, i) => i !== index);
        setStages(updatedStages);
        if(index !== 0){
        setActiveStage(activeStage - 1);
        }
    }

    const handleStageMove = (currentIndex, direction) => {
        const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

        // 인덱스가 배열 범위를 벗어나지 않는지 확인
        if (newIndex < 0 || newIndex >= stages.length) return;

        // 스테이지 배열 복사
        const updatedStages = [...stages];
        // 현재 스테이지를 새 인덱스로 이동
        const [removedStage] = updatedStages.splice(currentIndex, 1);
        updatedStages.splice(newIndex, 0, removedStage);

        // 업데이트된 스테이지 배열로 상태 업데이트
        setStages(updatedStages);
        // 이동된 스테이지를 활성화
        setActiveStage(newIndex);
    };

    const updateImageAtIndex = (newImage, index) => {
        const updatedStages = [...stages]; // stages 배열 복사
        const updatedStage = { ...updatedStages[index], image: newImage }; // 해당 index의 stage 업데이트
        updatedStages[index] = updatedStage; // 업데이트된 stage를 배열에 할당
        setStages(updatedStages); // 상태 업데이트
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
                {stages.map((stage, index) => (
                    <div className="flex flex-col items-end self-end" key={'stage' + index}>
                        {index === activeStage &&
                        <div className="flex border-2 rounded-xl px-4 py-2 mb-2 items-center gap-3">
                            <div className="flex gap-2 cursor-pointer">
                                <div onClick={() => handleStageMove(index, 'prev')} key={'prev' + index}
                                    className=" text-gray-900 ">
                                    <Icon icon="chevron-left" /> 
                                </div>
                                <div onClick={() => handleStageMove(index, 'next')} key={'next' + index}
                                    className=" text-gray-900 ">
                                    <Icon icon="chevron-right" />
                                </div>
                            </div>
                            <div className="text-gray-400">|</div>
                                <div onClick={() => handleStageDelete(index)} key={'delete' + index}
                                    className=" text-red-600 cursor-pointer">
                                    <Icon icon="trash" />
                                </div>
                        </div>
                            
                            }
                        <div onClick={() => handleStageClick(index)} key={index}
                            className={`stage-wrap bg-slate-200 shadow ${index === activeStage ? 'outline outline-2 outline-blue-300' : ''}`}>
                            <Template templateName={template} stageSize={stageSize} stageScale={stageScale} stageIndex={stage.layoutIndex} image={stage.image} isEdit={true} />
                        </div>
                    </div>
                   
                    
                ))}
            </div>
        </div>
    );
}