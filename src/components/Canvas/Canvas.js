import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import ItemsList from "./ItemsList";
import ImageComponent from "./ImageComponent";
import CanvasBackground from "./CanvasBackground";
import { getUserFiles } from "../../firebase";
import { Spinner } from "@blueprintjs/core";
import "../../Styles/canvas.css";

function Canvas() {
  const stageWidth = 900,
    stageHeight = 600;
  const [stageDimensions, setStageDimensions] = useState({
    width: stageWidth,
    height: stageHeight,
    scale: 1
  });
  const stageRef = useRef();
  const containerRef = useRef();
  const [dragUrl, setDragUrl] = useState();
  const [images, setImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 이미지 로딩 상태를 관리하는 상태를 추가합니다.

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true); // 이미지 로딩을 시작합니다.
      const storedFiles = await getUserFiles();
      if (storedFiles && storedFiles.length > 0) {
        const firstImage = storedFiles[0];
        setImages((prevState) => [...prevState, {
          id: `image${prevState.length}`,
          x: stageWidth / 2,
          y: stageHeight / 2,
          src: firstImage.url,
        }]);
      }
      setIsLoading(false); // 이미지 로딩을 완료합니다.
    };

    fetchFiles();
  }, []);

  const handleResize = () => {
    let sceneWidth = containerRef.current.clientWidth;
    let scale = sceneWidth / stageWidth;
    setStageDimensions({
      width: stageWidth * scale,
      height: stageHeight * scale,
      scale: scale,
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, false);
    return () => window.addEventListener("resize", handleResize, false);
  }, []);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnBackground = e.target.getId() === "canvasBackground";
    if (clickedOnEmpty || clickedOnBackground) {
      setSelectedId(null);
    }
  };

  const onChangeDragUrl = (dragUrl) => {
    setDragUrl(dragUrl);
  };

  const handleTransformChange = (newAttrs, i) => {
    let imagesToUpdate = images;
    let singleImageToUpdate = imagesToUpdate[i];
    singleImageToUpdate = newAttrs;
    imagesToUpdate[i] = singleImageToUpdate;
    setImages(imagesToUpdate);
  };

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

  const handleAddOnClick = (src) => {
    let centerX = stageDimensions.width / 2;
    let centerY = stageDimensions.height / 2;
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

  const addToBackground = (backgroundUrl) => {
    setBackgroundImage(backgroundUrl);
  };

  const removeBackground = () => {
    setBackgroundImage(null);
  };

  const passImageWithId = (image, id) => {
    const imageWithId = {
      ...image,
      id: id,
    };
    return imageWithId;
  };

  const resizeCanvasOnSidebarChange = () => {
    setTimeout(() => {
      handleResize();
    }, 420);
  }

  return (
    <div className="workContainer">
      <ItemsList
        dragUrl={dragUrl}
        onChangeDragUrl={onChangeDragUrl}
        handleAddOnClick={handleAddOnClick}
        addToBackground={addToBackground}
        removeBackground={removeBackground}
        resizeCanvasOnSidebarChange={resizeCanvasOnSidebarChange}
        stageRef={stageRef}
      />

      <div className="canvasWrap">
        <div
          className="canvasBody"
          ref={containerRef}
          onDrop={handleOnDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stage
            width={stageDimensions.width}
            height={stageDimensions.height}
            scaleX={stageDimensions.scale}
            scaleY={stageDimensions.scale}
            className="canvasStage"
            ref={stageRef}
            onMouseDown={(e) => {
              checkDeselect(e);
            }}
          >
            <Layer>
              {typeof backgroundImage === "string" && (
                <CanvasBackground
                  backgroundUrl={backgroundImage}
                  width={stageWidth}
                  height={stageHeight}
                />
              )}
              {isLoading ? ( // 로딩 중이면 로딩 애니메이션을 표시합니다.
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Spinner />
                </div>
              ) : (
                images.map((image, i) => (
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
                ))
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
