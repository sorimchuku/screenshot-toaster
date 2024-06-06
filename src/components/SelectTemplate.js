import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';


export default function SelectTemplate() {
    const templates = ['template1', 'template2', 'template3', 'template4'];
    const router = useRouter();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const storedImages = localStorage.getItem('images');
        if (storedImages) {
            setImages(JSON.parse(storedImages));
        } else if (router.query.images) {
            setImages(JSON.parse(router.query.images));
            localStorage.setItem('images', router.query.images);
        }

        if (router.query.images) {
            setImages(JSON.parse(router.query.images));
            localStorage.setItem('images', router.query.images);
        }
    }, [router.query]);

    const handleTemplateClick = (template) => {
        router.push(`/editor`);
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
                                    {images.map((image, index) => (
                                        <div key={index} className="">
                                            <div className='flex my-auto'>
                                                <Image
                                                    src={image.url}
                                                    alt={image.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover mx-auto max-h-48 w-auto px-2"
                                                />
                                            </div>
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