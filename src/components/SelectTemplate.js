import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getUserImagesFour, getUserId } from '../firebase';
import Template from './Canvas/Template';
import { useGlobalContext } from './context/GlobalContext';
import { templates as templatesData } from './Canvas/Data/templates.js';


export default function SelectTemplate() {
    const templates = ['template1', 'template2', 'template3', 'template4'];
    const [stageSize, setStageSize] = useState({ width: 120, height: 200 });
    const [selectedTemplate, setSelectedTemplate] = useState('template1');
    const stageScale = 1;
    const { setTemplateName } = useGlobalContext();
    const sampleImages = ['images/screenshot-sample.png', 'images/screenshot-sample2.png', 'images/screenshot-sample3.png', 'images/screenshot-sample4.png'];
    const router = useRouter();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const userId = await getUserId();
            const userImages = await getUserImagesFour(userId);
            if (userImages.length < 4) {
                const placeholders = sampleImages.slice(0, 4 - userImages.length);
                setImages([...userImages, ...placeholders]);
            } else {
                setImages(userImages);
            }
        };

        fetchImages();

        
    }, []);

    useEffect(() => {
        const updateStageSize = () => {
            const ratio = stageSize.width / stageSize.height;
            let width;
            if(window.innerWidth < 1440) {
                width = window.innerWidth * 0.088;
            } else {
            width = window.innerWidth * 0.09;
            }
            const height = width / ratio;
            setStageSize({ width, height });
        }
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, []);

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setTemplateName(template);
        console.log(template);
    };
    

    const handleGoClick = () => {
        localStorage.setItem('initialized', false);
        router.push({
            pathname: `/editor`,
        });
    }

    return (
        <div className="body-container">
            <main className="py-8 px-36 flex flex-col gap-3 h-full ">
                <div className='flex justify-between items-center'>
                    <div className='flex-shrink flex flex-col items-start'>
                        <div className="text-4xl font-bold text-center">템플릿 선택하기</div>
                        <div className="text-lg text-center mt-4">색, 폰트, 순서는 이 다음에 변경 가능해요.</div>
                    </div>
                    <div onClick={() => handleGoClick()}
                    className='flex cursor-pointer bg-black px-8 py-2 h-fit rounded-full text-lg text-white items-center justify-center'>선택 완료</div>
                </div>
                
                <div className='template-container grid grid-cols-2 w-full items-center gap-2 flex-grow flex-shrink-0 basis-auto'>
                    {templates.map((template, index) => {
                        const templateData = templatesData.find(t => t.name === template);
                        return (
                            <div key={index} onClick={() => handleTemplateClick(template)} onTouchStart={() => handleTemplateClick(template)} className="template-box flex w-full h-full items-center justify-center">
                            <div
                                className={`template-inner flex items-center w-fit h-fit justify-center border-2 rounded-xl p-2 gap-2 ${template === selectedTemplate ? ' border-sky-400 ' : 'border-gray-300' }`}>
                                {Array.from({ length: 4 }).map((_, innerIndex) => {

                                    const isTwins = templateData.stages[innerIndex]?.twins !== undefined ? templateData.stages[innerIndex].twins : false;
                                    const imageIndex = isTwins ? 0 : innerIndex;
                                    const style = templateData.stages[innerIndex] || templateData.stages[templateData.stages.length - 1];
                                    return(
                                        <div key={innerIndex} 
                                        className={`stage-wrap rounded ${template === selectedTemplate ? 'grayscale-0' : 'grayscale'}`}>
                                        <Template  templateName={template} stageSize={stageSize} stageScale={stageScale} stageIndex={innerIndex} image={images[imageIndex]} alt={`Screenshot ${imageIndex + 1}`} isEdit={false} style={style} />
                                    </div>
                                    )
                                    
                                })}
                            </div>

                        </div>
                        )


                    })}
                </div>

            </main>
        </div>
    );
}