import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AutoFontSize } from '../src/AutoFontSize'

const renderComponent = () => {
    console.log('rendering...');
    ReactDOM.render(
        <React.Fragment>
            <AutoFontSize
                text=",The quick brown fox jumps over the lazy dog,The quick brown fox jumps over the lazy dog"
                textSizeStep={2}
                targetLines={1}
            />
            <AutoFontSize
                text="The quick brown fox jumps over the lazy dog"
                fontSizeMapping={[{ fontSize: 28, lineHeight: '31px' }, { fontSize: 16, lineHeight: '19px' }]}
            />
        </React.Fragment>,
        document.getElementById('mounthere')
    );
};

renderComponent();

if (module.hot) {
    module.hot.accept('../src//AutoFontSize.tsx', () => renderComponent());
}
