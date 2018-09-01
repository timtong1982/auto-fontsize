# auto-fontsize

This React component is used for limit text in the certain line(s) by shrink the font size.

## Install

`npm i auto-fontsize --save`

## Usage

`import {AutoFontSize} from 'auto-fontsize`

## Parameters

| Propery           | Type                          | Optional | Default   | Note                                                                            |
| ----------------- | ----------------------------- | -------- | --------- | ------------------------------------------------------------------------------- |
| text              | string                        | False    | N/A       | Text to display                                                                 |
| fontSizeMapping   | IFontSizeLineHeightMapping [] | True     | undefined | define Array of `IFontSizeLineHeightMapping` to execute the defined step sizing |
| textSize          | number                        | True     | N/A       | Start font size, if null, will use the inherit value from parent element        |
| minTextSize       | number                        | True     | 2         | Minimum text size to try on auto sizing                                         |
| lineHeightRatio   | number or string              | True     | 'normal'  | line height setting for auto sizing                                             |
| tetextSizeStepxt  | number                        | True     | 2         | Decrease step of font size when auto sizing                                     |
| targetLines       | number                        | True     | 1         | Target maximum lines when auto sizing                                           |
| targetElementType | 'div' or 'p' or 'span'        | True     | 'div'     | Target container to put the auto sizing text                                    |

### IFontSizeLineHeightMapping

```
interface IFontSizeLineHeightMapping {
    fontSize: number;
    lineHeight: number | string | 'normal';
}
```

### Use auto sizing

```
<AutoFontSize
            text="The quick brown fox jumps over the lazy dog"
            minTextSize={16}
            textSize={28}
            textSizeStep={2}
            targetLines={1}
        />
```

### Use defined step auto sizing

```
     <AutoFontSize
                text="The quick brown fox jumps over the lazy dog"
                fontSizeMapping={[{ fontSize: 28, lineHeight: '31px' }, { fontSize: 16, lineHeight: '19px' }]}
            />
```
