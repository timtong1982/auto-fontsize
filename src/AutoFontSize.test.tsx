import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { AutoFontSize } from './AutoFontSize';

describe('AutoFontSize', () => {
    it('renders basic example correctly', () => {
        const component = renderer.create(
            <div style={{ fontSize: 10, width: '200px' }}>
                <AutoFontSize text='test text' />
            </div>);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});