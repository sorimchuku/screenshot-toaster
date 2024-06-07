import Image from "next/image";
import Dropzone from "./Dropzone";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer, Slide } from "react-toastify";
import { Icon, Spinner } from "@blueprintjs/core";
import { uploadFile, deleteUserFiles, getUserFiles } from '../firebase';

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isEditExisting, setIsEditExisting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    
    const CheckEditExisting = async () => {
        const userId = localStorage.getItem('userUid');
        const files = await getUserFiles(userId);
        if (files.length > 0) {
            setIsEditExisting(true);
        } else {
            setIsEditExisting(false);
        }
    }

    const handleUploadButtonClick = async () => {
        try {
            await deleteUserFiles();

            const newUploadedFiles = await handleFilesUpload(selectedFiles);
            if (newUploadedFiles.length > 0) {
                router.push({
                    pathname: '/template',
                    query: { images: JSON.stringify(newUploadedFiles.slice(0, 4)) },
                }, '/template');
            } else {
                toast("파일을 추가해 주세요.");
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleGoToExistingEdit = () => {
        router.push('/editor');
    }

    const handleFilesUpload = async (files) => {
        setIsUploading(true);
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
        setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
        setIsUploading(false);
        return newUploadedFiles;
    };

    useEffect(() => {
        CheckEditExisting();
    }, []);

    return (
        <div className="body-container">
            {isUploading && <div className="loading fixed z-50 top-0 h-full w-full flex items-center justify-center bg-white bg-opacity-50">
                <div className="loading-container my-auto mx-auto self-center justify-self-center">
                    <Spinner size={Spinner.SIZE_LARGE} className="pb-2" />
                    <div className="text-2xl self-center font-bold text-neutral-500">업로드 중...</div>
                    </div>
                
                </div>}
            <ToastContainer
                hideProgressBar={true}
                transition={Slide} />
            <main className="flex-col max-h-screen flex-shrink-1 p-10 px-36 justify-around">
            <div className="home-content-box flex text-lg content-between items-stretch">
                <div className="description h-fit basis-auto w-1/2 min-w-fit">
                        <h2 className="text-3xl font-bold my-6">
                            <div>샷토스터로 앱스토어 스크린샷을</div>
                            <div>손쉽게 만들어 보세요</div>
                            </h2>
                        <div className="mb-4">원본 화면 캡처샷 업로드로 스토어 등록용 스크린샷을 제작할 수 있어요</div>
                        <div onClick={handleGoToExistingEdit} 
                            className={`existing-info-box flex justify-between bg-blue-200 rounded p-2 cursor-pointer transform transition-all duration-1000
                            ${isEditExisting ? 'translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0'}`}>
                            <div className="flex">
                                <div className="image-container w-24 bg-white rounded">
                                <Image className="object-contain"></Image>
                                </div>
                                <div className=" mx-4">
                                    <div className="font-bold">굽던 스크린샷이 있어요! 작업하던 프로젝트로 이동하시겠어요?</div>
                                    <div className=" text-base">새로운 캡처샷을 업로드하면 기존의 프로젝트는 삭제돼요 X(</div>
                                </div>
                            </div>
                            <div className="flex text-blue-400 font-bold items-center ml-8">
                                <span>이동하기</span>
                                <Icon icon="chevron-right" size={20} />
                            </div>
                        </div>
                        
                </div>
                    <div className="right-box h-auto w-1/2 flex-col justify-between px-8">
                        <div className="storeicons-container flex items-center justify-end">
                            <span className="mr-12">for</span>
                            <Image
                            alt="appstore-icon"
                            className="object-contain mx-4"
                            src='/images/apple-app-store-icon.png'
                            width={40}
                            height={40}
                            />
                            <Image
                                alt="playstore-icon"
                                className="object-contain"
                                src='/images/playstore-icon.png'
                                width={40}
                                height={40}
                            />
                        </div>
                        <div className="gif-container flex justify-end mt-6">
                            <Image
                                alt="toaster-gif"
                                className="object-contain"
                                src='/images/shottoastergif.gif'
                                priority={true}
                                width={300}
                                height={300}
                            />
                        </div>
                        
                    </div>
            </div>
                <div className="upload-box h-60 w-full my-6">
                    <Dropzone selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                </div>
                <div className="uploaded-button flex flex-col items-center">
                <button onClick={handleUploadButtonClick}
                    disabled={selectedFiles?.length === 0}
                    className="upload-button rounded-full py-3 px-16 bg-black text-white text-xl font-bold disabled:bg-neutral-400">
                        템플릿 선택으로
                </button>
                </div>
        </main>
        </div>
    );
} 