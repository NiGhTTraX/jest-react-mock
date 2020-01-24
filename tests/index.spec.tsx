import React from 'react';
import { $render } from '@tdd-buffet/react';
import createReactMock from 'react-mock-component';
import stripAnsi from 'strip-ansi';
import reactMockMatcher from '../src';

function expectToThrowAnsiless(cb: () => void, message: string) {
  try {
    cb();
  } catch (e) {
    expect(stripAnsi(e.message)).toEqual(message);
  }
}

describe('jest-react-mock', () => {
  expect.extend(reactMockMatcher);

  it('should check that a component was rendered', () => {
    const Mock = createReactMock();

    expectToThrowAnsiless(
      () => expect(Mock).toHaveBeenRendered(),
      `expect(mock).toHaveBeenRendered()

Expected number of renders: >= 1
Received number of renders:    0`
    );

    expect(Mock).not.toHaveBeenRendered();

    $render(<Mock />);
    expectToThrowAnsiless(
      () => expect(Mock).not.toHaveBeenRendered(),
      `expect(mock).not.toHaveBeenRendered()

Expected number of renders: 0
Received number of renders: 1`
    );
    expect(Mock).toHaveBeenRendered();
  });
});
