<div align="center">
<h2><a href="https://jestjs.io">jest</a> matcher for <a href="https://github.com/NiGhTTraX/react-mock-component">react-mock-component</a></h2>

[![Build Status](https://travis-ci.com/NiGhTTraX/jest-react-mock.svg?branch=master)](https://travis-ci.com/NiGhTTraX/jest-react-mock) [![codecov](https://codecov.io/gh/NiGhTTraX/jest-react-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/jest-react-mock) ![npm type definitions](https://img.shields.io/npm/types/mugshot.svg)
</div>

----

## Installation

With npm

```sh
npm i -D jest-react-mock
```

or with yarn

```sh
yarn add -D jest-react-mock
```

## Setup

```typescript
import reactMockMatcher from 'jest-react-mock';

expect.extend(reactMockMatcher);
```

## Usage

### `toBeMounted`

Checks that a mock component is currently mounted.

```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render, unmount} from 'react-dom';

const Mock = createReactMock();

expect(Mock).not.toBeMounted();
render(<Mock />);
expect(Mock).toBeMounted();
unmount();
expect(Mock).not.toBeMounted();
```

### `toHaveBeenRendered()`

Checks that a mock component has been rendered at least once.

```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render} from 'react-dom';

const Mock = createReactMock();

expect(Mock).not.toHaveBeenRendered();

render(<Mock />);

expect(Mock).toHaveBeenRendered();
```

This is slightly different from `toBeMounted`: if the component gets unmounted `toBeMounted` will throw whereas `toHaveBeenRendered` will continue to pass.

### `toHaveBeenRenderedWith(props)`

Checks that a mock component has been rendered with certain props at least once.
You can pass a subset of the props and they will be deeply matched against the received ones.


```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render} from 'react-dom';

const Mock = createReactMock<{ foo: string, bar: number }>();

render(<Mock foo="bar" bar={42} />);

expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
```
