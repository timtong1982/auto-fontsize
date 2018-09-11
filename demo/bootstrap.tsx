import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AutoFontSize } from '../src/AutoFontSize'

const renderComponent = () => {
    console.log('rendering...');
    ReactDOM.render(
        <React.Fragment>
            {/* <div style={{ width: 200, fontSize: 32, lineHeight: 'normal', border: '1px solid red' }}>
                <AutoFontSize
                    text="1. The quick brown fox jumps over the lazy dog"
                    textSizeStep={2}
                    targetLines={1}
                />
            </div>
            <br />
            <div style={{ width: 200, fontSize: 32, lineHeight: 'normal', border: '1px solid red' }}>
                <AutoFontSize
                    text="2. The quick brown fox jumps over the lazy dog"
                    fontSizeMapping={[{ fontSize: 28, lineHeight: '31px' }, { fontSize: 16, lineHeight: '19px' }]}
                />
            </div>
            <br />
            <div style={{ width: 800, fontSize: 32, lineHeight: 'normal', border: '1px solid red' }}>
                <AutoFontSize
                    text="3. The quick brown fox jumps over the lazy dog"
                    fontSizeMapping={[{ fontSize: 28, lineHeight: '31px' }, { fontSize: 16, lineHeight: '19px' }]}
                />
            </div>
            <br />
            <div style={{ width: 800, fontSize: 32, lineHeight: 'normal', border: '1px solid red' }}>
                <AutoFontSize
                    text="4. The quick brown fox jumps over the lazy dog"
                    textSize={22}
                    textSizeStep={2}
                    targetLines={1}
                />
            </div>
            <br />
            <div style={{ width: 400, fontSize: 32, lineHeight: 'normal', border: '1px solid red' }}>
                <AutoFontSize
                    text="5. The quick brown fox jumps over the lazy dog"
                    fontSizeMapping={[{ fontSize: 28, lineHeight: '31px' }, { fontSize: 16, lineHeight: '19px' }]}
                    targetLines={2}
                />
            </div>
            <br /> */}
            <div style={{ width: 400, fontSize: 32, lineHeight: 'normal', border: '1px solid red' }}>
                <AutoFontSize
                    text="6. The quick brown fox jumps over the lazy dog, The quick brown fox jumps over the lazy dog,The quick brown fox jumps over the lazy dog"
                    textSize={22}
                    minTextSize={18}
                    textSizeStep={2}
                    targetLines={2}
                    ellipsisOverflow
                />
            </div>
            <br />
            <div style={{ width: 400, fontSize: 32, lineHeight: 'normal', border: '1px solid red', fontFamily: 'Segoe UI' }}>
                <AutoFontSize
                    text="7.ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版ヱヴァンゲリヲン新劇場版"
                    textSize={22}
                    minTextSize={18}
                    textSizeStep={2}
                    targetLines={2}
                    ellipsisOverflow
                />
            </div>
        </React.Fragment>,
        document.getElementById('mounthere')
    );
};

renderComponent();

if (module.hot) {
    module.hot.accept('../src//AutoFontSize.tsx', () => renderComponent());
}
