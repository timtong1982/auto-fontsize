# auto-fontsize

This React component is used for limit text in the certain line(s) by shrink the font size.

## Install 

`npm i auto-fontsize --save`

## Usage

`import {AutoFontSize} from 'auto-fontsize`

```
<AutoFontSize
            text="The quick brown fox jumps over the lazy dog"
            minTextSize={16}
            textSize={28}
            textSizeStep={2}
            targetLines={1}
        />
```

