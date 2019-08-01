import * as React from "react";
import { findDOMNode } from "react-dom";

const lineHeightFunc: any = require("line-height");
const convertLength: any = require("convert-css-length");
const cssLenConverter: any = convertLength();

type TargetElementType =
  | "div"
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "header";

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
  targetElementType?: TargetElementType;
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

  public render(): React.ReactNode {
    const { targetElementType, text, ellipsisOverflow } = this.props;
    const {
      currentTextSize,
      currentLineHeight,
      elementWidth,
      limitContainerHeight,
      currentText
    } = this.state;

    const cacledStyle: React.CSSProperties = {
      fontSize: currentTextSize,
      lineHeight: currentLineHeight,
      width: elementWidth
    };

    if (limitContainerHeight) {
      cacledStyle.height = limitContainerHeight;
    }

    const TargetWrapper: TargetElementType = targetElementType;

    const ellipsis: string | null =
      ellipsisOverflow && currentText !== text ? "..." : null;

    return (
      <TargetWrapper
        ref={(_: HTMLElement) => (this.textContainer = _)}
        style={cacledStyle}
      >
        {currentText}
        {ellipsis}
      </TargetWrapper>
    );
  }

  public componentWillReceiveProps(nextProps: IAutoFontSizeProps): void {
    if (nextProps.text !== this.props.text) {
      this.setState({ currentText: nextProps.text });
    }
  }

  public componentDidUpdate(
    _preProps: IAutoFontSizeProps,
    _preStates: IAutoFontSizeStates
  ): void {
    const container: 0 | HTMLElement = this._getContainer();
    if (container) {
      const { targetLines, minTextSize, ellipsisOverflow, text } = this.props;
      const { currentTextSize, limitContainerHeight } = this.state;

      const lineHeight: number = lineHeightFunc(container);
      const containerHeight: number = container.clientHeight;
      const currentTextLines: number = Math.floor(containerHeight / lineHeight);

      // !!!currentTextSize triggers a update anyway to ignore parent container inherit
      if (
        !!!currentTextSize ||
        (currentTextLines > targetLines && currentTextSize > minTextSize)
      ) {
        const sortedMapping: IFontSizeLineHeightMapping[] = this._getSortedMappingSetting();

        // do auto sizing
        if (sortedMapping && sortedMapping.length) {
          // using the mapping setting to set the font size steppings
          // search the next value to use
          if (!!!currentTextSize) {
            // first hit, use the max value from sorted mapping
            const setting: IFontSizeLineHeightMapping = sortedMapping[0];
            this.setState({
              currentTextSize: setting.fontSize,
              currentLineHeight: setting.lineHeight
            });
          } else {
            // find the next smaller value in fontSizeMapping
            const settings: IFontSizeLineHeightMapping[] = sortedMapping.filter(
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
          // full auto sizing
          if (!!!currentTextSize) {
            const { textSize, lineHeightRatio } = this.props;
            let fontSizeInNumber: number = textSize;
            if (!!!fontSizeInNumber) {
              // get the text size from current container
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
            // step setting the font size
            let nextFontSize: number = currentTextSize - textSizeStep;
            if (nextFontSize < minTextSize) {
              nextFontSize = minTextSize;
            }

            this.setState({ currentTextSize: nextFontSize });
          }
        }

        if (ellipsisOverflow) {
          const nextContainerHeight: number = lineHeight * targetLines;
          if (nextContainerHeight !== limitContainerHeight) {
            this.setState({ limitContainerHeight: lineHeight * targetLines });
          }
        }
      } else {
        // container.scrollHeight - 2 incase of asian fonts
        if (
          ellipsisOverflow &&
          container.scrollHeight - 2 > container.clientHeight
        ) {
          const { currentText, currentTextSize } = this.state;
          const { targetLines } = this.props;
          const containerWidth: number = container.clientWidth;
          const charPerLine: number = containerWidth / currentTextSize;
          const allowedChars: number = targetLines * charPerLine;

          let lastCutIndex: number = currentText.lastIndexOf(" ");
          if (lastCutIndex === -1 || lastCutIndex < allowedChars * 0.9) {
            lastCutIndex = currentText.length - 1;
          }

          const nextText: string = currentText.substring(0, lastCutIndex);
          this.setState({ currentText: nextText });
        }
      }
    }
  }

  public componentDidMount(): void {
    const container: 0 | HTMLElement = this._getContainer();
    if (container) {
      // honor settings max value anyway
      const sortedMapping: IFontSizeLineHeightMapping[] = this._getSortedMappingSetting();
      if (sortedMapping && sortedMapping.length) {
        const setting: IFontSizeLineHeightMapping = sortedMapping[0];
        this.setState({
          currentLineHeight: setting.lineHeight,
          currentTextSize: setting.fontSize
        });
      } else {
        const { textSize, lineHeightRatio, minTextSize } = this.props;
        if (textSize && textSize >= minTextSize) {
          this.setState({
            currentTextSize: textSize,
            currentLineHeight: lineHeightRatio
          });
        }
      }
      // set the width to 100% to trigger an update
      this.setState({ elementWidth: "100%" });
    }
  }

  private _getContainer(): HTMLElement | 0 {
    if (this.textContainer) {
      const container: HTMLElement = findDOMNode(
        this.textContainer
      ) as HTMLElement;
      if (container) {
        return container;
      }
    }

    return 0;
  }

  private _getCssFontSize(container: HTMLElement): number {
    const containerFontSize: string = window.getComputedStyle(container)
      .fontSize;
    const fontSizeInNumber: number = parseInt(
      cssLenConverter(containerFontSize, "px"),
      undefined
    );
    if (fontSizeInNumber) {
      return fontSizeInNumber;
    }

    return 0;
  }

  private _getSortedMappingSetting(): IFontSizeLineHeightMapping[] {
    const { fontSizeMapping } = this.props;
    if (fontSizeMapping && fontSizeMapping.length) {
      // using the mapping setting to set the font size steppings
      // sort the mapping
      const sortedMapping: IFontSizeLineHeightMapping[] = fontSizeMapping.sort(
        (a: IFontSizeLineHeightMapping, b: IFontSizeLineHeightMapping) =>
          b.fontSize - a.fontSize
      );

      return sortedMapping;
    }

    return null;
  }
}

export { AutoFontSize, IFontSizeLineHeightMapping };
