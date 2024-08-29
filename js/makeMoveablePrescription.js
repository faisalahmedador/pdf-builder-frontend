function createPlaceholder(selectedHtml) {
  let placeholder = document.createElement('div');
  placeholder.style.height = selectedHtml.clientHeight + 'px';
  placeholder.style.backgroundColor = 'transparent';
  placeholder.style.margin = '10px';
  placeholder.style.border = '1px dotted #c0c0c0'; // Visible placeholder
  selectedHtml.draggable = true;
  return placeholder;
}
export function makeMoveable(selectedHtml, leftParentHtmlElement, rightParentHtmlElement, dragButton, resetPopup) {
  console.log(selectedHtml, leftParentHtmlElement, rightParentHtmlElement, dragButton, resetPopup)

  let placeholder = createPlaceholder(selectedHtml);

  console.log(placeholder)

  function onDragStart(e) {
    e.dataTransfer?.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';

    setTimeout(() => {
      selectedHtml.style.display = 'none';
    }, 0);
  }

  function onTouchStart(e) {
    console.log('on start')
    setTimeout(() => {

      selectedHtml.style.display = 'none';
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    }, 0);
  }

  function onDragEnd(e) {
    console.log('dragEnd::',e)
    if (placeholder.parentNode) {
      selectedHtml.style.display = '';
      placeholder.parentNode.removeChild(placeholder);
    }
  }



  function onTouchEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (placeholder.parentNode) {
      console.log(placeholder.parentNode)
      selectedHtml.style.display = '';
      placeholder.parentNode.replaceChild(selectedHtml, placeholder);
    }
    cleanup();
  }

  function onDragOver(e) {
    resetPopup();
    e.stopPropagation();
    e.preventDefault();

    let target = e.target;

    if (target && target !== selectedHtml && target.classList.contains('moveable')) {
      let bounding = target.getBoundingClientRect();
      let offset = bounding.y + bounding.height / 2;

      if (e.clientY - offset > 0) {
        target.parentNode.insertBefore(placeholder, target.nextSibling);
      } else {
        target.parentNode.insertBefore(placeholder, target);
      }
    }
  }

  function onTouchMove(e) {
    e.preventDefault();

    let target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);


    if (target && target !== selectedHtml && target.classList.contains('moveable')) {
      let bounding = target.getBoundingClientRect();
      let offset = bounding.y + bounding.height / 2;

      if (e.touches[0].clientY - offset > 0) {
        target.parentNode.insertBefore(placeholder, target.nextSibling);
      } else {
        target.parentNode.insertBefore(placeholder, target);
      }
    }
  }

  function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (placeholder.parentNode) {
      placeholder.parentNode.replaceChild(selectedHtml, placeholder);
    }
    cleanup();
  }

  function cleanup() {
    console.log('cleanup')
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    selectedHtml.removeEventListener('dragstart', onDragStart);
    selectedHtml.removeEventListener('dragend', onDragEnd);

    leftParentHtmlElement.removeEventListener('dragover', onDragOver);
    leftParentHtmlElement.removeEventListener('drop', onDrop);
    rightParentHtmlElement.removeEventListener('dragover', onDragOver);
    rightParentHtmlElement.removeEventListener('drop', onDrop);
  }

  selectedHtml.addEventListener('dragstart', onDragStart);
  selectedHtml.addEventListener('dragend', onDragEnd);
  dragButton.addEventListener('touchstart', function (e) {
    console.log(e, 'touchstart')
  });

  leftParentHtmlElement.addEventListener('dragover', onDragOver);
  leftParentHtmlElement.addEventListener('drop', onDrop);
  rightParentHtmlElement.addEventListener('dragover', onDragOver);
  rightParentHtmlElement.addEventListener('drop', onDrop);
}
