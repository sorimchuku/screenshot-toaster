import React, { useState, useEffect } from 'react';
import { tools } from './Data/tools';

import BackgroundSection from './ItemsListComponents/BackgroundSection'
import TitleSection from './ItemsListComponents/TitleSection';
import SubTitleSection from './ItemsListComponents/SubTitleSection';
import UploadSection from './ItemsListComponents/UploadSection';
import LayoutSelectSection from './ItemsListComponents/LayoutSelectSection';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

export default function SideBar(props) {
  const { selectedTools, changeSelectedTool } = props;
  const componentsMap = {
    BackgroundSection: BackgroundSection,
    TitleSection: TitleSection,
    SubTitleSection: SubTitleSection,
    UploadSection: UploadSection,
    LayoutSelectSection: LayoutSelectSection,
  };

  const handleImageClick = (imageUrl) => {
    props.updateImageAtIndex(imageUrl, props.activeStage);
  };

  const handleLayoutClick = (layout) => {
    props.updateLayoutAtIndex(layout, props.activeStage);
  }

  const handleColorChange = (color) => {
    props.changeStageColor(color, props.activeStage);
  }

  const handleToggleTitle = (e, toolId) => {
    const { checked } = e.target;
    props.toggleTitleSubtitle(toolId, checked);
  };

  const handleTextColorChange = (toolId, color) => {
    props.changeTextColor(toolId, color, props.activeStage);
  }

  const handleTextPositionChange = (toolId, position) => {
    props.changeTextPosition(toolId, position, props.activeStage);
  }

  const handleFontChange = (toolId, font) => {
    props.changeTextFont(toolId, font, props.activeStage);
  }

  const handleTextSizeChange = (toolId, size) => {
    props.changeTextSize(toolId, size, props.activeStage);
  }

  const handleTextWeightChange = (toolId, weight) => {
    props.changeTextWeight(toolId, weight, props.activeStage);
  }

  const handleTextAlignmentChange = (toolId, alignment) => {
    props.changeTextAlignment(toolId, alignment, props.activeStage);
  }


  return (
    <div className="sidebar-wrap w-[340px] min-w-[340px] h-full z-[1] bg-neutral-100 border-r-2 relative">
      <div className="itemsListBody h-fit w-full flex flex-col px-8 py-6 gap-6 absolute">
        <div onClick={props.handleAddPage}
          className='addpage cursor-pointer flex px-6 py-3 bg-white rounded-full justify-center items-center gap-2 font-bold text-neutral-500 text-base'>
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
                  <div className='flex items-center'>
                    <span>{tool.title}</span>
                    {(tool.id === 2 || tool.id === 3) &&
                      <input type="checkbox" className="text-switch ml-3" checked={
                        tool.id === 2 ? props.currentStageStyle?.title ?? true : props.currentStageStyle?.subTitle ?? true
                      } onClick={(e) => {
                        e.stopPropagation();
                      }}
                        onChange={(e) => handleToggleTitle(e, tool.id)} />}

                  </div>
                  <Icon className='text-gray-300' icon={selectedTools === i ? IconNames.CARET_DOWN : IconNames.CARET_RIGHT} />
                </div>
                <div className={`tools-inner transition-all ease-in-out duration-300 overflow-hidden
                                    ${selectedTools === i ? 'max-h-screen mt-4' : 'max-h-0'}`}>
                  {React.createElement(componentsMap[tool.component], {
                    onChangeDragUrl: props.onChangeDragUrl,
                    handleImageClick: handleImageClick,
                    handleLayoutClick: handleLayoutClick,
                    handleColorChange: handleColorChange,
                    handleTextColorChange: handleTextColorChange,
                    handleTextPositionChange: handleTextPositionChange,
                    handleFontChange: handleFontChange,
                    handleTextSizeChange: handleTextSizeChange,
                    handleTextWeightChange: handleTextWeightChange,
                    handleTextAlignmentChange: handleTextAlignmentChange,
                    dragUrl: props.dragUrl,
                    addToBackground: props.addToBackground,
                    removeBackground: props.removeBackground,
                    stageRef: props.stageRef,
                    uploadedImages: props.uploadedImages,
                    setUploadedImages: props.setUploadedImages,
                    activeStage: props.activeStage,
                    style: { display: selectedTools === i ? 'block' : 'none' },
                    selectedTools: selectedTools,
                    currentStageStyle: props.currentStageStyle,
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