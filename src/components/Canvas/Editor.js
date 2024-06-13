import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import SideBar from "./Sidebar";
import ImageComponent from "./ImageComponent";
import { getUserFiles } from "@/firebase";
import { parseCookies } from "nookies";

export default function Editor() {
    // static canvas dimensions used for scaling ratio
    const stageWidth = 360,
        stageHeight = 780;
    // dynamic canvas dimensions
    const [stageDimensions, setStageDimensions] = useState({
        width: stageWidth,
        height: stageHeight,
        scale: 1,
    });

    const [stageSize, setStageSize] = useState(stageDimensions);

    // stageRef is used for handling callbacks - example: getting canvas positions after drag and rop
    const stageRef = useRef();
    // containerRef is used for dynamic canvas scalling
    // main purpose of containerRef is to get width of parent div of canvas stage
    const containerRef = useRef();
    // dragUrl stores temporary src of dragged image
    const [dragUrl, setDragUrl] = useState();
    // images stores images that are added to canvas
    const [images, setImages] = useState([]);
    // selectedId is used for keeping selected image to handle resizes, z-index priority etc.
    const [selectedId, setSelectedId] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);

    // function to handle resize of canvas dimensions based on window width or when sidebar is closed or opened
    const handleResize = () => {
        let sceneWidth = containerRef.current.clientWidth;
        let scale = sceneWidth / stageWidth;
        setStageDimensions({
            width: stageWidth * scale,
            height: stageHeight * scale,
            scale: scale,
        });
    };

    // add eventListener for every window resize to call handleResize function
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize, false);
        return () => window.addEventListener("resize", handleResize, false);
    }, []);

    useEffect(() => {
        const updateStageSize = () => {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            // Calculate the new stage size while maintaining the aspect ratio
            const aspectRatio = stageDimensions.width / stageDimensions.height;
            let newWidth = containerWidth;
            let newHeight = newWidth / aspectRatio;

            if (newHeight > containerHeight) {
                newHeight = containerHeight;
                newWidth = newHeight * aspectRatio;
            }

            setStageSize({ width: newWidth, height: newHeight });
        };

        updateStageSize();
        window.addEventListener('resize', updateStageSize);

        return () => {
            window.removeEventListener('resize', updateStageSize);
        };
    }, [stageDimensions]);

    useEffect(() => {
        const cookies = parseCookies();
        const loadImagesFromFirebase = async () => {
            const userId = cookies.userUid;
            const files = await getUserFiles(userId);
            const images = files.map(file => file.url);
            setUploadedImages(images);
        };
        loadImagesFromFirebase();
    }, []);

    useEffect(() => {
        handleAddImages(uploadedImages[0]);
    }, [uploadedImages]);
    

    // if clicked on empty space of canvas, including backgroundImage perform deselect item
    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        const clikedOnBackground = e.target.getId() === "canvasBackground";
        if (clickedOnEmpty || clikedOnBackground) {
            setSelectedId(null);
        }
    };

    // when element is dragged pass its image src to allow it for adding it to canvas
    const onChangeDragUrl = (dragUrl) => {
        setDragUrl(dragUrl);
    };

    // update image attributes when performing resize
    const handleTransformChange = (newAttrs, i) => {
        let imagesToUpdate = images;
        let singleImageToUpdate = imagesToUpdate[i];
        // update old attributes
        singleImageToUpdate = newAttrs;
        imagesToUpdate[i] = singleImageToUpdate;
        setImages(imagesToUpdate);
    };

    // function to handle adding images on drag and drop to canvas
    const handleOnDrop = (e) => {
        e.preventDefault();
        stageRef.current.setPointersPositions(e);
        setImages(
            images.concat([
                {
                    ...stageRef.current.getPointerPosition(),
                    src: dragUrl,
                },
            ])
        );
    };

    // function to handle adding images on click
    const handleAddOnClick = (src) => {
        let centerX = stageDimensions.width / 2
        let centerY = stageDimensions.height / 2
        setImages(
            images.concat([
                {
                    x: centerX,
                    y: centerY,
                    src: src,
                },
            ])
        );
    }

    const handleAddImages = (src) => {
        const rect = containerRef.current.getBoundingClientRect();

        let img = new Image();
        img.src = src;
        img.onload = () => {
            let imageWidth = img.width;
            let imageHeight = img.height;

            let centerX = (rect.width - imageWidth) / 2;
            let centerY = (rect.height - imageHeight) / 2;

            setImages(
                images.concat([
                    {
                        x: centerX,
                        y: centerY,
                        width: imageWidth,
                        height: imageHeight,
                        src: src,
                    },
                ])
            );
        };
    };

    // function to handle adding background image of canvas
    const addToBackground = (backgroundUrl) => {
        setBackgroundImage(backgroundUrl);
    };

    // function to handle removing background image of canvas
    const removeBackground = () => {
        setBackgroundImage(null)
    };

    // used for passing image id to image attributes
    const passImageWithId = (image, id) => {
        const imageWithId = {
            ...image,
            id: id,
        };
        return imageWithId;
    };

    // when sidebar state changes this function is being called
    const resizeCanvasOnSidebarChange = () => {
        // wait for sidebar animation to complete
        setTimeout(() => {
            handleResize();
        }, 420);
    };

    const zoomIn = () => {
        setStageDimensions(prevState => ({
            ...prevState,
            scale: prevState.scale * 1.1,
        }));
    };

    const zoomOut = () => {
        setStageDimensions(prevState => ({
            ...prevState,
            scale: prevState.scale / 1.1,
        }));
    };

    return (
        <div className="body-container w-full h-full flex relative">
            <SideBar
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                dragUrl={dragUrl}
                onChangeDragUrl={onChangeDragUrl}
                handleAddOnClick={handleAddOnClick}
                addToBackground={addToBackground}
                removeBackground={removeBackground}
                resizeCanvasOnSidebarChange={resizeCanvasOnSidebarChange}
                stageRef={stageRef}
             />
            <div className="workspace-wrap overflow-y-hidden overflow-x-scroll flex flex-grow items-center justify-center">
                <div
                    className="canvasBody overflow-hidden border-2 h-[90%] max-h-[90%] w-auto"
                    ref={containerRef}
                    onDrop={handleOnDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <Stage
                        width={stageSize.width}
                        height={stageSize.height}
                        scaleX={stageDimensions.scale}
                        scaleY={stageDimensions.scale}
                        className="canvasStage bg-white"
                        ref={stageRef}
                        onMouseDown={(e) => {
                            // deselect when clicked on empty area or background image
                            checkDeselect(e);
                        }}
                    >
                        <Layer>
                            {images.map((image, i) => {
                                return (
                                    <ImageComponent
                                        image={image}
                                        shapeProps={passImageWithId(image, `image${i}`)}
                                        id={`image${i}`}
                                        key={i}
                                        isSelected={i === selectedId}
                                        onSelect={() => {
                                            setSelectedId(i);
                                        }}
                                        onChange={(newAttrs) => {
                                            handleTransformChange(newAttrs, i);
                                        }}
                                    />
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    );
}