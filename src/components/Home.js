import Image from "next/image";
import Dropzone from "./Dropzone";
// import Lottie from "react-lottie-player";
import Lottie from "./Lottie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer, Slide } from "react-toastify";
import { Icon, Spinner } from "@blueprintjs/core";
import { ref, get, set } from 'firebase/database';
import { uploadFile, deleteUserFiles, getUserFiles, checkUserSignIn, database} from '../firebase';
import { useGlobalContext } from "./context/GlobalContext";
import imageCompression from "browser-image-compression";
import loadingLottie from "../../public/lottie/toaster-loading.json";

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isEditExisting, setIsEditExisting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileOk, setIsMobileOk] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { uploadedImages, setUploadedImages } = useGlobalContext();

    const router = useRouter();
    const prevEditIcon = '/images/prev_edit_icon.png';
    const mainLottie = '/lottie/toaster-main.json';

    useEffect(() => {
        localStorage.setItem('initialized', false);
        const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        checkUserSignIn((user) => {
                if (user) {
                    setIsUserSignedIn(true);
                    CheckEditExisting(user.uid);
                }
            });
        setIsMobile(mobile);
    }, []);

    useEffect(() => {
        if (isMobile && !isMobileOk) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'auto';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
    }, [isMobile, isMobileOk]);

    const CheckEditExisting = async (userId) => {
        if (!userId) {
            setIsEditExisting(false);
            return;
        }
        //userid에 해당하는 realtime db의 editor가 존재하는지 확인
        const editorRef = ref(database, `users/${userId}/editor`);
        const editorSnapshot = await get(editorRef);
        if (editorSnapshot.exists()) {
            setIsEditExisting(true);
            return;
        }
    }

    const handleUploadButtonClick = async () => {
        checkUserSignIn((user) => {
            if(!user) {
                toast('사용자 인증이 완료되지 않았습니다. 새로고침 후 다시 시도해 주세요.');
                return;
            }
        });
        try {
            await deleteUserFiles();

            const newUploadedFiles = await handleFilesUpload(selectedFiles);
            if (newUploadedFiles.length > 0) {
                router.push({
                    pathname: '/template',
                    // query: { images: JSON.stringify(newUploadedFiles.slice(0, 4)) },
                }, '/template');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleGoToExistingEdit = () => {
        router.push('/editor');
    }

    const compressImage = async (imageFile) => {
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        try {
            const compressedFile = await imageCompression(imageFile, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    }

    const handleFilesUpload = async (files) => {
        setIsUploading(true);
        const newUploadedFiles = new Array(files.length); // Create an array with the same length as files
        const uploadPromises = files.map(async (file, index) => {
            try {
                const compressedFile = await compressImage(file);
                const uploadedFile = await uploadFile(compressedFile, index);
                newUploadedFiles[index] = { ...uploadedFile, originalIndex: index };
                setUploadProgress(prevProgress => prevProgress + 1); // Update progress
                return uploadedFile;
            } catch (error) {
                console.error('Error uploading file:', error);
                toast('업로드에 실패했습니다. 다시 시도해 주세요.');
                return null;
            }
        });
    
        await Promise.all(uploadPromises);
    
        setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
        setIsUploading(false);
        return newUploadedFiles;
    };
    


    return (
        <div className="body-container">
            {isMobile && !isMobileOk && <div className="mobile fixed z-50 top-0 h-screen w-screen flex items-center justify-center bg-white bg-opacity-90">
                <div className="loading-container flex flex-col my-auto mx-auto text-center self-center justify-self-center gap-4">
                    <div className="text-xl self-center font-bold text-neutral-500">이 사이트는 pc환경에 최적화되어 있어요.</div>
                    <button onClick={() => setIsMobileOk(true)}
                        className="text-xl self-center font-bold py-3 px-6 rounded-full bg-neutral-400 text-white">모바일로 계속하기</button>
                </div>

            </div>}
            {isUploading && <div className={`loading fixed z-50 top-0 flex items-center justify-center bg-white bg-opacity-50 ${isMobile ? 'h-screen w-screen' : 'h-full w-full'}`}>
                <div className="loading-container my-auto mx-auto self-center justify-self-center">
                    <div className="w-36 h-36 pb-2">
                        <Lottie animationData={loadingLottie} />
                    </div>
                    <div className="text-2xl self-center font-bold text-neutral-500">업로드 중... {uploadProgress}/{selectedFiles.length}</div>
                </div>

            </div>}

            <ToastContainer
                hideProgressBar={true}
                transition={Slide} />
            <div className="flex flex-col h-full w-full py-10 px-24 justify-between">
                <div className="home-content-box mb-2 flex text-lg content-between">
                    <div className="description h-fit basis-auto w-1/2 min-w-fit">
                        <h2 className="text-3xl font-bold my-6">
                            <div>샷토스터로 앱스토어 스크린샷을</div>
                            <div>손쉽게 만들어 보세요</div>
                        </h2>
                        <div className="mb-4">앱 화면 캡처샷 업로드로 스토어 등록용 스크린샷을 제작할 수 있어요</div>
                        <div onClick={handleGoToExistingEdit}
                            className={`existing-info-box flex justify-between bg-blue-200 rounded p-2 cursor-pointer transform transition-all duration-1000
                            ${isEditExisting ? 'translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0'}`}>
                            <div className="flex items-center">
                                <div className="image-container w-auto ml-4 mr-2 flex items-center justify-center bg-transparent rounded">
                                    <Image className="w-[50px] h-auto"
                                        src={prevEditIcon}
                                        width={50}
                                        height={50}
                                    ></Image>
                                </div>
                                <div>
                                    <div className="font-bold">굽던 스크린샷이 있어요! 작업하던 프로젝트로 이동하시겠어요?</div>
                                    <div className=" text-base">새로운 캡처샷을 업로드하면 기존의 프로젝트는 삭제돼요 X(</div>
                                </div>
                            </div>
                            <div className="flex text-blue-400 font-bold items-center ml-8 mr-2">
                                <span>이동하기</span>
                                <Icon icon="chevron-right" size={20} />
                            </div>
                        </div>

                    </div>
                    <div className="right-box h-auto w-1/2 flex-col justify-between px-8">
                        <div className="storeicons-container flex items-center justify-end">
                            <span className="mr-2">for</span>
                            <Image
                                alt="appstore-icon"
                                className="object-contain mx-4 w-[40px] h-auto"
                                src='/images/apple-app-store-icon.png'
                                width={40}
                                height={40}
                            />
                            <Image
                                alt="playstore-icon"
                                className="object-contain w-[40px] h-auto"
                                src='/images/playstore-icon.png'
                                width={40}
                                height={40}
                            />
                        </div>
                        <div className="gif-container flex justify-end mt-6">
                            <Image
                                alt="toaster-gif"
                                className="object-contain w-[450px] h-auto"
                                src='/images/shottoastergif.gif'
                                priority={true}
                                width={500}
                                height={500}
                                unoptimized={true}
                            />
                            {/* <div className="w-[450px] h-auto">
                            <Lottie animationData={lottieJson}/>
                            </div> */}
                            
                        </div>

                    </div>
                </div>
                <div className="upload-box flex flex-grow max-h-80 w-full my-6">
                    <Dropzone selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                </div>
                <div className="uploaded-button flex flex-col items-center">
                    <button onClick={handleUploadButtonClick}
                        disabled={selectedFiles?.length === 0}
                        className="upload-button rounded-full py-3 px-16 bg-black text-white text-xl font-bold disabled:bg-neutral-400">
                        다음 단계로
                    </button>
                </div>
            </div>
        </div>
    );
} 