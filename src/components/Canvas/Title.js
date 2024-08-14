import React, { useState, useRef, useEffect } from 'react';
import { Text, Rect, Group } from 'react-konva';
import { Html } from 'react-konva-utils';

const Title = (props) => {
    const [showOutline, setShowOutline] = useState(false);
    const [textRect, setTextRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [text, setText] = useState(props.text);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleMouseEnter = (node) => {
        setShowOutline(true);
        const rect = node.getClientRect();
        setTextRect(rect);
    };

    const handleMouseLeave = () => {
        setShowOutline(false);
    };

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const { x, y, fontSize, width, align, color, weight } = props;

    return (
        <Group
            onMouseEnter={(e) => handleMouseEnter(e.target)}
            onMouseLeave={handleMouseLeave}
            onClick={handleTextClick}
        >
            {isEditing ? (
                <Html>
                    <textarea
                        ref={inputRef}
                        type="text"
                        value={text}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        style={{
                            position: 'absolute',
                            height: textRect.height,
                            top: textRect.y,
                            left: textRect.x,
                            fontSize: fontSize,
                            fontWeight: weight,
                            textAlign: align,
                            color: color,
                            width: width,
                            border: 'none',
                            outline: 'none',
                            background: 'none',
                            padding: 0,
                            margin: 0,
                            resize: 'none',
                            overflow: 'hidden',
                            lineHeight: 1,
                        }}
                    />
                </Html>
            ) : (
                <Text
                    text={text}
                    x={x}
                    y={y}
                    fontSize={fontSize}
                    fontFamily='Pretendard'
                    fontStyle={weight}
                    fill={color}
                    align={align}
                    width={width}
                />
            )}
            {(props.isEdit && (showOutline)) && (
                <Rect
                    x={textRect.x}
                    y={textRect.y}
                    width={textRect.width}
                    height={textRect.height}
                    stroke='#52A9EE'
                    strokeWidth={2}
                />
            )}
        </Group>
    );
};

export default Title;