import Image from 'next/image';
import React, { useState, useEffect, useCallback, use } from "react";
import useEyeDropper from 'use-eye-dropper'
import { HexColorPicker, HexColorInput } from "react-colorful";
import "@/app/style.css";
import { Icon } from '@blueprintjs/core';

const colors = [
    "#ffffff", "#111111", "#01be64", "#86C9FE", "#FAFAFA", "#E8EDEF",
    "#ECA09E", "#ECBC80", "#F6DE72", "#C5E8B0", "#9EC9F1", "#D0B7F9",
    "#E26091", "#DF5340", "#F1A934", "#009D48", "#006BE4", "#35169D",
    "#E835A7", "#F86800", "#F7EB50", "#BEFD44", "#8CFBE1", "#A044F9",
]

const rainbowColors = [
    "#E30E0E", "#F95A00", "#FFD02A", "#30C37D", "#52A9EE"
]

export default function BackgroundSection(props) {
    const [selectedColor, setSelectedColor] = useState('');
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const { open, close, isSupported } = useEyeDropper();
    const [error, setError] = useState(null);
    const currentColor = props.currentStageStyle?.bgColor;
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
        props.handleColorChange(color)
        console.log(color)
    }

    return (
        <div className="itemsSection">
            <div className="grid grid-cols-6 justify-center justify-items-center gap-2">
                {colors.map((color, index) => {
                    return (
                        <div key={index} className="h-7 w-7 p-px" onClick={() => props.handleColorChange(color)}>
                            <div className="h-full w-full border rounded-md" style={{ backgroundColor: color }}></div>
                        </div>
                    )
                })}
                <div className=''>
                    {!isPaletteOpen && <div className={`h-7 w-7 p-px `} >
                        <div className="h-full w-full grid grid-cols-5 rounded-md overflow-hidden" onClick={() => { setIsPaletteOpen(!isPaletteOpen);}}>
                            {rainbowColors.map((color, index) => {
                                return (
                                    <div key={index} className="h-full w-full">
                                        <div className="h-full w-full " style={{ backgroundColor: color }}></div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>}
                    {isPaletteOpen && <div className="h-7 w-7 p-px" onClick={() => setIsPaletteOpen(!isPaletteOpen)}>

                        <div className="h-full w-full rounded-md border" style={{ backgroundColor: currentColor }}>
                        </div>

                    </div>}
                    {isPaletteOpen && (props.selectedTools === 0) && <div className="custom-picker absolute z-10 w-48 h-fit bg-white flex flex-col drop-shadow-md">
                        
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
        </div>
    );
}
