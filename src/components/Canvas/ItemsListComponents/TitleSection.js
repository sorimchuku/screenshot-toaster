import Image from 'next/image';
import React, { useState, useEffect, useCallback, use } from "react";
import useEyeDropper from 'use-eye-dropper'
import { HexColorPicker, HexColorInput } from "react-colorful";
import "@/app/style.css";
import { Icon } from '@blueprintjs/core';

const rainbowColors = [
    "#E30E0E", "#F95A00", "#FFD02A", "#30C37D", "#52A9EE"
]

export default function TitleSection(props) {
    const [selectedColor, setSelectedColor] = useState('');
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const { open, close, isSupported } = useEyeDropper();
    const [error, setError] = useState(null);
    const currentColor = props.selectedTools === 2 ? props.currentStageStyle?.titleColor : props.selectedTools === 3 ? props.currentStageStyle?.subTitleColor : '';
    const currentPos = props.selectedTools === 2 ? props.currentStageStyle?.titlePosition : props.selectedTools === 3 ? props.currentStageStyle?.subTitlePosition : {};
    

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

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <div className='text-lg font-bold'>텍스트</div>
            </div>
            <div>
                <div className='text-lg font-bold'>색상</div>
                <div className='my-2'>
                    <div className='flex items-center gap-2'>
                    <div className="h-7 w-7 p-px" onClick={() => setIsPaletteOpen(!isPaletteOpen)}>

                            <div className="h-full w-full rounded-md" style={{ backgroundColor: currentColor }}>
                            </div>

                        </div>
                        <span className='text-gray-600 text-base uppercase'>{currentColor}</span>
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
                <div className='my-2 flex justify-between gap-3'>
                        <label className='flex flex-grow font-bold'>X
                            <input type='number' className='font-normal w-full border-b-2 mx-4 focus:outline-none' value={currentPos.x} onChange={(e) => onPositionChange(e, 'x')}></input>
                        </label>
                        <label className='flex flex-grow font-bold'>Y
                            <input type='number' className='font-normal w-full border-b-2 mx-4 focus:outline-none' value={currentPos.y} onChange={(e) => onPositionChange(e, 'y')}></input>
                        </label>
                </div>
            </div>
        </div>
    );
}