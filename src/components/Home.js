import Image from "next/image";
import Dropzone from "./Dropzone";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer, Slide } from "react-toastify";
import { Icon } from "@blueprintjs/core";

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isEditExisting, setIsEditExisting] = useState(true);
    const router = useRouter();

    const handleFileUpload = (files) => {
        setUploadedFiles(files);
    };

    const handleUploadButtonClick = () => {
        if (uploadedFiles.length > 0) {
            router.push('/template');
        } else {
            toast("파일을 추가해 주세요.");
        }
    };

    const handleGoToExistingEdit = () => {
        router.push('/editor');
    }

    return (
        <div className="">
            <ToastContainer
                hideProgressBar={true}
                transition={Slide} />
            <main className="flex-col max-h-screen flex-shrink-1 p-10 px-36 justify-around">
            <div className="home-content-box flex text-lg content-between items-stretch">
                <div className="description h-fit basis-auto w-1/2 min-w-fit">
                        <h2 className="text-3xl font-bold my-6">
                            <p>샷토스터로 앱스토어 스크린샷을</p>
                            <p>손쉽게 만들어 보세요</p>
                            </h2>
                        <p className="mb-4">원본 화면 캡처샷 업로드로 스토어 등록용 스크린샷을 제작할 수 있어요</p>
                        <div onClick={handleGoToExistingEdit} 
                        className={`existing-info-box flex justify-between bg-blue-200 rounded p-2 cursor-pointer ${isEditExisting ? '' : 'invisible'}`}>
                            <div className="flex">
                                <div className="image-container w-24 bg-white rounded">
                                <Image className="object-contain"></Image>
                                </div>
                                <div className=" mx-4">
                                    <p className="font-bold">굽던 스크린샷이 있어요! 작업하던 프로젝트로 이동하시겠어요?</p>
                                    <p className=" text-base">새로운 캡처샷을 업로드하면 기존의 프로젝트는 삭제돼요 X(</p>
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
                        <div className="gif-container flex justify-end">
                            <Image
                            alt="sample-image"
                            className="object-contain"
                            src='/images/shottoaster.gif'
                            priority={true}
                            width={120}
                            height={120}
                            />
                        </div>
                        
                    </div>
            </div>
                <div className="upload-box h-60 w-full my-6">
                    <Dropzone onFileUpload={handleFileUpload}></Dropzone>
                </div>
                <div className="uploaded-button flex flex-col items-center">
                <button onClick={handleUploadButtonClick}
                    disabled={uploadedFiles?.length === 0}
                    className="upload-button rounded-full py-3 px-16 bg-black text-white text-xl font-bold disabled:bg-neutral-400">
                        템플릿 선택으로
                </button>
                </div>
        </main>
        </div>
    );
} 