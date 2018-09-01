import * as React from 'react';
import { findDOMNode } from 'react-dom';

const lineHeightFunc = require('line-height');
const convertLength = require('convert-css-length');
const cssLenConverter = convertLength();

interface IFontSizeLineHeightMapping {
    fontSize: number;
    lineHeight: number | string | 'normal';
}

interface IAutoFontSizeProps {
    text: string;
    fontSizeMapping?: IFontSizeLineHeightMapping[];
    textSize?: number;
    minTextSize?: number;
    lineHeightRatio?: number | string | 'normal';
    textSizeStep?: number;
    targetLines?: number;
    targetElementType?: 'div' | 'p' | 'span';
}

interface IAutoFontSizeStates {
    currentTextSize: number;
    currentLineHeight: number | string | 'normal';
    elementWidth: number | string;
}

class AutoFontSize extends React.Component<
    IAutoFontSizeProps,
    IAutoFontSizeStates
    > {
    public static defaultProps: Partial<IAutoFontSizeProps> = {
        textSizeStep: 2,
        targetLines: 1,
        minTextSize: 2,
        lineHeightRatio: 'normal',
        targetElementType: 'div'
    };

    private textContainer: HTMLElement | null = null;

    constructor(props: IAutoFontSizeProps) {
        super(props);
        this.state = {
            currentTextSize: props.textSize,
            currentLineHeight: 0,
            elementWidth: 0
        };
    }

    public render() {
        const { text, targetElementType } = this.props;
        const {
            currentTextSize,
            currentLineHeight,
            elementWidth
        } = this.state;

        const cacledStyle: React.CSSProperties = {
            fontSize: currentTextSize,
            lineHeight: currentLineHeight,
            width: elementWidth
        };

        const TargetWrapper = targetElementType;

        return (
            <TargetWrapper ref={(_: HTMLElement) => (this.textContainer = _)} style={cacledStyle}>
                {text}
            </TargetWrapper>
        );
    }

    public componentDidUpdate(): void {
        const container = this._getContainer();
        if (container) {
            const { fontSizeMapping, targetLines, minTextSize } = this.props;
            const { currentTextSize } = this.state;

            const lineHeight = lineHeightFunc(container);
            const containerHeight = container.clientHeight;
            const currentTextLines = Math.floor(containerHeight / lineHeight);
            if (currentTextLines > targetLines && currentTextLines > minTextSize) {
                // do auto sizing
                if (fontSizeMapping && fontSizeMapping.length) {
                    // Using the mapping setting to set the font size steppings
                    // sort the mapping
                    const sortedMapping = fontSizeMapping.sort((a: IFontSizeLineHeightMapping, b: IFontSizeLineHeightMapping) => b.fontSize - a.fontSize);

                    // search the next value to use
                    if (!!!currentTextSize) {
                        // First hit, use the max value from sorted mapping
                        const setting = sortedMapping[0];
                        this.setState({ currentTextSize: setting.fontSize, currentLineHeight: setting.lineHeight });
                    } else {
                        // find the next smaller value in fontSizeMapping
                        const settings = sortedMapping.filter((_: IFontSizeLineHeightMapping) => _.fontSize < currentTextSize);
                        if (settings && settings.length) {
                            this.setState({ currentTextSize: settings[0].fontSize, currentLineHeight: settings[0].lineHeight });
                        }

                    }
                }
            }
        }
        // const container = this._getContainer();
        // if (container) {
        //     const { targetLines, textSize, textSizeStep, minTextSize } = this.props;

        //     let textSizeCalc = textSize;
        //     if (!textSize) {
        //         textSizeCalc = this.state.parentTextSize;
        //     }
        //     // Get line height data since container width is now fixed
        //     const lineHeight = lineHeightFunc(container);
        //     const containerHeight = container.clientHeight;
        //     const currentTextLines = Math.floor(containerHeight / lineHeight);
        //     const { currentTextSize } = this.state;
        //     if (currentTextLines > targetLines &&
        //         currentTextSize > minTextSize) {
        //         // Need shrink font size
        //         const ratio = targetLines / currentTextLines;
        //         let calcTextSize = Math.ceil(currentTextSize * ratio);
        //         if (lineHeight < calcTextSize) {
        //             calcTextSize = lineHeight;
        //         }

        //         const stepAdjust = Math.floor((textSizeCalc - calcTextSize) % textSizeStep);
        //         const finalTextSize = calcTextSize - stepAdjust;
        //         this.setState({ currentTextSize: finalTextSize >= minTextSize ? finalTextSize : minTextSize });
        //     }
        // }
    }

    public componentDidMount() {
        const container = this._getContainer();
        if (container) {
            // set the width to 100% to trigger an update
            this.setState({ elementWidth: '100%', currentLineHeight: 'normal' });
        }
    }

    private _getContainer() {
        if (this.textContainer) {
            const container = findDOMNode(this.textContainer) as HTMLElement;
            if (container) {
                return container;
            }
        }

        return null;
    }
}

export {
    AutoFontSize,
    IFontSizeLineHeightMapping
};
