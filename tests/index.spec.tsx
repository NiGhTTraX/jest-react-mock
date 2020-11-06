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

  it('should check that a mock was rendered', () => {
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

  it('should check that a mock is currently mounted', () => {
    const Mock = createReactMock();

    expectToThrowAnsiless(
      () => expect(Mock).toBeMounted(),
      `expect(mock).toBeMounted()

Expected the mock to currently be mounted, but it is not.
Previous number of renders: 0`
    );

    expect(Mock).not.toBeMounted();

    $render(<Mock />);

    expectToThrowAnsiless(
      () => expect(Mock).not.toBeMounted(),
      `expect(mock).not.toBeMounted()

Expected the mock to currently not be mounted, but it is.
Previous number of renders: 1`
    );
    expect(Mock).toBeMounted();
  });

  it('should check that a mock was rendered with certain props', () => {
    const Mock = createReactMock<{ foo: string }>();

    $render(<Mock foo="bar" />);
    $render(<Mock foo="baz" />);

    expect(() => expect(Mock).toHaveBeenRenderedWith({ foo: 'no' })).toThrow();
    expect(Mock).not.toHaveBeenRenderedWith({ foo: 'no' });

    expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
    expect(() =>
      expect(Mock).not.toHaveBeenRenderedWith({ foo: 'bar' })
    ).toThrow();

    expect(Mock).toHaveBeenRenderedWith({ foo: 'baz' });
    expect(() =>
      expect(Mock).not.toHaveBeenRenderedWith({ foo: 'baz' })
    ).toThrow();
  });

  it('should check that a mock was rendered with partial props', () => {
    const Mock = createReactMock<{ foo: string; bar: number }>();

    $render(<Mock foo="bar" bar={23} />);
    $render(<Mock foo="baz" bar={42} />);

    expect(() => expect(Mock).toHaveBeenRenderedWith({ foo: 'no' })).toThrow();
    expect(Mock).not.toHaveBeenRenderedWith({ foo: 'no' });

    expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
    expect(() =>
      expect(Mock).not.toHaveBeenRenderedWith({ foo: 'bar' })
    ).toThrow();

    expect(Mock).toHaveBeenRenderedWith({ bar: 23 });
    expect(() =>
      expect(Mock).not.toHaveBeenRenderedWith({ bar: 23 })
    ).toThrow();

    expect(Mock).toHaveBeenRenderedWith({});
    expect(() => expect(Mock).not.toHaveBeenRenderedWith({})).toThrow();
  });

  it('should check that a mock was rendered with partial nested props', () => {
    const Mock = createReactMock<{ foo: { bar: number; baz: boolean } }>();

    $render(<Mock foo={{ bar: 23, baz: true }} />);

    expect(Mock).toHaveBeenRenderedWith({ foo: { bar: 23 } });
    expect(() =>
      expect(Mock).not.toHaveBeenRenderedWith({ foo: { bar: 23 } })
    ).toThrow();

    expect(Mock).toHaveBeenRenderedWith({ foo: { baz: true } });
    expect(() =>
      expect(Mock).not.toHaveBeenRenderedWith({ foo: { baz: true } })
    ).toThrow();
  });

  it('should print all renders for failed renderedWith', () => {
    const Mock = createReactMock<{ foo: string; bar: number }>();

    $render(<Mock foo="bar" bar={1} />);
    $render(<Mock foo="baz" bar={2} />);
    $render(<Mock foo="baz" bar={3} />);

    expectToThrowAnsiless(
      () => expect(Mock).toHaveBeenRenderedWith({ foo: 'bla' }),
      `expect(mock).toHaveBeenRenderedWith(props)

Expected: {"foo": "bla"}
Received:
  0: {"bar": 1, "foo": "bar"}
  1: {"bar": 2, "foo": "baz"}
  2: {"bar": 3, "foo": "baz"}

Number of renders: 3`
    );

    expectToThrowAnsiless(
      () => expect(Mock).not.toHaveBeenRenderedWith({ foo: 'baz' }),
      `expect(mock).not.toHaveBeenRenderedWith(props)

Expected: not {"foo": "baz"}
Received:
  1: {"bar": 2, "foo": "baz"}
  2: {"bar": 3, "foo": "baz"}

Number of renders: 3`
    );
  });

  it('should check that a mock has last props', () => {
    const Mock = createReactMock<{ foo: string }>();

    $render(<Mock foo="bar" />);
    $render(<Mock foo="baz" />);

    expectToThrowAnsiless(
      () => expect(Mock).toHaveProps({ foo: 'no' }),
      `expect(mock).toHaveProps(props)

- Expected
+ Received

  Object {
-   "foo": "baz",
+   "foo": "no",
  }

Number of renders: 2`
    );

    expect(Mock).not.toHaveProps({ foo: 'bar' });
    expect(Mock).toHaveProps({ foo: 'baz' });
  });

  it('should support IDE integration for last props diff', () => {
    const Mock = createReactMock<{ foo: string }>();

    $render(<Mock foo="bar" />);

    const shouldThrow = () => expect(Mock).toHaveProps({ foo: 'baz' });

    expect(shouldThrow).toThrow();

    try {
      shouldThrow();
    } catch (e) {
      expect(e.matcherResult.actual).toEqual({ foo: 'bar' });
      expect(e.matcherResult.expected).toEqual({ foo: 'baz' });
    }
  });

  it('should support jest matchers for renderedWith', () => {
    const Mock = createReactMock<{ foo: string; bar: number[] }>();

    $render(<Mock foo="bar" bar={[1, 2, 3]} />);
    $render(<Mock foo="baz" bar={[4, 5, 6]} />);
    $render(<Mock foo="baz" bar={[7, 8, 9]} />);

    expect(Mock).toHaveBeenRenderedWith(
      expect.objectContaining({ bar: expect.arrayContaining([4, 6]) })
    );
  });

  it('should support jest matchers for last props', () => {
    const Mock = createReactMock<{ foo: string; bar: number[] }>();

    $render(<Mock foo="bar" bar={[1, 2, 3]} />);

    expect(Mock).toHaveProps(
      expect.objectContaining({ bar: expect.arrayContaining([2, 3]) })
    );
  });
});
