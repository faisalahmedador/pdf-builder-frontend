export function makeMoveable(selectedHtml, resetPopup) {

  const leftParentId = 'prescription-left';
  const rightParentId = 'prescription-right';

  const leftParentHtmlElement = document.getElementById(leftParentId);
  const rightParentHtmlElement = document.getElementById(rightParentId);
  let placeholder = document.createElement('div');
  placeholder.style.height = selectedHtml.clientHeight + 'px';
  placeholder.style.backgroundColor = 'transparent';
  placeholder.style.margin = '10px';
  placeholder.style.border = '1px dotted #c0c0c0'// Visible placeholder
  selectedHtml.draggable = true;

  function onDragStart(e) {
    // Store the dragged element in the dataTransfer object
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';
    // Hide the original element
    setTimeout(() => {
      selectedHtml.style.display = 'none';
    }, 0);
  }

  function onDragEnd(e) {
    // Clean up
    selectedHtml.style.display = ''; // Show the element again
    if (placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
    // console.log('on drag end::', e)
    // Cleanup and remove listeners if needed
    leftParentHtmlElement.removeEventListener('dragover', onDragOver);
    leftParentHtmlElement.removeEventListener('drop', onDrop);
    rightParentHtmlElement.removeEventListener('dragover', onDragOver);
    rightParentHtmlElement.removeEventListener('drop', onDrop);
  }

  function onDragOver(e) {
    resetPopup(); // No need to pass popupElement, it's already bound
    e.stopPropagation();
    e.preventDefault();

    let target = e.target;

    if (target && target !== selectedHtml && target.classList.contains('moveable')) {
      let bounding = target.getBoundingClientRect();
      let offset = bounding.y + bounding.height / 2;

      // Determine whether to place the placeholder before or after the target
      if (e.clientY - offset > 0) {
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
  }

  selectedHtml.addEventListener('dragstart', onDragStart);
  selectedHtml.addEventListener('dragend', onDragEnd);

  leftParentHtmlElement.addEventListener('dragover', onDragOver);
  leftParentHtmlElement.addEventListener("drop", onDrop);
  rightParentHtmlElement.addEventListener('dragover', onDragOver);
  rightParentHtmlElement.addEventListener("drop", onDrop);

  document.addEventListener('mouseup', function () {
    selectedHtml.removeEventListener('dragstart', onDragStart);
    selectedHtml.removeEventListener('dragend', onDragEnd);
  });
}
