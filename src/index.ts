import { ReactMock } from 'react-mock-component';
// eslint-disable-next-line no-use-before-define
import MatcherContext = jest.MatcherContext;
// eslint-disable-next-line no-use-before-define
import CustomMatcherResult = jest.CustomMatcherResult;

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface ReactMockExpect<P> {
  toHaveBeenRendered(): void;
  toHaveBeenRenderedWith(props: DeepPartial<P>): void;
}

type ReactMockMatcher = {
  [P in keyof ReactMockExpect<any>]: ReactMockExpect<any>[P] extends (
    ...args: infer A
  ) => void
    ? (
        this: MatcherContext,
        mock: ReactMock<any>,
        ...args: A
      ) => CustomMatcherResult
    : never;
};

declare global {
  namespace jest {
    interface Expect {
      <P>(mock: ReactMock<P>): ReactMockExpect<P> & { not: ReactMockExpect<P> };
    }
  }
}

function getMatchingCalls<P>(
  mock: ReactMock<P>,
  expected: P,
  printReceived: (object: any) => string
) {
  if (!mock.renderedWith(expected)) {
    return '';
  }
  const matchingCalls: [P, number][] = [];

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

  toHaveBeenRenderedWith<P>(
    this: MatcherContext,
    mock: ReactMock<P>,
    props: P
  ) {
    const { isNot } = this;
    const { printExpected, printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toHaveBeenRenderedWith', `mock`, 'props', {
      isNot
    });

    const expected = printExpected(props);
    const received = isNot
      ? getMatchingCalls(mock, props, printReceived)
      : mock.renderCalls
          .map((receivedProps, i) => `  ${i}: ${printReceived(receivedProps)}`)
          .join('\n');

    return {
      message: () =>
        `${hint}

Expected: ${isNot ? 'not ' : ''}${expected}
Received:
${received}

Number of renders: ${mock.renderCalls.length}`,
      pass: mock.renderedWith(props)
    };
  }
};

export default reactMockMatcher;
