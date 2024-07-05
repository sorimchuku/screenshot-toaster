import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getUserImagesFour } from '../firebase';
import { parseCookies } from "nookies";
import Template from './Canvas/Template';
import { useGlobalContext } from './context/GlobalContext';


export default function SelectTemplate() {
    const templates = ['template1', 'template2', 'template3', 'template4'];
    const [stageSize, setStageSize] = useState({ width: 120, height: 200 });
    const stageScale = 1;
    const { setTemplateName } = useGlobalContext();
    const sampleImages = ['images/screenshot-sample.png', 'images/screenshot-sample2.png', 'images/screenshot-sample3.png', 'images/screenshot-sample4.png'];
    const router = useRouter();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const cookies = parseCookies();
            const userId = cookies.userUid;
            const userImages = await getUserImagesFour(userId);
            const imageUrls = userImages.map(file => file.url);
            if (imageUrls.length < 4) {
                const placeholders = sampleImages.slice(0, 4 - imageUrls.length);
                setImages([...imageUrls, ...placeholders]);
            } else {
               setImages(imageUrls); 
            } 
        };

        fetchImages();

        
    }, []);

    useEffect(() => {
        const updateStageSize = () => {
            const width = window.innerWidth * 0.09;
            const height = window.innerHeight * 0.29;
            setStageSize({ width, height });
        }
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, []);

    const handleTemplateClick = (template) => {
        setTemplateName(template);
        localStorage.setItem('initialized', false);
        router.push({
            pathname: `/editor`,
    });
    }

    return (
        <div className="body-container">
            <main className="p-10 px-36 flex flex-col gap-4 h-full">
                <div className='flex-shrink'>
                    <div className="text-4xl font-bold text-center">템플릿 선택하기</div>
                    <div className="text-lg text-center mt-4">색, 폰트, 순서는 이 다음에 변경 가능해요.</div>
                </div>
                <div className='template-container flex flex-wrap flex-grow flex-shrink-0 basis-auto'>
                    {templates.map((template, index) => (
                        <div key={index} className="template-box flex w-1/2">
                            <div onClick={() => handleTemplateClick(template)}
                                className='template-inner flex items-center w-full justify-center border-2 border-neutral-300 rounded-xl m-3 hover:border-blue-500'>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index}
                                        className={`stage-wrap rounded-xl px-1 py-2`}>
                                        <Template templateName={template} stageSize={stageSize} stageScale={stageScale} stageIndex={index} image={images[index]} isEdit={false} />
                                    </div>
                                ))}
                            </div>

                        </div>


                    ))}
                </div>

            </main>
        </div>
    );
}