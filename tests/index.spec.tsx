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

  it('should check that a mock was rendered with certain props', () => {
    const Mock = createReactMock<{ foo: string }>();

    $render(<Mock foo="bar" />);
    $render(<Mock foo="baz" />);

    expectToThrowAnsiless(
      () => expect(Mock).toHaveBeenRenderedWith({ foo: 'no' }),
      `expect(mock).toHaveBeenRenderedWith(props)

Expected: {"foo": "no"}
Received:
  0: {"foo": "bar"}
  1: {"foo": "baz"}

Number of renders: 2`
    );

    expect(Mock).not.toHaveBeenRenderedWith({ foo: 'no' });
    expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
    expect(Mock).toHaveBeenRenderedWith({ foo: 'baz' });
  });

  it('should check that a mock was rendered with partial props', () => {
    const Mock = createReactMock<{ foo: string; bar: number }>();

    $render(<Mock foo="bar" bar={23} />);
    $render(<Mock foo="baz" bar={42} />);

    expectToThrowAnsiless(
      () => expect(Mock).toHaveBeenRenderedWith({ foo: 'no' }),
      `expect(mock).toHaveBeenRenderedWith(props)

Expected: {"foo": "no"}
Received:
  0: {"bar": 23, "foo": "bar"}
  1: {"bar": 42, "foo": "baz"}

Number of renders: 2`
    );

    expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
    expect(Mock).toHaveBeenRenderedWith({ bar: 23 });
    expect(Mock).toHaveBeenRenderedWith({});
  });

  it('should check that a mock was rendered with partial nested props', () => {
    const Mock = createReactMock<{ foo: { bar: number; baz: boolean } }>();

    $render(<Mock foo={{ bar: 23, baz: true }} />);

    expect(Mock).toHaveBeenRenderedWith({ foo: { bar: 23 } });
    expect(Mock).toHaveBeenRenderedWith({ foo: { baz: true } });
  });

  it('should print all props that match for failed negated expectation', () => {
    const Mock = createReactMock<{ foo: string; bar: number }>();

    $render(<Mock foo="bar" bar={23} />);
    $render(<Mock foo="baz" bar={42} />);
    $render(<Mock foo="baz" bar={43} />);

    expectToThrowAnsiless(
      () => expect(Mock).not.toHaveBeenRenderedWith({ foo: 'baz' }),
      `expect(mock).not.toHaveBeenRenderedWith(props)

Expected: not {"foo": "baz"}
Received:
  1: {"bar": 42, "foo": "baz"}
  2: {"bar": 43, "foo": "baz"}

Number of renders: 3`
    );
    expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
    expect(Mock).toHaveBeenRenderedWith({ bar: 23 });
    expect(Mock).toHaveBeenRenderedWith({});
  });

  it('should support jest matchers', () => {
    const Mock = createReactMock<{ foo: string; bar: number }>();

    $render(<Mock foo="bar" bar={23} />);
    $render(<Mock foo="baz" bar={42} />);
    $render(<Mock foo="baz" bar={43} />);

    expect(Mock).toHaveBeenRenderedWith(
      expect.objectContaining({ foo: 'bar', bar: expect.any(Number) })
    );
  });
});
