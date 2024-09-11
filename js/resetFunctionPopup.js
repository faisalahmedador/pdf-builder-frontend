export function resetPopup(popupElement) {
  if(popupElement.classList?.contains('display-flex')){
    popupElement.classList.remove('display-flex');
    popupElement.classList.add('display-none');
  }

  const movableItem = popupElement.querySelectorAll('.moveable-able-item');
  const movableDropdown = popupElement.querySelectorAll('.moveable-able-dropdown-item');
  resetElement(movableItem, true);
  resetElement(movableDropdown, false);
}

function resetElement(elements, cloneNode = false) {
  elements.forEach(element => {
    if(element.classList?.contains('display-flex')) {
      element.classList.remove('display-flex');
      element.classList.add('display-none');
    }

    if(cloneNode) {
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
    }
  });
}
