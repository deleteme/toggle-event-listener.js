`toggleEventListener()` is an element `classList.toggle()` style API for element event handlers.

* Familiar API
* Tiny. Only 69 lines of code, including comments and argument error checking.
* No external dependencies
* Unit tested
* Assumes Weakmap and Set are globally available
* Assumes DOM elements have `addEventListener` and `removeEventListener` methods

## Demo

https://toggle-event-listener-js-demo.glitch.me

## Install

`npm install --save toggle-event-listener`

or

`yarn add toggle-event-listener`


## API

If you've used an element's
[`classList.toggle()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
method then you already know this API.


__There are two argument signatures:__

```javascript
toggleEventListener(element, type, handler)
```

This will toggle the binding of the handler.


```javascript
toggleEventListener(element, type, handler, shouldBeBound)
```

This lets you declare the status of the binding. If the `shouldBeBound`
argument is truthy, the handler will be present. If it's falsey, the handler
will be not be present.


## Example Usage

Imagine that a `closeModal` click handler should only be present on the
document body element when the modal is active.

```javascript
import toggleEventListener from "toggle-event-listener";

export const renderBodyElement = ({ isModalActive, closeModal }) => {
  toggleEventListener(document.body, "click", closeModal, isModalActive);
};
```

## Example Usage with React

This is particularly useful in a React application because React cannot render
to the document body element.

When combined with the `shouldComponentUpdate` React component lifecycle
method, you can render to the body like you would any other element and have
the element changed _only when the state changes_.


```javascript
import React, { Component, PureComponent } from "react";
import toggleEventListener from "toggle-event-listener";

class RenderBodyCloseModalHandler extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.isModalActive !== this.props.isModalActive &&
      nextProps.closeModal !== this.props.closeModal
    );
  }
  render() {
    const { closeModal, isModalActive } = this.props;
    toggleEventListener(document.body, "click", closeModal, isModalActive);
    return null;
  }
}

// Or use PureComponent because it defines shouldComponentUpdate
class RenderBodyCloseModalHandler extends PureComponent {
  render() {
    const { closeModal, isModalActive } = this.props;
    toggleEventListener(document.body, "click", closeModal, isModalActive);
    return null;
  }
}
```
