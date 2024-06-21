// Template.js
import React, { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import ImageComponent from './ImageComponent';
import Title from './Title';
import { templates } from './Data/templates.js';
import defaultImage from '../../../public/images/screenshot-sample.png';

const Template = ({ templateName, stageIndex, image, stageSize }) => {
    const [template, setTemplate] = useState(null);
    const [textNode1, setTextNode1] = useState(null);
    const [textNode2, setTextNode2] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [title, setTitle] = useState('제목 입력...');
    const [subTitle, setSubTitle] = useState('부제목을 입력하세요. 두 줄까지 추가할 수 있어요.');

    const originalHeight = imageDimensions && imageDimensions.height ? imageDimensions.height : 500;
    const originalWidth = imageDimensions && imageDimensions.width ? imageDimensions.width : 500;
    const aspectRatio = originalHeight / originalWidth;

    const handleDimensionsChange = (newDimensions) => {
        if (newDimensions.width !== imageDimensions.width || newDimensions.height !== imageDimensions.height) {
            setImageDimensions(newDimensions);
        }
    };

    useEffect(() => {
        if (textNode1 && textNode1.x !== (stageSize.width - textNode1.width) / 2) {
            textNode1.x((stageSize.width - textNode1.width()) / 2);
        }
        if (textNode2 && textNode2.x !== (stageSize.width - textNode2.width) / 2) {
            textNode2.x((stageSize.width - textNode2.width()) / 2);
        }
    }, [stageSize, textNode1, textNode2]);

    useEffect(() => {
        // Directly use templates from templates.js
        const foundTemplate = templates.find(t => t.name === templateName);
        setTemplate(foundTemplate);
    }, [templateName]);

    if (!template || !template.stages) {
        return null;
    }

    const style = template.stages[stageIndex] || template.stages[template.stages.length - 1];

    return (
        <Stage width={stageSize.width} height={stageSize.height}>
            <Layer>
                <ImageComponent
                    image={image ||defaultImage}
                    shapeProps={{
                        x: style.x === 'center' ? (stageSize.width - style.width) / 2 : style.x,
                        y: style.y,
                        width: style.width ? style.width : 500,
                        height: style.height ? style.width * (aspectRatio) : 500
                    }}
                    onDimensionsChange={handleDimensionsChange}
                />
                <Title
                    text={title}
                    x={style.titleX}
                    y={style.titleY}
                    fontSize={26}
                    width={style.titleWidth}
                    align='center'
                    setNode={setTextNode1}
                />
                <Title
                    text={subTitle}
                    x={style.subTitleX}
                    y={style.subTitleY}
                    fontSize={16}
                    width={style.subTitleWidth}
                    align='center'
                    setNode={setTextNode2}
                />
            </Layer>
        </Stage>
    );
};

export default Template;