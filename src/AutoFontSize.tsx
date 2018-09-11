import * as React from "react";
import { findDOMNode } from "react-dom";

const lineHeightFunc = require("line-height");
const convertLength = require("convert-css-length");
const cssLenConverter = convertLength();

interface IFontSizeLineHeightMapping {
  fontSize: number;
  lineHeight: number | string | "normal";
}

interface IAutoFontSizeProps {
  text: string;
  fontSizeMapping?: IFontSizeLineHeightMapping[];
  textSize?: number;
  minTextSize?: number;
  lineHeightRatio?: number | string | "normal";
  textSizeStep?: number;
  targetLines?: number;
  targetElementType?: "div" | "p" | "span";
  ellipsisOverflow?: boolean;
}

interface IAutoFontSizeStates {
  currentText: string;
  currentTextSize: number;
  currentLineHeight: number | string | "normal";
  elementWidth: number | string;
  limitContainerHeight: number | string | null;
}

class AutoFontSize extends React.Component<
  IAutoFontSizeProps,
  IAutoFontSizeStates
  > {
  public static defaultProps: Partial<IAutoFontSizeProps> = {
    textSizeStep: 2,
    targetLines: 1,
    minTextSize: 2,
    lineHeightRatio: "normal",
    targetElementType: "div",
    ellipsisOverflow: false
  };

  private textContainer: HTMLElement | null = null;

  constructor(props: IAutoFontSizeProps) {
    super(props);
    this.state = {
      currentTextSize: props.textSize,
      currentLineHeight: 0,
      elementWidth: 0,
      limitContainerHeight: null,
      currentText: props.text
    };
  }

  public render() {
    const { targetElementType, text, ellipsisOverflow } = this.props;
    const { currentTextSize, currentLineHeight, elementWidth, limitContainerHeight, currentText } = this.state;

    const cacledStyle: React.CSSProperties = {
      fontSize: currentTextSize,
      lineHeight: currentLineHeight,
      width: elementWidth
    };

    if (limitContainerHeight) {
      cacledStyle.height = limitContainerHeight;
    }

    const TargetWrapper = targetElementType;

    const ellipsis = ellipsisOverflow && currentText !== text ? ' ...' : null;

    return (
      <TargetWrapper
        ref={(_: HTMLElement) => (this.textContainer = _)}
        style={cacledStyle}
      >
        {currentText}{ellipsis}
      </TargetWrapper>
    );
  }

  public componentDidUpdate(preProps: IAutoFontSizeProps, preStates: IAutoFontSizeStates): void {
    // console.log(preStates);
    // console.log(this.state);
    const container = this._getContainer();
    if (container) {
      const { targetLines, minTextSize, ellipsisOverflow } = this.props;
      const { currentTextSize, limitContainerHeight } = this.state;

      const lineHeight = lineHeightFunc(container);
      const containerHeight = container.clientHeight;
      const currentTextLines = Math.floor(containerHeight / lineHeight);

      // !!!currentTextSize triggers a update anyway to ignore parent container inherit
      if (!!!currentTextSize || (currentTextLines > targetLines && currentTextSize > minTextSize)) {
        const sortedMapping = this._getSortedMappingSetting();

        // do auto sizing
        if (sortedMapping && sortedMapping.length) {
          // Using the mapping setting to set the font size steppings
          // search the next value to use
          if (!!!currentTextSize) {
            // First hit, use the max value from sorted mapping
            const setting = sortedMapping[0];
            this.setState({
              currentTextSize: setting.fontSize,
              currentLineHeight: setting.lineHeight
            });
          } else {
            // find the next smaller value in fontSizeMapping
            const settings = sortedMapping.filter(
              (_: IFontSizeLineHeightMapping) => _.fontSize < currentTextSize
            );
            if (settings && settings.length) {
              this.setState({
                currentTextSize: settings[0].fontSize,
                currentLineHeight: settings[0].lineHeight
              });
            }
          }
        } else {
          // Full auto sizing
          if (!!!currentTextSize) {
            const { textSize, lineHeightRatio } = this.props;
            let fontSizeInNumber = textSize;
            if (!!!fontSizeInNumber) {
              // Get the text size from current container
              fontSizeInNumber = this._getCssFontSize(container);
              if (fontSizeInNumber < minTextSize) {
                fontSizeInNumber = minTextSize;
              }
            }

            this.setState({
              currentTextSize: fontSizeInNumber,
              currentLineHeight: lineHeightRatio
            });
          } else {
            const { textSizeStep } = this.props;
            // Step setting the font size
            let nextFontSize = currentTextSize - textSizeStep;
            if (nextFontSize < minTextSize) {
              nextFontSize = minTextSize;
            }

            this.setState({ currentTextSize: nextFontSize });
          }
        }
      } else if (ellipsisOverflow) {
        const nextContainerHeight = lineHeight * targetLines;
        if (nextContainerHeight != limitContainerHeight) {
          this.setState({ limitContainerHeight: lineHeight * targetLines });
        }

        if (container.scrollHeight > container.clientHeight) {
          const { currentText } = this.state;
          let lastCutIndex = currentText.lastIndexOf(' ');
          if (lastCutIndex == -1) {
            lastCutIndex = currentText.length - 1;
          }

          const nextText = currentText.substring(0, lastCutIndex);
          this.setState({ currentText: nextText });
        }
      }
    }
  }

  public componentDidMount() {
    const container = this._getContainer();
    if (container) {
      // honor settings max value anyway
      const sortedMapping = this._getSortedMappingSetting();
      if (sortedMapping && sortedMapping.length) {
        const setting = sortedMapping[0];
        this.setState({ currentLineHeight: setting.lineHeight, currentTextSize: setting.fontSize });
      } else {
        const { textSize, lineHeightRatio, minTextSize } = this.props;
        if (textSize && textSize >= minTextSize) {
          this.setState({ currentTextSize: textSize, currentLineHeight: lineHeightRatio });
        }
      }
      // set the width to 100% to trigger an update
      this.setState({ elementWidth: "100%", currentLineHeight: "normal" });
    }
  }

  private _getContainer() {
    if (this.textContainer) {
      const container = findDOMNode(this.textContainer) as HTMLElement;
      if (container) {
        return container;
      }
    }

    return 0;
  }

  private _getCssFontSize(container: HTMLElement) {
    const containerFontSize = window.getComputedStyle(container).fontSize;
    const fontSizeInNumber = parseInt(cssLenConverter(containerFontSize, "px"));
    if (fontSizeInNumber) {
      return fontSizeInNumber;
    }

    return 0;
  }

  private _getSortedMappingSetting() {
    const { fontSizeMapping } = this.props;
    if (fontSizeMapping && fontSizeMapping.length) {
      // Using the mapping setting to set the font size steppings
      // sort the mapping
      const sortedMapping = fontSizeMapping.sort(
        (a: IFontSizeLineHeightMapping, b: IFontSizeLineHeightMapping) =>
          b.fontSize - a.fontSize
      );

      return sortedMapping;
    }

    return null;
  }
}

export { AutoFontSize, IFontSizeLineHeightMapping };
