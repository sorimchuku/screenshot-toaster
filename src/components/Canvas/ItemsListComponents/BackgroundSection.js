import { Icon } from "@blueprintjs/core";
import React, { useState, useEffect } from "react";
import { ColorPicker, Saturation, Hue, useColor, Fields } from "react-color-palette";
import "react-color-palette/css";

const colors = [
    "#E30E0E", "#F95A00", "#FFD02A", "#A7D002", "#30C37D", "#1874FF",
    "#931010", "#8B3C03", "#7E6817", "#63741D", "#0B6E3F", "#520EE3",
    "#FED6CD", "#FFE1D0", "#FFEA", "#E5F392", "#D0F6B9", "#C1ECFA"
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
                            <div className="h-full w-full rounded-md" style={{ backgroundColor: color }}></div>
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
                    {isPaletteOpen && <div className="absolute z-10 w-48 h-fit bg-white flex flex-col shadow">
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
