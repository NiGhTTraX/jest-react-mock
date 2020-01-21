import React from 'react';
import { $render } from '@tdd-buffet/react';
import createReactMock from 'react-mock-component';
import reactMockMatcher from '../src';

describe('jest-react-mock', () => {
  expect.extend(reactMockMatcher);

  it('should check that a component was rendered', () => {
    const Mock = createReactMock();

    expect(() => expect(Mock).toHaveBeenRendered()).toThrow(
      'expected component to have been rendered'
    );
    expect(Mock).not.toHaveBeenRendered();

    $render(<Mock />);

    expect(() => expect(Mock).not.toHaveBeenRendered()).toThrow(
      'expected component to not have been rendered'
    );
    expect(Mock).toHaveBeenRendered();
  });
});
