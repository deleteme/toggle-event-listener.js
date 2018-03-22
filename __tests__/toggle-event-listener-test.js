import toggleEventListener from '../toggle-event-listener.js';

describe('toggleEventListener()', () => {
  it('should return the element', () => {
    expect.assertions(1);
    const element = document.createElement('div');
    const handler = jest.fn();
    expect(toggleEventListener(element, 'click', handler)).toBe(element);
  });

  it('should add the event handler if one is not already added.', () => {
    expect.assertions(1);
    const element = document.createElement('div');
    const handler = jest.fn();
    toggleEventListener(element, 'click', handler);
    element.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });
  it('should be able to add handlers of different types.', () => {
    expect.assertions(2);
    const element = document.createElement('div');
    const handleClick = jest.fn();
    const handleMouseMove = jest.fn();
    toggleEventListener(element, 'click', handleClick);
    toggleEventListener(element, 'mousemove', handleMouseMove);
    element.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleMouseMove).toHaveBeenCalledTimes(0);
  });
  it('should remove the event handler if one is already added.', () => {
    expect.assertions(1);
    const element = document.createElement('div');
    const handler = jest.fn();
    toggleEventListener(element, 'click', handler);
    toggleEventListener(element, 'click', handler);
    element.click();
    expect(handler).toHaveBeenCalledTimes(0);
  });

  describe('with declarative truthy state', () => {
    it('should add an event handler', () => {
      expect.assertions(1);
      const element = document.createElement('div');
      const handler = jest.fn();
      toggleEventListener(element, 'click', handler, true);
      element.click();
      expect(handler).toHaveBeenCalledTimes(1);
    });
    it('should only add one event handler', () => {
      expect.assertions(1);
      const element = document.createElement('div');
      const handler = jest.fn();
      toggleEventListener(element, 'click', handler, true);
      toggleEventListener(element, 'click', handler, true);
      element.click();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
  describe('with declarative falsey state', () => {
    it('should remove an event handler', () => {
      expect.assertions(1);
      const element = document.createElement('div');
      const handler = jest.fn();
      toggleEventListener(element, 'click', handler, true);
      toggleEventListener(element, 'click', handler, false);
      toggleEventListener(element, 'click', handler, 0);
      element.click();
      expect(handler).toHaveBeenCalledTimes(0);
    });
    it('should not add the handler', () => {
      expect.assertions(1);
      const element = document.createElement('div');
      const handler = jest.fn();
      toggleEventListener(element, 'click', handler, false);
      element.click();
      expect(handler).toHaveBeenCalledTimes(0);
    });
  });
});
