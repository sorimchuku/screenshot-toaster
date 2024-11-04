import Image from 'next/image';
import React, { useState, useEffect, useCallback, use } from "react";
import useEyeDropper from 'use-eye-dropper'
import { HexColorPicker, HexColorInput } from "react-colorful";
import "@/app/style.css";
import { Icon } from '@blueprintjs/core';

const fonts = ['Pretendard', 'Dongle', 'Noto Sans KR', 'Noto Serif KR', 'Black Han Sans', 'Bagel Fat One', 'Nanum Pen Script'];

export default function TitleSection(props) {
    const [selectedColor, setSelectedColor] = useState('');
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const { open, close, isSupported } = useEyeDropper();
    const [error, setError] = useState(null);
    const currentColor = props.selectedTools === 2 ? props.currentStageStyle?.titleColor : props.selectedTools === 3 ? props.currentStageStyle?.subTitleColor : '';
    const currentPos = props.selectedTools === 2 ? props.currentStageStyle?.titlePosition : props.selectedTools === 3 ? props.currentStageStyle?.subTitlePosition : {};
    const currentFont = props.selectedTools === 2 ? props.currentStageStyle?.titleFont ?? 'Pretendard' : props.selectedTools === 3 ? props.currentStageStyle?.subTitleFont ?? 'Pretendard' : '';
    const currentFontSize = props.selectedTools === 2 ? props.currentStageStyle?.titleSize : props.selectedTools === 3 ? props.currentStageStyle?.subTitleSize : '';
    const currentWeight = props.selectedTools === 2 ? props.currentStageStyle?.titleWeight : props.selectedTools === 3 ? props.currentStageStyle?.subTitleWeight : '';

    const currentAlign = props.selectedTools === 2 ? props.currentStageStyle?.titleAlign : props.selectedTools === 3 ? props.currentStageStyle?.subTitleAlign : '';



    // useEyeDropper will reject/cleanup the open() promise on unmount,
    // so setState never fires when the component is unmounted.
    const pickColor = useCallback(() => {
        // Using async/await (can be used as a promise as-well)
        const openPicker = async () => {
            try {
                const color = await open()
                onColorChange(color.sRGBHex)
            } catch (e) {
                console.log(e)
                // Ensures component is still mounted
                // before calling setState
                if (!e.canceled) setError(e)
            }
        }
        openPicker()
    }, [open, selectedColor, props.handleColorChange]);

    useEffect(() => {
        setIsPaletteOpen(false)
    }, [props.selectedTools])

    const onColorChange = (color) => {
        setSelectedColor(color)
        props.handleTextColorChange(props.selectedTools, color)
        console.log(color)
    }

    const onPositionChange = (e, axis) => {
        const value = e.target.value;
        const position = { ...currentPos, [axis]: value };
        props.handleTextPositionChange(props.selectedTools, position);
    }

    const onFontChange = (e) => {
        const value = e.target.value;
        props.handleFontChange(props.selectedTools, value);
    }

    const onAlignmentChange = (value) => {
        props.handleTextAlignmentChange(props.selectedTools, value);
    };


    return (
        <div className='flex flex-col gap-4'>
            <div>
                <div className='text-lg font-bold'>텍스트</div>
                <div className='my-2 flex flex-col gap-3'>
                    <div className='flex gap-2'>
                        <select className='w-full border-b-2 focus:outline-none' value={currentFont} onChange={onFontChange}>
                            {fonts.map((font, index) => {
                                return <option key={index} value={font}>{font}</option>
                            })}
                        </select>
                        <input type='number' value={currentFontSize} onChange={(e) => props.handleTextSizeChange(props.selectedTools, e.target.value)} className='w-16 border-b-2 focus:outline-none'></input>
                    </div>
                    <div className='flex gap-2'>
                        <select className='w-full border-b-2 focus:outline-none' value={currentWeight}
                            onChange={(e) => props.handleTextWeightChange(props.selectedTools, e.target.value)}>
                            <option key={'Normal'} value='normal'>Normal</option>
                            <option key={'Bold'} value='bold'>Bold</option>
                        </select>
                        <div className='flex flex-nowrap gap-1'>
                            <button onClick={() => onAlignmentChange('left')} className={`text-base font-bold ${currentAlign === 'left' ? 'bg-gray-200' : ''} rounded-md p-1`}>
                                <Icon icon="align-left" className=''></Icon>
                            </button>
                            <button onClick={() => onAlignmentChange('center')} className={`text-base font-bold ${currentAlign === 'center' ? 'bg-gray-200' : ''} rounded-md p-1`}>
                                <Icon icon="align-center" className=''></Icon>
                            </button>
                            <button onClick={() => onAlignmentChange('right')} className={`text-base font-bold ${currentAlign === 'right' ? 'bg-gray-200' : ''} rounded-md p-1`}>
                                <Icon icon="align-right" className=''></Icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='text-lg font-bold'>색상</div>
                <div className='my-2'>
                    <div className='flex items-center gap-2'>
                        <div className="h-7 w-7 p-px" onClick={() => setIsPaletteOpen(!isPaletteOpen)}>

                            <div className="h-full w-full rounded-md border" style={{ backgroundColor: currentColor }}>
                            </div>

                        </div>
                        <span className='text-gray-600 text-base uppercase'>{currentColor}</span>
                        <button className="border-2 px-2 rounded-full  text-gray-500" onClick={() => props.handleAllTextColorChange(props.selectedTools, currentColor)}>전체 적용</button>
                    </div>
                    {isPaletteOpen && <div className="custom-picker absolute z-10 w-48 h-fit bg-white flex flex-col drop-shadow-md">

                        <div className="flex w-full items-center justify-end">
                            <Icon icon="cross" onClick={() => setIsPaletteOpen(false)} className="p-1 text-gray-400" />
                        </div>
                        <HexColorPicker color={currentColor} onChange={onColorChange} />
                        <div className='flex w-full px-4 pb-4 gap-2 justify-end'>
                            {isSupported() &&
                                <button onClick={pickColor}>
                                    <Image src="/images/bxs--eyedropper.svg" alt="eyedropper" width={20} height={20} />
                                </button>
                            }
                            <HexColorInput color={currentColor} onChange={onColorChange} prefixed className='bg-gray-200 w-32 rounded px-4 text-center text-gray-800 uppercase' />
                        </div>
                    </div>}

                </div>
            </div>
            <div>
                <div className='text-lg font-bold'>위치</div>
                <div className='my-2 flex flex-col justify-start gap-3'>
                    <label className='flex flex-grow font-bold'>X
                    <input type='number' value={currentPos.x} onChange={(e) => onPositionChange(e, 'x')} className='font-normal w-8 border-b-2  mx-4 focus:outline-none' min={0} max={100} onInput={(e) => {
                            if (e.target.value > 100) {
                                e.target.value = 100;
                            }
                            if (e.target.value < 0) {
                                e.target.value = 0;
                            }
                    }}></input>
                        <input type='range' min={0} max={100} className='font-normal w-full focus:outline-none' value={currentPos.x} onChange={(e) => onPositionChange(e, 'x')}></input>
                    </label>
                    <label className='flex flex-grow font-bold'>Y
                        <input type='number' value={currentPos.y} onChange={(e) => onPositionChange(e, 'y')} className='font-normal w-8 border-b-2  mx-4 focus:outline-none' min={0} max={600} onInput={(e) => {
                            if (e.target.value > 600) {
                                e.target.value = 600;
                            }
                            if (e.target.value < 0) {
                                e.target.value = 0;
                            }
                        }}></input>
                        <input type='range' min={0} max={600} className='font-normal w-full  focus:outline-none' value={currentPos.y} onChange={(e) => onPositionChange(e, 'y')}></input>
                    </label>
                </div>
            </div>
        </div>
    );
}