import React, { useRef, useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import SideBar from "./Sidebar";
import { getUserFiles, database, getUserId } from "@/firebase";
import { ref, get, set } from 'firebase/database';
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
        
        if (isInitialized !== 'true') {
            const loadImagesFromFirebase = async () => {
                const userId = await getUserId();
                if (!userId) return;
                const files = await getUserFiles(userId);
                const images = files.map(file => file.url);
                setTemplate(templateName);
                setUploadedImages(images);
                const newStages = Array.from({ length: images.length }, (_, index) => newStage(templateName, images[index], index));
                setStages(newStages);
                console.log('Images loaded from Firebase:', newStages);
                
                await saveUserEdit(userId, images, newStages);
                localStorage.setItem('initialized', 'true');
            };
            loadImagesFromFirebase();
        } else return;
    }, []);

    useEffect(() => {
        const isInitialized = localStorage.getItem('initialized');

        if(isInitialized === 'true') {
        const fetchEditorState = async () => {
            const userId = await getUserId();
            if (!userId) return; // userId가 없으면 종료
            const editorStateRef = ref(database, `users/${userId}/editor`);
            try {
                const snapshot = await get(editorStateRef);
                if (snapshot.exists()) {
                    const editorState = snapshot.val();
                    setUploadedImages(editorState.uploadedImages);
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
        // 변경 사항이 있는지 확인하는 함수
        const hasChanges = () => {
            return JSON.stringify({ uploadedImages, stages, template }) !== JSON.stringify(prevStateRef.current);
        };

        // 페이지를 나갈 때 실행될 함수
        const handleBeforeUnload = (e) => {
            if (hasChanges()) {
                // 기본 이벤트를 방지하고, 사용자에게 경고 메시지를 표시
                // e.preventDefault();
                // e.returnValue = '';
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [uploadedImages, stages, template]); // 의존성 배열에 상태를 추가하여 해당 상태가 변경될 때마다 이펙트를 다시 실행


    useEffect(() => {
        const fetchUserIdAndSetInterval = async () => {
            const userId = await getUserId();
            if (!userId) return;
            const intervalId = setInterval(() => {
                saveUserEdit(userId, prevStateRef.current.uploadedImages, prevStateRef.current.stages);
            }, 30000);

            return () => clearInterval(intervalId);
        };

        fetchUserIdAndSetInterval();
    }, []);

    useEffect(() => {
        prevStateRef.current = { template,  uploadedImages, stages };
    }, [template,  uploadedImages, stages]);

    const newStage = (newTemplateName = 'template1', image = null, layoutIndex = 4,) => {
        const stageId = uuidv4();
        const foundTemplate = templates.find(t => t.name === newTemplateName);
        const initialStyle = foundTemplate.stages[layoutIndex] || foundTemplate.stages[foundTemplate.stages.length - 1];
        const stage = {
            id:stageId,
            image:image || sampleImage,
            templateName: newTemplateName,
            layoutIndex:layoutIndex,
            style: initialStyle,
        }
        return stage;
    }

    const saveUserEdit = async (userId, uploadedImages, stages) => {
        startSaving();
        if(!userId) return;
        const editorStateRef = ref(database, `users/${userId}/editor`);
        try {
            await set(editorStateRef, {
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

    const updateLayoutAtIndex = (template, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage], templateName: template.templateName, layoutIndex: template.index, style: template.style};
        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
    }
    
    const changeStageColor = (color, activeStage) => {
        if (activeStage  === null ) return;
        const updatedStages = [...stages];
        console.log(updatedStages);
        const updatedStage = { ...updatedStages[activeStage], style: { ...updatedStages[activeStage].style, bgColor: color } };
        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
    }


    return (
        <div className="body-container max-w-full h-full flex relative">
            <SideBar
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                handleAddPage={handleAddPage}
                updateImageAtIndex={updateImageAtIndex}
                activeStage={activeStage}
                updateLayoutAtIndex={updateLayoutAtIndex}
                changeStageColor={changeStageColor}
            />
            <div className="workspace-wrap w-full overflow-y-hidden overflow-x-auto flex  items-center gap-4 px-10 pb-9 pt-10"
                ref={scrollContainerRef}>
                {stages.map((stage, index) => (
                    
                    <div className="flex flex-col items-end " key={'stage' + index}>
                        {index === activeStage &&
                        <div className="flex absolute z-10 -translate-y-12 bg-white border-2 rounded-xl px-4 py-2 mb-2 items-center gap-3">
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
                        <div onClick={() => handleStageClick(index)} onTouchStart={() => handleStageClick(index)} key={index}
                            className={`stage-wrap bg-slate-200 shadow ${index === activeStage ? 'outline outline-2 outline-blue-300' : ''}`}>
                            <Template templateName={stage.templateName} stageSize={stageSize} stageScale={stageScale} stageIndex={stage.layoutIndex} image={stage.image} isEdit={true} style={stage.style} />
                        </div>
                    </div>
                    
                ))}
            </div>
        </div>
    );
}