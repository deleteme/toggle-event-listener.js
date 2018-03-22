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
  const handlersForElement = getHandlersForElement(element);
  if (handlersForElement) {
    const typeHandlers = handlersForElement[type];
    if (typeHandlers) {
      return typeHandlers.includes(handler);
    }
  }
  return false;
}

function findOrCreateHandlersForElement(element, type) {
  const handlersForElement = getHandlersForElement(element) || {};
  if (!handlersForElement[type]) handlersForElement[type] = [];
  return handlersForElement;
}

function add(element, type, handler) {
  const handlersForElement = findOrCreateHandlersForElement(element, type);
  handlersForElement[type].push(handler);
  registered.set(element, handlersForElement);
  element.addEventListener(type, handler);
}

function remove(element, type, handler) {
  const handlersForElement = getHandlersForElement(element);
  var didRemove = false;
  if (handlersForElement) {
    const typeHandlers = handlersForElement[type];
    if (typeHandlers) {
      const filteredTypeHandlers = typeHandlers.filter(h => h === handler);
      didRemove = filteredTypeHandlers.length !== typeHandlers;
      handlersForElement[type] = filteredTypeHandlers;
      if (handlersForElement[type].length === 0) {
        delete handlersForElement[type];
      }
    }
    if (didRemove) {
      registered.set(element, handlersForElement);
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
