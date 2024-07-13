// Template.js
import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import ImageComponent from './ImageComponent';
import Title from './Title';
import { templates } from './Data/templates.js';
import defaultImage from '../../../public/images/screenshot-sample.png';

const Template = ({ templateName, stageIndex, image, stageSize, isEdit }) => {
    const [template, setTemplate] = useState(null);
    const [textNode1, setTextNode1] = useState(null);
    const [textNode2, setTextNode2] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [title, setTitle] = useState('제목 입력');
    const [subTitle, setSubTitle] = useState('소제목을 입력하세요.\n두 줄까지 추가할 수 있어요.');
    const mockup = 'images/iPhone1314.png';
    const scale = stageSize.width / 300;
    const stageRef = useRef();

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
    }, [stageSize]);

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
        <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
            <Layer>
                <Rect
                    x={0}
                    y={0}
                    width={stageSize.width}
                    height={stageSize.height}
                    fill={style.bgColor}
                    cornerRadius={isEdit ? 0 : 10}
                />
                <Rect
                    x={style.x === 'center' ?  ((stageSize.width - scale * style.width) / 2) : style.align === 'right' ? stageSize.width - scale * style.x : scale*style.x}
                    y={scale*style.y}
                    width={style.width ? scale * style.width : scale *  500}
                    height={style.height ? scale * style.width * (aspectRatio) : scale * 500}
                    fill="grey"
                    cornerRadius={style.cornerRadius ? scale * style.cornerRadius : scale * 20}
                    shadowColor='#6E6E6E'
                    shadowBlur={scale * 20}
                    shadowOpacity={0.25}
                    shadowOffset={{ x: 0, y: scale * 20 }}
                    rotation={style.rotation ? style.rotation : 0}
                    
                />
            </Layer>
            <Layer>
                <ImageComponent 
                    image={image ||defaultImage}
                    shapeProps={{
                        x: style.x === 'center' ? ((stageSize.width - scale * style.width) / 2) : style.align === 'right' ? stageSize.width - scale * style.x : scale * style.x,
                        y: scale *style.y,
                        width: scale * style.width ? scale * style.width : scale * 500,
                        height: style.height ? scale * style.width * (aspectRatio) : scale * 500,
                        rotation: style.rotation ? style.rotation : 0
                    }}
                    onDimensionsChange={handleDimensionsChange}
                />
                <Rect globalCompositeOperation='destination-in'
                    x={style.x === 'center' ? ((stageSize.width - scale * style.width) / 2) : style.align === 'right' ? stageSize.width - scale * style.x : scale * style.x}
                    y={scale *style.y}
                    width={style.width ? scale * style.width : scale * 500}
                    height={style.height ? scale * style.width * (aspectRatio) : scale * 500}
                    fill="grey"
                    cornerRadius={style. cornerRadius ? scale * style.cornerRadius : scale * 20}
                    rotation={style.rotation ? style.rotation : 0}
                />
            </Layer>
            <Layer>
                <ImageComponent
                    image={mockup}
                    shapeProps={{
                        x: style.x === 'center' ? ((stageSize.width - scale * style.width) / 2) : style.align === 'right' ? stageSize.width - scale * style.x : scale * style.x,
                        y: scale *style.y,
                        width: style.width ? scale *style.width : scale * 500,
                        height: style.height ? scale * style.width * (aspectRatio) : scale * 500,
                        rotation: style.rotation ? style.rotation : 0
                    }}
                    onDimensionsChange={handleDimensionsChange}
                />
            </Layer>
            <Layer>
                <Title
                    text={title}
                    x={style.titleX === 'center' ? (stageSize.width - scale * style.titleWidth) / 2 : scale * style.titleX}
                    y={scale *style.titleY}
                    fontSize={scale *style.titleSize}
                    width={scale *style.titleWidth}
                    align={style.titleAlign}
                    setNode={setTextNode1}
                    color={style.titleColor}
                    weight={style.titleWeight}
                    isEdit={isEdit}
                />
                <Title
                    text={subTitle}
                    x={style.subTitleX === 'center' ? (stageSize.width - scale * style.subTitleWidth) / 2 : scale *style.subTitleX}
                    y={scale *style.subTitleY}
                    fontSize={scale *style.subTitleSize}
                    width={scale *style.subTitleWidth}
                    align={style.subTitleAlign}
                    setNode={setTextNode2}
                    color={style.subTitleColor}
                    weight={style.subTitleWeight}
                    isEdit={isEdit}
                />
            </Layer>
        </Stage>
    );
};

export default Template;