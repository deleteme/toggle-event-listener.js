const registered = new WeakMap();
/*
{
  [element]: {
    [type]: [...handlers]
  }
}
*/
function getHandlersForElement(element) {
  return registered.get(element);
}

function getAlreadyHasHandler(element, type, handler) {
  const handlers = getHandlersForElement(element);
  if (handlers) {
    const typeHandlers = handlers[type];
    if (typeHandlers) {
      return typeHandlers.includes(handler);
    }
  }
  return false;
}

function findOrCreateHandlersForElement(element, type) {
  const handlers = getHandlersForElement(element) || {};
  if (!handlers[type]) handlers[type] = [];
  return handlers;
}

function add(element, type, handler) {
  const handlers = findOrCreateHandlersForElement(element, type);
  handlers[type].push(handler);
  registered.set(element, handlers);
  element.addEventListener(type, handler);
}

function remove(element, type, handler) {
  const handlers = getHandlersForElement(element);
  var didRemove = false;
  if (handlers) {
    const typeHandlers = handlers[type];
    if (typeHandlers) {
      const filteredTypeHandlers = typeHandlers.filter(h => h === handler);
      didRemove = filteredTypeHandlers.length !== typeHandlers;
      handlers[type] = filteredTypeHandlers;
      if (handlers[type].length === 0) {
        delete handlers[type];
      }
    }
    if (didRemove) {
      registered.set(element, handlers);
      element.removeEventListener(type, handler);
    }
  }
}

export default function toggleEventListener(
  element,
  type,
  handler,
  shouldBeBound
) {
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
