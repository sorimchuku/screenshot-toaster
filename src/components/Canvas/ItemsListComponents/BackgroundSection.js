import React from "react";
import items from "../Data/items.json";

export default function BackgroundSection(props) {
    const backgroundsFilteredArray = items.filter(
        (el) => el.elementCategory === "backgrounds"
    );

    return (
        <div className="itemsSection">
            배경 도구
        </div>
    );
}
