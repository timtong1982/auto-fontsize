import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AutoFontSize } from '../AutoFontSize';

const renderComponent = () => {
    console.log('rendering...');
    ReactDOM.render(
        <AutoFontSize
            text="long text, long text long text long text, long text long text 1234f"
            minTextSize={16}
            textSize={28}
            textSizeStep={4}
            targetLines={2}
        />,
        document.getElementById('mounthere')
    );
};

renderComponent();

if (module.hot) {
    module.hot.accept('../AutoFontSize.tsx', () => renderComponent());
}
