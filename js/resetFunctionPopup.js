export function resetPopup(popupElement) {
  if(popupElement.classList?.contains('display-flex')){
    popupElement.classList.remove('display-flex');
    popupElement.classList.add('display-none');
  }

  const positions = popupElement.querySelectorAll('i[class*="fa"]');
  positions.forEach(position => {
    if(position.classList?.contains('display-flex')) {
      position.classList.remove('display-flex');
      position.classList.add('display-none');
    }

    const newPosition = position.cloneNode(true);
    position.parentNode.replaceChild(newPosition, position);
  });
}
