const registered = new WeakMap();
/*
{
  [element]: {
    [type]: [...handlers]
  }
}
*/
function getAlreadyHasHandler(element, type, handler) {
  const handlers = registered.get(element);
  if (handlers) {
    const typeHandlers = handlers[type];
    if (typeHandlers) {
      return typeHandlers.has(handler);
    }
  }
  return false;
}

function findOrCreateHandlersForElement(element, type) {
  const handlers = registered.get(element) || {};
  if (!handlers[type]) handlers[type] = new Set();
  return handlers;
}

function add(element, type, handler) {
  const handlers = findOrCreateHandlersForElement(element, type);
  handlers[type].add(handler);
  registered.set(element, handlers);
  element.addEventListener(type, handler);
}

function remove(element, type, handler) {
  const handlers = registered.get(element);
  handlers[type].delete(handler);
  registered.set(element, handlers);
  element.removeEventListener(type, handler);
}

export default function toggleEventListener(
  element,
  type,
  handler,
  shouldBeBound
) {
  if (arguments.length < 3) throw new TypeError('Not enough arguments');
  if (typeof type !== 'string')
    throw new TypeError('Expected event type to be a string');
  if (typeof handler !== 'function')
    throw new TypeError('Expected event handler to be a function');

  const alreadyHasHandler = getAlreadyHasHandler(element, type, handler);
  // declarative mode
  if (typeof shouldBeBound !== 'undefined') {
    if (shouldBeBound) {
      if (!alreadyHasHandler) add(element, type, handler);
    } else {
      if (alreadyHasHandler) remove(element, type, handler);
    }
  } else {
    // toggling mode
    if (alreadyHasHandler) {
      remove(element, type, handler);
    } else {
      add(element, type, handler);
    }
  }
  return element;
}
