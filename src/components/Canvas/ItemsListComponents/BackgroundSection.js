import { Icon } from "@blueprintjs/core";
import React, { useState, useEffect } from "react";
import { ColorPicker, Saturation, Hue, useColor, Fields } from "react-color-palette";
import "@/app/rcp-fork.css"

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
    const [selectedColor, setSelectedColor] = useState(null);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [color, setColor] = useColor("hex", "#121212");

    const onChangeComplete = (color) => {
        setSelectedColor(color.hex)
        props.handleColorChange(color.hex)
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
                <div>
                    {!isPaletteOpen && !selectedColor && <div className={`h-7 w-7 p-px `} >
                        <div className="h-full w-full grid grid-cols-5 rounded-md overflow-hidden" onClick={() => { setIsPaletteOpen(!isPaletteOpen); setSelectedColor('#cccccc') }}>
                            {rainbowColors.map((color, index) => {
                                return (
                                    <div key={index} className="h-full w-full">
                                        <div className="h-full w-full " style={{ backgroundColor: color }}></div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>}
                    {selectedColor && <div className="h-7 w-7 p-px" onClick={() => setIsPaletteOpen(!isPaletteOpen)}>

                        <div className="h-full w-full rounded-md" style={{ backgroundColor: selectedColor }}>
                        </div>

                    </div>}
                    {isPaletteOpen && <div className="absolute z-10 w-48 h-fit bg-white flex flex-col drop-shadow-md">
                        <div className="flex w-full items-center justify-end">
                            <Icon icon="cross" onClick={() => setIsPaletteOpen(false)} className="p-1 text-gray-400" />
                        </div>
                        <ColorPicker width={192} height={192} color={color} hideAlpha="true" hideInput={["hsv", "rgb"]} onChange={setColor} onChangeComplete={onChangeComplete} hideHSV dark="false" />
                    </div>}
                </div>
            </div>
        </div>
    );
}
