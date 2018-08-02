import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AutoFontSize } from '../src/AutoFontSize'

const renderComponent = () => {
    console.log('rendering...');
    ReactDOM.render(
        <AutoFontSize
            text="The quick brown fox jumps over the lazy dog"
            textSizeStep={2}
            targetLines={1}
        />,
        document.getElementById('mounthere')
    );
};

renderComponent();

if (module.hot) {
    module.hot.accept('../src//AutoFontSize.tsx', () => renderComponent());
}
