import { ReactMock } from 'react-mock-component';
// eslint-disable-next-line no-use-before-define
import MatcherContext = jest.MatcherContext;
// eslint-disable-next-line no-use-before-define
import CustomMatcherResult = jest.CustomMatcherResult;

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface ReactMockExpect<Props> {
  /**
   * Check that the mock is currently mounted.
   */
  toBeMounted(): void;

  /**
   * Check that the mock has been rendered at least once.
   */
  toHaveBeenRendered(): void;

  /**
   * Check that the mock has been rendered at least once with the expected expected.
   *
   * @param expected Will be matched recursively and can support jest matchers.
   *
   * @example
   * ```
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveBeenRenderedWith({ foo: 1 });
   * ```
   *
   * @example
   * ```
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveBeenRenderedWith(
   *   expect.objectContaining({ bar: 23 })
   * );
   * ```
   *
   * @example
   * ```
   * const Mock = createReactMock({ foo: { bar: number} });
   * expect(Mock).toHaveBeenRenderedWith({ foo: { bar: 1 } });
   * ```
   */
  toHaveBeenRenderedWith(expected: DeepPartial<Props>): void;
}

type ReactMockMatcher = {
  toBeMounted: (
    this: MatcherContext,
    mock: ReactMock<any>
  ) => CustomMatcherResult;
  toHaveBeenRendered: (
    this: MatcherContext,
    mock: ReactMock<any>
  ) => CustomMatcherResult;
  toHaveBeenRenderedWith: <Props>(
    this: MatcherContext,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>
  ) => CustomMatcherResult;
};

declare global {
  namespace jest {
    interface Expect {
      <Props>(mock: ReactMock<Props>): ReactMockExpect<Props> & {
        not: ReactMockExpect<Props>;
      };
    }
  }
}

function getMatchingCalls<Props>(
  mock: ReactMock<Props>,
  expected: DeepPartial<Props>,
  printReceived: (object: any) => string
) {
  const matchingCalls: [Props, number][] = [];

  mock.renderCalls.forEach((props, i) => {
    try {
      // expect in expect, yeah.
      expect(props).toMatchObject(expected);

      matchingCalls.push([props, i]);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  });

  return matchingCalls
    .map(([props, i]) => `  ${i}: ${printReceived(props)}`)
    .join('\n');
}

const reactMockMatcher: ReactMockMatcher = {
  toBeMounted(this: MatcherContext, mock: ReactMock<any>) {
    const { isNot } = this;
    const { printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toBeMounted', `mock`, '', {
      isNot
    });
    const expected = !isNot
      ? 'Expected the mock to currently be mounted, but it is not.'
      : `Expected the mock to currently not be mounted, but it is.`;
    const received = printReceived(mock.renderCalls.length);

    return {
      message: () =>
        `${hint}

${expected}
Previous number of renders: ${received}`,
      pass: mock.rendered
    };
  },

  toHaveBeenRendered(this: MatcherContext, mock: ReactMock<any>) {
    const { isNot } = this;
    const { printExpected, printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toHaveBeenRendered', `mock`, '', {
      isNot
    });
    const expected = isNot ? '0' : `>= ${printExpected(1)}`;
    const received = isNot
      ? printReceived(mock.renderCalls.length)
      : `   ${printReceived(mock.renderCalls.length)}`;

    return {
      message: () =>
        `${hint}

Expected number of renders: ${expected}
Received number of renders: ${received}`,
      pass: mock.rendered
    };
  },

  toHaveBeenRenderedWith<Props>(
    this: MatcherContext,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>
  ) {
    const { isNot } = this;
    const { printExpected, printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toHaveBeenRenderedWith', `mock`, 'props', {
      isNot
    });

    const received = isNot
      ? getMatchingCalls(mock, expected, printReceived)
      : mock.renderCalls
          .map((receivedProps, i) => `  ${i}: ${printReceived(receivedProps)}`)
          .join('\n');

    return {
      message: () =>
        `${hint}

Expected: ${isNot ? 'not ' : ''}${printExpected(expected)}
Received:
${received}

Number of renders: ${mock.renderCalls.length}`,
      pass: !!getMatchingCalls(mock, expected, printReceived)
    };
  }
};

export default reactMockMatcher;
