import React, { useState } from 'react';
import { templates } from '../Data/templates';
import Template from '../Template';
import { Icon } from '@blueprintjs/core';


export default function LayoutSelectSection(props) {
  const [stageSize, setStageSize] = useState({ width: 50, height: 90 });
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 4;
  const sampleImage = 'images/screenshot-sample.png';

  const extractStagesInfo = (templates) => {
    const stagesInfo = templates.flatMap(template =>
      template.stages.map((stage, index) => ({
        templateName: template.name,
        index: index,
        style: stage,
      }))

    );
    return stagesInfo;
  };

  const stagesInfo = extractStagesInfo(templates);
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = stagesInfo.slice(indexOfFirstTemplate, indexOfLastTemplate);

  // 페이지네이션 핸들러
  const nextPage = () => setCurrentPage(prev => prev + 1 > Math.ceil(stagesInfo.length / templatesPerPage) ? Math.ceil(stagesInfo.length / templatesPerPage) : prev + 1);
  const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className='flex flex-col gap-3'>
      <div className={`grid grid-cols-4 items-center w-full h-fit`}>
        {currentTemplates.map((template, index) => {
          return (
            <div key={'sample' + index} onClick={() => props.handleLayoutClick(template)} onTouchStart={() => props.handleLayoutClick(template)}
              className={`stage-wrap rounded transition-all hover:brightness-50`}>
              <Template templateName={template.templateName} stageSize={stageSize} stageScale={1} stageIndex={template.index} image={sampleImage} isEdit={false} style={template.style} />
            </div>
          )
        })}
      </div>
      <div className="pagination-controls flex self-center gap-3">
        <button onClick={prevPage}>
          <Icon icon="chevron-left" className={`${currentPage === 1 ? 'text-gray-300' : ''}`} />
        </button>
        <span>{currentPage} / {templatesPerPage}</span>
        <button onClick={nextPage}>
          <Icon icon="chevron-right" className={`${currentPage === Math.ceil(stagesInfo.length / templatesPerPage) ? 'text-gray-300' : ''}`} />
        </button>
      </div>
    </div>
  );
}