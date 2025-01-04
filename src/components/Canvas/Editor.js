import React, { useRef, useState, useEffect, use } from "react";
import SideBar from "./Sidebar";
import { getUserFiles, database, getUserId } from "@/firebase";
import { ref, get, set } from 'firebase/database';
import Template from "./Template";
import { useGlobalContext } from "../context/GlobalContext";
import { Icon } from "@blueprintjs/core";
import { v4 as uuidv4 } from 'uuid';
import { templates, textData } from "./Data/templates";
import JSZip from "jszip";
import { devices } from "./Data/devices";
export default function Editor() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [stages, setStages] = useState([]);
    const [activeStage, setActiveStage] = useState(0);
    const [stageSize, setStageSize] = useState({ width: 240, height: 540 });
    const [stageScale, setStageScale] = useState(1);
    const [selectedTools, setSelectedTools] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { templateName, startSaving, finishSaving, setLastSaved, selectedDevice, setSelectedDevice, saveMethod, setSaveMethod, saveEventRef, exportEventRef, history, currentStep, saveHistory,  } = useGlobalContext();
    const [template, setTemplate] = useState('');
    const [isSaveError, setIsSaveError] = useState(false);
    const sampleImage = 'images/screenshot-sample.png';
    const currentStageStyle = stages ? stages[activeStage]?.style : null;
    const prevStateRef = useRef({ template, uploadedImages, stages, selectedDevice });
    const scrollContainerRef = useRef();
    const stageRefs = useRef([]);

    const defaultRatio = 9 / 19.6;
    useEffect(() => {
        const updateStageSize = () => {
            const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            let windowHeight = window.innerHeight;
            if (mobile) {
                windowHeight = 720;
            }
            if (!selectedDevice) {
                const ratio = defaultRatio;
                const height = windowHeight * 0.7;
                const width = height * ratio;
                setStageSize({ width, height });
                return;
            }
            const ratio = selectedDevice.ratio;
            const height = windowHeight * 0.7;
            const width = height * ratio
            setStageSize({ width, height });
        };
        window.addEventListener('resize', updateStageSize);
        updateStageSize(); // Set initial size

        return () => {
            window.removeEventListener('resize', updateStageSize);
        };
    }, [selectedDevice]);



    useEffect(() => {
        const isInitialized = localStorage.getItem('initialized');
        localStorage.setItem('pageLoaded', 'true');

        if (isInitialized !== 'true') {
            const loadImagesFromFirebase = async () => {
                const userId = await getUserId();
                if (!userId) return;
                const images = await getUserFiles(userId);
                // const images = files.map(file => file);
                setTemplate(templateName);
                setUploadedImages(images);
                let newStages = Array.from({ length: images.length }, (_, index) => newStage(templateName, images[index], index));
                newStages = newStages.map((stage, index) => {
                    if (stage.style.twins) {
                        if (index === 0 || index === 1) {
                            return newStage(templateName, images[0], index);
                        }
                    } else {
                        return newStage(templateName, images[index], index);
                    }
                    return stage;
                });

                setStages(newStages);
                console.log('Images loaded from Firebase:', newStages);

                await saveUserEdit(userId, images, newStages, selectedDevice);
                localStorage.setItem('initialized', 'true');
                saveHistory(newStages);
            };
            loadImagesFromFirebase();
        } else return;
    }, []);

    useEffect(() => {
        const isInitialized = localStorage.getItem('initialized');
        if (isInitialized === 'true') {
            const fetchEditorState = async () => {
                const userId = await getUserId();
                if (!userId) return; // userId가 없으면 종료
                const editorStateRef = ref(database, `users/${userId}/editor`);
                try {
                    const snapshot = await get(editorStateRef);
                    if (snapshot.exists()) {
                        const editorState = snapshot.val();
                        console.log('Editor state fetched successfully:', editorState);
                        const images = Array.isArray(editorState.uploadedImages)
                            ? editorState.uploadedImages
                            : [editorState.uploadedImages];

                        setUploadedImages(images);
                        setStages(editorState.stages ?? []);
                        setSelectedDevice(editorState.selectedDevice);
                        console.log('Editor state fetched successfully:', editorState)
                        saveHistory(editorState.stages ?? []);
                    } else {
                        console.log("No editor state available for this user.");
                    }
                } catch (error) {
                    console.error('Error fetching editor state:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEditorState();
        } else {
            setIsLoading(false);
        };
    }, []);

    useEffect(() => {
        // 변경 사항이 있는지 확인하는 함수
        const hasChanges = () => {
            return JSON.stringify({ uploadedImages, stages, template, selectedDevice }) !== JSON.stringify(prevStateRef.current);
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
    }, [uploadedImages, stages, template, selectedDevice]);
    useEffect(() => {
        const fetchUserIdAndSetInterval = async () => {
            const userId = await getUserId();
            if (!userId) return;
            const intervalId = setInterval(() => {
                saveUserEdit(userId, prevStateRef.current.uploadedImages ?? [], prevStateRef.current.stages ?? [], prevStateRef.current.selectedDevice ?? null);
                setSaveMethod('auto');
            }, 180000);


            return () => clearInterval(intervalId);
        };

        fetchUserIdAndSetInterval();
    }, []);

    useEffect(() => {
        prevStateRef.current = { template, uploadedImages, stages, selectedDevice };
        saveEventRef.current = async () => {
            const userId = await getUserId();
            if (!userId) return;
            await saveUserEdit(userId, prevStateRef.current.uploadedImages ?? [], prevStateRef.current.stages ?? [], prevStateRef.current.selectedDevice ?? null);
        };
    }, [template, uploadedImages, stages, selectedDevice]);

    useEffect(() => {
        exportEventRef.current = exportStagesToImages;
    }, [exportEventRef.current]);

    useEffect(() => {
        const updateRatio = () => {
            const ratio = selectedDevice ? selectedDevice.ratio : defaultRatio;
            //stages의 모든 stage에 대해 stage.style의 ratio를 업데이트
            const updatedStages = stages.map(stage => {
                const updatedStyle = { ...stage.style, ratio };
                return { ...stage, style: updatedStyle };
            });
            setStages(updatedStages);
        };
        updateRatio();
    }, [selectedDevice]);

    const newStage = (newTemplateName = 'template1', image = null, layoutIndex = 4,) => {
        const stageId = uuidv4();
        const foundTemplate = templates?.find(t => t.name === newTemplateName);
        const initialStyle = foundTemplate.stages[layoutIndex] || foundTemplate.stages[foundTemplate.stages.length - 1];
        const newInitialStyle = { ...initialStyle, ratio: selectedDevice?.ratio || defaultRatio };
        const stage = {
            id: stageId,
            image: image || sampleImage,
            templateName: newTemplateName,
            layoutIndex: layoutIndex,
            style: newInitialStyle,
            text: textData,
        }
        return stage;
    }

    const saveUserEdit = async (userId, uploadedImages, stages, selectedDevice) => {
        startSaving();
        if (!userId) return;
        const userRef = ref(database, `users/${userId}`);
        const editorStateRef = ref(database, `users/${userId}/editor`);
        try {
            await set(userRef, { uid: userId });
            await set(editorStateRef, {
                uploadedImages: uploadedImages,
                stages: stages,
                selectedDevice: selectedDevice,
            });
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`; // hh:mm 형식으로 조합

            setLastSaved(formattedTime);
            console.log('Editor state saved successfully:', { uploadedImages, stages, selectedDevice });
        } catch (error) {
            console.error('Error saving editor state:', error);
            setIsSaveError(true);
        } finally {
            finishSaving();
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            requestAnimationFrame(() => {
                const clientWidth = scrollContainerRef.current.clientWidth;
                scrollContainerRef.current.scrollLeft = (activeStage * stageSize.width) + (stageSize.width / 2) - (clientWidth / 2);
            });
        }
    }, [activeStage]);

    const handleAddPage = () => {
        const stage = newStage(); // 새로운 스테이지 생성
        const updatedStages = [...stages]; // stages 배열 복사
        updatedStages.splice(activeStage + 1, 0, stage); // 활성화된 스테이지 다음 위치에 새 스테이지 삽입
        setStages(updatedStages); // 수정된 배열을 상태에 설정
        setActiveStage(activeStage + 1); // 새로운 스테이지를 활성화된 스테이지로 설정
        saveHistory(updatedStages);
    };

    const handleStageClick = (index) => {
        setActiveStage(index); // Set the clicked stage as the active stage
    };

    const handleStageDelete = (index) => {
        const updatedStages = stages.filter((_, i) => i !== index);
        setStages(updatedStages);
        if (index === stages.length - 1) {
            setActiveStage(activeStage - 1);
        }
        saveHistory(updatedStages);
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
        saveHistory(updatedStages);
    };

    const updateImageAtIndex = (newImage, index) => {
        const updatedStages = [...stages]; // stages 배열 복사
        const updatedStage = { ...updatedStages[index], image: newImage }; // 해당 index의 stage 업데이트
        updatedStages[index] = updatedStage; // 업데이트된 stage를 배열에 할당
        setStages(updatedStages); // 상태 업데이트
        saveHistory(updatedStages);
    };

    const updateLayoutAtIndex = (template, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const newStyle = { ...template.style, ratio: selectedDevice?.ratio || defaultRatio };
        const updatedStage = { ...updatedStages[activeStage], templateName: template.templateName, layoutIndex: template.index, style: newStyle };
        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeStageColor = (color, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        console.log(updatedStages);
        const updatedStage = { ...updatedStages[activeStage], style: { ...updatedStages[activeStage].style, bgColor: color } };
        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeAllStageColor = (color) => {
        const updatedStages = stages.map(stage => ({ ...stage, style: { ...stage.style, bgColor: color } }));
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const toggleTitleSubtitle = (toolId, checked) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, title: checked };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitle: checked };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
    };

    const changeTextColor = (toolId, color, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, titleColor: color };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitleColor: color };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeAllTextColor = (toolId, color) => {
        const updatedStages = stages.map(stage => {
            if (toolId === 2) {
                return { ...stage, style: { ...stage.style, titleColor: color } };
            } else if (toolId === 3) {
                return { ...stage, style: { ...stage.style, subTitleColor: color } };
            }
            return stage;
        });
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeTextPosition = (toolId, position, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, titlePosition: position };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitlePosition: position };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeTextFont = (toolId, font, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, titleFont: font };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitleFont: font };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeTextSize = (toolId, size, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, titleSize: size };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitleSize: size };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeTextWeight = (toolId, weight, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, titleWeight: weight };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitleWeight: weight };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeTextAlignment = (toolId, alignment, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (toolId === 2) {
            updatedStage.style = { ...updatedStage.style, titleAlign: alignment };
        } else if (toolId === 3) {
            updatedStage.style = { ...updatedStage.style, subTitleAlign: alignment };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const changeText = (type, text, activeStage) => {
        if (activeStage === null) return;
        const updatedStages = [...stages];
        const updatedStage = { ...updatedStages[activeStage] };

        if (type === 'title') {
            updatedStage.text = { ...updatedStage.text, title: text };
        } else if (type === 'subTitle') {
            updatedStage.text = { ...updatedStage.text, subTitle: text };
        }

        updatedStages[activeStage] = updatedStage;
        setStages(updatedStages);
        saveHistory(updatedStages);
    }

    const exportStagesToImages = async (exportDevices, fileName) => {
        const zip = new JSZip();
        const originalDevice = selectedDevice;

        for (const deviceId of exportDevices) {
            const device = devices.find(device => String(device.id) === deviceId);
            await new Promise(resolve => {
                setSelectedDevice(device);
                setTimeout(resolve, 100); // Wait for the device change to take effect
            });

            const folder = zip.folder(device.name);
            const deviceRatio = device.ratio;
            const deviceStageSize = { width: 1080, height: 1080 / deviceRatio };

            const devicePromises = stageRefs.current.map(async (stageRef, index) => {
                if (stageRef) {
                    const dataURL = stageRef.toDataURL({ pixelRatio: deviceStageSize.width / stageRef.width() });
                    const filename = `${device.name}-${index + 1}.png`;
                    const response = await fetch(dataURL);
                    const blob = await response.blob();
                    folder.file(filename, blob);
                }
            });

            await Promise.all(devicePromises);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            const link = document.createElement('a');
            let fileNameText = "Shottoaster";
            if (fileName.length > 0) {
                fileNameText = fileName.replace(/ /g, '-');
            }
            link.href = URL.createObjectURL(content);
            link.download = `${fileNameText}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        setSelectedDevice(originalDevice);
    };


    const changeSelectedTool = (id, isEdit = false) => {
        if (selectedTools === id && isEdit === false) {
            setSelectedTools(null);
        } else {
            setSelectedTools(id);
        }
    }

    useEffect(() => {
        if (currentStep >= 0 && currentStep < history.length) {
            const { stages } = history[currentStep];
            setStages(stages);
        }
    }, [currentStep, history]);


    return (
        <div className="body-container max-w-full h-full flex relative">
            <div className="sidebar-wrap w-[340px] min-w-[340px] h-full overflow-y-scroll z-[1] bg-neutral-100 border-r-2 relative overflow-x-hidden">
                {!isLoading && <SideBar
                    uploadedImages={uploadedImages}
                    setUploadedImages={setUploadedImages}
                    handleAddPage={handleAddPage}
                    updateImageAtIndex={updateImageAtIndex}
                    activeStage={activeStage}
                    updateLayoutAtIndex={updateLayoutAtIndex}
                    changeStageColor={changeStageColor}
                    changeAllStageColor={changeAllStageColor}
                    toggleTitleSubtitle={toggleTitleSubtitle}
                    changeTextColor={changeTextColor}
                    changeAllTextColor={changeAllTextColor}
                    currentStageStyle={currentStageStyle}
                    changeTextPosition={changeTextPosition}
                    changeTextFont={changeTextFont}
                    changeTextSize={changeTextSize}
                    changeTextWeight={changeTextWeight}
                    changeTextAlignment={changeTextAlignment}
                    selectedTools={selectedTools}
                    changeSelectedTool={changeSelectedTool}
                />}
            </div>
            <div className="workspace-wrap w-full overflow-y-hidden overflow-x-auto flex  items-center gap-4 px-10 pb-9 pt-10"
                ref={scrollContainerRef}>
                {stages?.map((stage, index) => (

                    <div className="flex flex-col items-end relative " key={'stage' + index}>
                        {index === activeStage &&
                            <div className="flex absolute -translate-y-12 bg-white border-2 rounded-xl px-4 py-2 mb-2 items-center gap-3">
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
                            <Template ref={el => (stageRefs.current[index] = el)} templateName={stage.templateName} stageSize={stageSize} stageScale={stageScale} stageIndex={stage.layoutIndex} image={stage.image} isEdit={true} style={stage.style} text={stage.text} changeText={changeText} device={selectedDevice?.id || 0} changeSelectedTool={changeSelectedTool} />
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
}