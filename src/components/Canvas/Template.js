// Template.js
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import ImageComponent from './ImageComponent';
import Title from './Title';
import { templates } from './Data/templates.js';

const Template = React.forwardRef(({ templateName, stageIndex, image, stageSize, isEdit, style, device, changeSelectedTool }, ref) => {
    const [template, setTemplate] = useState(null);
    const [textNode1, setTextNode1] = useState(null);
    const [textNode2, setTextNode2] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [title, setTitle] = useState('제목 입력');
    const [subTitle, setSubTitle] = useState('소제목을 입력하세요.\n두 줄 이상 입력할 수 있어요.');
    const mockup = {
        0: 'images/mockup_9_19-5.png',
        1: 'images/mockup_9_19-5.png',
        2: 'images/mockup_9_16.png',
        3: 'images/mockup_9_16_and.png',
        4: 'images/mockup_9_19-5_and.png',
    }
    const scale = stageSize.width / 300;
    const stageRef = useRef();

    const defaultImage = 'images/screenshot-sample.png';

    useImperativeHandle(ref, () => ({
        toDataURL: (options) => {
            if (stageRef.current) {
                return stageRef.current.toDataURL(options);
            }
        },
        width: () => stageRef.current.width(),
        setSize: (width, height) => {
            if (stageRef.current) {
                stageRef.current.width(width);
                stageRef.current.height(height);
            }
        },
        redraw: () => {
            if (stageRef.current) {
                console.log(stageRef.current.device);
                stageRef.current.draw();
            }
        },
    }));

    useEffect(() => {
        if (stageRef.current) {
            stageRef.current.width(stageSize.width);
            stageRef.current.height(stageSize.height);
            stageRef.current.draw();
        }
    }, [stageSize, device]);

    const originalHeight = imageDimensions.height || 16;
    const originalWidth = imageDimensions.width || 9;
    const imageRatio = originalHeight / originalWidth;

    const aspectRatio = 1 / style?.ratio;
    
    const handleDimensionsChange = (newDimensions) => {
        if (newDimensions.width !== imageDimensions.width || newDimensions.height !== imageDimensions.height) {
            setImageDimensions(newDimensions);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('webfontloader').then(WebFont => {
                WebFont.load({
                    google: {
                        families: ['Pretendard', 'Dongle', 'Noto Sans KR', 'Noto Serif KR', 'Black Han Sans', 'Bagel Fat One', 'Nanum Pen Script'],
                    },
                });
            });

        }
    }, []);

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

    useEffect(() => {
        if (ref) {
            ref.current = stageRef.current;
        }
    }, [ref]);

    if (!template || !template.stages) {
        return null;
    }



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
                    height={style.width ? scale * style.width * (aspectRatio) : scale * 500 * aspectRatio}
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
                    image={image?.url ||defaultImage}
                    shapeProps={{
                        x: style.x === 'center' ? ((stageSize.width - scale *  (style.width - 6)) / 2) : style.align === 'right' ? stageSize.width - scale * (style.x - 3) : scale * (style.x + 3),
                        y: scale * (style.y + 3),
                        width: scale * style.width ? scale * (style.width - 6) : scale * (500 - 6),
                        height: style.width ? (scale * (style.width * (imageRatio) - 6)) : (scale * (500 * imageRatio - 6)),
                        rotation: style.rotation ? style.rotation : 0,
                    }}
                    onDimensionsChange={handleDimensionsChange}
                />
                <Rect globalCompositeOperation='destination-in'
                    x={style.x === 'center' ? ((stageSize.width - scale * style.width) / 2) : style.align === 'right' ? stageSize.width - scale * style.x : scale * style.x}
                    y={scale *style.y}
                    width={style.width ? scale * style.width : scale * 500}
                    height={style.width ? scale * (style.width * aspectRatio - 2) : scale * (500 * aspectRatio - 2)}
                    fill="grey"
                    cornerRadius={style. cornerRadius ? scale * style.cornerRadius : scale * 20}
                    rotation={style.rotation ? style.rotation : 0}
                />
            </Layer>
            <Layer>
                <ImageComponent
                    image={mockup[device] || mockup[0]}
                    shapeProps={{
                        x: style.x === 'center' ? ((stageSize.width - scale * style.width) / 2) : style.align === 'right' ? stageSize.width - scale * style.x : scale * style.x,
                        y: scale *style.y,
                        width: style.width ? scale *style.width : scale * 500,
                        height: style.width ? scale * style.width * (aspectRatio) : scale * 500 * aspectRatio,
                        rotation: style.rotation ? style.rotation : 0
                    }}
                    onDimensionsChange={() => {}}
                />
            </Layer>
            <Layer>
                {style.title !== false && <Title
                    changeSelectedTool={changeSelectedTool} toolId={2}
                    text={title}
                    x={style.titlePosition.x === 'center' ? (stageSize.width - scale * style.titleWidth) / 2 : scale * style.titlePosition.x}
                    y={style.textAlignY === 'bottom' ? (stageSize.height - scale * style.titleSize) - scale *style.titlePosition.y
                         : scale *style.titlePosition.y}
                    fontSize={scale *style.titleSize}
                    width={scale *style.titleWidth}
                    align={style.titleAlign}
                    setNode={setTextNode1}
                    color={style.titleColor}
                    weight={style.titleWeight}
                    isEdit={isEdit}
                    fontFamily={style.titleFont ?? 'Pretendard'}
                /> }
                {style.subTitle !== false && <Title
                changeSelectedTool={changeSelectedTool} toolId={3}
                    text={subTitle}
                    x={style.subTitlePosition.x === 'center' ? (stageSize.width - scale * style.subTitleWidth) / 2 : scale *style.subTitlePosition.x}
                    y={style.textAlignY === 'bottom' ? (stageSize.height - scale * style.subTitleSize) - scale *style.subTitlePosition.y
                        : scale *style.subTitlePosition.y}
                    fontSize={scale *style.subTitleSize}
                    width={scale *style.subTitleWidth}
                    align={style.subTitleAlign}
                    setNode={setTextNode2}
                    color={style.subTitleColor}
                    weight={style.subTitleWeight}
                    isEdit={isEdit}
                    fontFamily={style.subTitleFont ?? 'Pretendard'}
                /> }
            </Layer>
        </Stage>
    );
});
Template.displayName = 'Template';
export default Template;