import React from 'react';
import { useRouter } from 'next/router';

export default function SelectTemplate() {
    const templates = ['template1', 'template2', 'template3', 'template4'];
    const router = useRouter();

    const handleTemplateClick = (template) => {
        router.push(`/editor`);
    }

    return (
        <div className="h-screen">
            <main className="max-h-screen p-12 px-36 flex flex-col h-full">
                <div>
                    <div className="text-4xl font-bold text-center">템플릿 선택하기</div>
                    <div className="text-lg text-center mt-4">색, 폰트, 순서는 이 다음에 변경 가능해요.</div>
                </div>
                <div className='template-container max-h-screen h-full flex flex-wrap flex-grow flex-shrink-0 basis-auto py-8'>
                        {templates.map((template, index) => (
                            <div key={index} className="template-box flex w-1/2">
                            <div onClick={() => handleTemplateClick(template)}
                            className='template-inner flex items-center w-full justify-center border-2 border-neutral-300 rounded-xl m-3 hover:border-blue-500'>
                                    <div className="text-4xl font-bold text-center">{template}</div>
                            </div>
                           
                            </div>
                        
                                
                        ))}
                    </div>

            </main>
        </div>
    );
}