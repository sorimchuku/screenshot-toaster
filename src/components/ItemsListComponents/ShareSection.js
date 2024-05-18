import React from "react";
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core';

function ShareSection(props) {
    // function that creates hyperlink with canvas DataURL as href
    // programically clicks it to download the image
    // after download hyperlink is being removed from DOM
    const handleExport = () => {
        const uri = props.stageRef.current.toDataURL();
        const link = document.createElement("a");
        console.log(uri);
        console.log(link);
        link.download = "moodboard-export.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="itemsSection">
            <div className="shareSectionWrap">
                <button onClick={handleExport} className="downloadImage">
                    <Icon icon={IconNames.DOWNLOAD} />
                    Export canvas as image
                </button>
            </div>
        </div>
    );
}

export default ShareSection;