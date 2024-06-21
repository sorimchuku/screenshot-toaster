import React, { useState, useEffect } from 'react';
import { tools } from './Data/tools';

import BackgroundSection from './ItemsListComponents/BackgroundSection'
import TitleSection from './ItemsListComponents/TitleSection';
import SubTitleSection from './ItemsListComponents/SubTitleSection';
import UploadSection from './ItemsListComponents/UploadSection';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

export default function SideBar(props) {
    const [selectedTools, setSelectedTools] = useState(null);
    // componentsMap keys must be same with components key value in /Data/tools.js
    const componentsMap = {
        BackgroundSection: BackgroundSection,
        TitleSection: TitleSection,
        SubTitleSection: SubTitleSection,
        UploadSection: UploadSection,
    };

    const changeSelectedTool = (id) => {
        if(selectedTools === id) {
            setSelectedTools(null);
        } else {
        setSelectedTools(id);
        }
    }

    return (
        <div className="sidebar-wrap w-[340px] h-full z-[1] overflow-hidden bg-neutral-100 border-r-2">
            {/* <div className="expandButton" onClick={() => openMenuOnClick()}><ExpandLessRoundedIcon /></div> */}
            <div className="itemsListBody overflow-hidden h-full w-full flex flex-col px-8 py-6 gap-6">
                <div onClick={() => {props.handleAddPage}}
                className='addpage cursor-pointer flex px-6 py-4 bg-white rounded-full justify-center items-center gap-2 font-bold text-neutral-500 text-base'>
                    <Icon icon={IconNames.PLUS} />
                    <span>페이지 추가</span>
                </div>
                <div className="toolsItemsWrap flex flex-col justify-center gap-4">
                    {tools.map((tool, i) => (
                        <div
                            className="toolsItem flex flex-wrap px-6 py-4 bg-white rounded-xl"
                            key={i}
                        >
                            <div className="toolsItemContent flex flex-col grow">
                                <div onClick={() => {
                                    changeSelectedTool(i)
                                }}
                                 className="tools-title-wrap cursor-pointer flex justify-between items-center font-bold text-xl">
                                    <div className='flex items-center gap-2'>
                                        <div className='w-5 h-5 bg-sky-100 rounded'></div>
                                        <span>{tool.title}</span>
                                    </div>
                                    <Icon icon={selectedTools === i ? IconNames.CARET_DOWN : IconNames.CARET_RIGHT} />
                                </div>
                                <div className={`tools-inner transition-all ease-in-out duration-300 overflow-hidden
                                 ${selectedTools === i ? 'max-h-screen mt-4' : 'max-h-0'}`}>
                                    {React.createElement(componentsMap[tool.component], {
                                        onChangeDragUrl: props.onChangeDragUrl,
                                        handleAddOnClick: props.handleAddOnClick,
                                        dragUrl: props.dragUrl,
                                        addToBackground: props.addToBackground,
                                        removeBackground: props.removeBackground,
                                        stageRef: props.stageRef,
                                        uploadedImages : props.uploadedImages,
                                        setUploadedImages : props.setUploadedImages, 
                                        style: { display: selectedTools === i ? 'block' : 'none' },
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}