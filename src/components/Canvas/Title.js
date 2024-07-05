import React from 'react';
import { Text, Rect, Group } from 'react-konva';

class Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOutline: false,
            textRect: { x: 0, y: 0, width: 0, height: 0 },
            text: this.props.text,
            isEditing: false,
        };
    }

    handleBlur = () => {
        this.setState({ isEditing: false });
    };

    handleMouseEnter = (node) => {
        this.setState({ showOutline: true });
        const rect = node.getClientRect();
        this.setState({ textRect: rect });
    };

    handleMouseLeave = () => {
        this.setState({ showOutline: false });
    };

    render() {
        const { x, y, fontSize, width, align, setNode, color, weight } = this.props;
        const { showOutline, textRect, isEditing, text } = this.state;

        return (
            <Group
                onMouseEnter={(e) => this.handleMouseEnter(e.target)}
                onMouseLeave={this.handleMouseLeave}
            >
                {/* <input
                    type="text"
                    text={text}
                    // value={text}
                    onBlur={this.handleBlur}
                    ref={(input) => { this.input = input; }}
                    style={{
                        position: 'absolute',
                        top: y,
                        left: x,
                        width: width,
                        fontSize: fontSize,
                        fontWeight: weight,
                        textAlign: align,
                        display: isEditing ? 'block' : 'none',
                        color: color,
                    }}
                /> */}
                {!isEditing && (
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
                {(showOutline && this.props.isEdit) && (
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
    }
}

export default Title;