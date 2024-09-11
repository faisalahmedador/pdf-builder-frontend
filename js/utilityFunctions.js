import {getFooterElement, getPopupElement, getSelectedHtml, setSelectedHtml} from "./globalVariables";
import {onDragStart} from "./drag&drop";
import {editTextForMouseDevice, editTextForTouchDevice} from "./editText";
import {startResizing} from "./resizing";
import {
  handleBold,
  handleClone, handleLineHeight, handleMargin,
  handlePosition,
  handlePositionFlex,
  handleRemove, handleRemoveHeader,
  handleSize
} from "./functionsForPopup";
import pdfData from "./vendor/pdfInfo";

export function createFunctionPopup(functions = [], type = 'content') {
  const popupElement = getPopupElement();
  popupElement.classList.remove('display-none');
  popupElement.classList.add('display-flex');

  console.log(type)

  const domRect = getSelectedHtml()?.getBoundingClientRect() || 30;
  const bodyRect = document.getElementById('body')?.getBoundingClientRect() || 30;

  console.log(domRect.right - bodyRect.right)

  if (type === 'content') {
    popupElement.style.top = (domRect.top - 50) + 'px';
    if (domRect.right - bodyRect.right < -40) {
      popupElement.style.right = (domRect.right - 70) + 'px';
    } else {
      popupElement.style.right = (domRect.right - bodyRect.right + 50) + 'px';
    }
  } else {
    popupElement.style.top = (domRect.top + 20) + 'px';
    popupElement.style.right = (domRect.right - bodyRect.right + 100) + 'px';
  }




    functions.forEach((name) => {
      switch (name) {
        case 'line-height':
          handleLineHeight(popupElement);
          break;
        case 'margin':
          handleMargin(popupElement);
          break;
        case 'position':
          handlePosition(popupElement);
          break;
        case 'position-flex':
          handlePositionFlex(popupElement);
          break;
        case 'bold':
          handleBold(popupElement);
          break;
        case 'size':
          handleSize(popupElement);
          break;
        case 'remove':
          handleRemove(popupElement);
          break;
        case 'clone':
          handleClone(popupElement);
          break;
        case 'remove-header':
          handleRemoveHeader(popupElement);
          break;


        default:
          console.warn(`Unknown function name: ${name}`);
      }
    });
}


export function createPlaceholder(selectedHtml) {
  const ghost = selectedHtml.cloneNode(true);
  ghost.style.position = 'absolute';
  ghost.style.pointerEvents = 'none'; // Prevent it from blocking other elements
  ghost.style.opacity = '0.7';
  ghost.style.transform = 'scale(0.95)'; // Slightly smaller to indicate it's a drag element
  ghost.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
  return ghost;
}


export function createDragButton() {
  const button = document.createElement('button');
  button.classList.add('drag-button-container');
  button.style = "cursor: move; z-index: 1; font-size: 10px; padding: 5px; margin: 5px";
  button.innerHTML = 'Swap <i class="fa fa-arrows-alt drag-button"></i>';
  return button;
}


export function createEditButton() {
  const button = document.createElement('button');
  button.classList.add('edit-button-container');
  button.style = "cursor: pointer; z-index: 1; background: transparent; border: none; font-size: 10px; padding: 5px; margin: 5px; position: absolute; right: 0; top: -5px;";
  button.innerHTML = '<i class="fa fa-pencil-alt edit-button"></i>';
  return button;
}

function makeSelectOptionButton(selectedElement) {
  const newMoveAbleElements = document.querySelectorAll('.moveable');
  const selectOptionButton = createSelectOptionButton(newMoveAbleElements, selectedElement);
  selectOptionButton.addEventListener('change', onChange.bind(null, selectedElement));
  selectedElement.append(selectOptionButton);
}

function removeSelectOptionButton(selectedElement) {
  const selectOptionButton = selectedElement.querySelector('.selectable');
  if (selectOptionButton) {
    selectedElement.removeChild(selectOptionButton);
  }
}

export function createSelectOptionButton(elements, selectedElement) {
  const select = document.createElement('select');
  select.style = "cursor: pointer; z-index: 2; font-size: 10px; padding: 5px; margin: 5px";
  select.classList.add('selectable');
  // Create a placeholder option
  const placeholderOption = document.createElement('option');
  placeholderOption.textContent = 'Swap with';
  placeholderOption.value = ''; // Empty value
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  select.appendChild(placeholderOption);

  console.log(elements, selectedElement);

  elements.forEach((element) => {
    if (selectedElement !== element) {
      const option = document.createElement('option');
      option.value = element.id;
      option.textContent = element.id;
      select.appendChild(option);
    }
  })
  return select;
}

function onChange(element, event) {
  const newMoveableElements = document.querySelectorAll('.moveable');
  const swapWithItem = document.getElementById(event.target.value);

  let elementClone, swapWithClone;

  newMoveableElements.forEach((elementItem) => {
    if (elementItem === swapWithItem) {
      // Clone the swapWithItem element
      swapWithClone = elementItem.cloneNode(true);
      swapWithItem.classList.add('swapping');
    } else if (elementItem === element) {
      // Clone the original element
      elementClone = elementItem.cloneNode(true);
      element.classList.add('swapping');
    }
  });

  // Insert the clones at the correct positions
  if (elementClone && swapWithClone) {


    // Reattach the select option buttons and their event listeners
    setTimeout(() => {
      // Insert elementClone before swapWithItem
      swapWithItem.parentNode.insertBefore(elementClone, swapWithItem);

      // Insert swapWithClone before the original element
      element.parentNode.insertBefore(swapWithClone, element);

      // Remove the original elements after the clones have been inserted
      element.remove();
      swapWithItem.remove();
      removeSelectOptionButton(elementClone);
      makeSelectOptionButton(elementClone);
      removeSelectOptionButton(swapWithClone);
      makeSelectOptionButton(swapWithClone);

      removeAndReassignEditButtonsListeners(elementClone);
      removeAndReassignEditButtonsListeners(swapWithClone);
    }, 100);
  } else {
    console.error('Cloning failed, unable to swap elements.');
  }
}

export function appendDragButtons(touchDevice) {
  console.log('initiated drag Button')
  const moveableElements = document.querySelectorAll('.moveable');
  moveableElements.forEach((element) => {
    if (touchDevice) {
      makeSelectOptionButton(element);
    } else {
      const button = createDragButton();
      button.addEventListener('mousedown', onDragStart.bind(null, element))
      element.appendChild(button);
    }

  });
}


export function appendEditButtons(touchDevice) {
  const editableElements = document.querySelectorAll('.editable');
  console.log(editableElements)
  editableElements.forEach((element) => {

    element.style.position = 'relative';
    const button = createEditButton();
    touchDevice ? button.addEventListener('touchstart', editTextForTouchDevice.bind(null, element)) :
      button.addEventListener('mousedown', editTextForMouseDevice.bind(null, element));
    element.appendChild(button);
  });
}

export function removeAndReassignEditButtonsListeners(element) {
  const editableElements = document.querySelectorAll('.editable');
  editableElements.forEach(editableElement => {
    if(editableElement === element) {
      const button = editableElement.querySelector('.edit-button-container');
      if(button) {
        const newButton = createEditButton();
        newButton.addEventListener('touchstart', editTextForTouchDevice.bind(null, editableElement));
        editableElement.appendChild(newButton);
        button.parentNode.replaceChild(newButton, button);
      }
    }
  })
}

export function appendResizeButton(touchDevice) {
  const resizeButton = document.querySelector('.resize-button-container');
  touchDevice ? resizeButton.addEventListener('touchstart', startResizing) : resizeButton.addEventListener('mousedown', startResizing);
}


export function removeSelectedHtml() {
  const selectedHtml = getSelectedHtml();
  if (selectedHtml) {
    selectedHtml.classList.remove('selected');
  }
}

export function determineHeaderFunctions() {

  const header = document.getElementById('header-content');

  if (!header.getAttribute('elements') || header.getAttribute('elements') === "1") {
    return ['line-height','margin','position', 'clone'];
  }
  return ['line-height','margin','position', 'remove-header'];
}

export function openResizeModal(imageElement) {
  const resizeModal = document.getElementById('resizeModal');
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const applyButton = document.getElementById('applyResize');
  const cancelButton = document.getElementById('cancelResize');

  console.log(resizeModal)


  const bodyRect = document.getElementById('body').getBoundingClientRect();

  resizeModal.style.display = 'block';
  const domRect = getFooterElement().getBoundingClientRect();
  console.log(domRect, bodyRect)
  resizeModal.style.top = (domRect.top - 200) + 'px';
  resizeModal.style.left = (domRect.left - bodyRect.left) + 'px';
  // Set initial values in inputs
  widthInput.value = getSelectedHtml().offsetWidth;
  heightInput.value = getSelectedHtml().offsetHeight;

  applyButton.addEventListener('mousedown', function (e) {
    const newWidth = parseInt(widthInput.value, 10);
    const newHeight = parseInt(heightInput.value, 10);

    const qrcodeNode = document.querySelector('.qrcode');
    qrcodeNode.innerHTML = '';

    qrcodeNode.style.width = newWidth + 'px';
    qrcodeNode.style.height = newHeight + 'px';

    let svgNode = QRCode({
      msg: `${pdfData.prescription.rxNumber}`,
      pad: 5,
    });

    qrcodeNode.appendChild(svgNode);
    // Hide the modal
    resizeModal.style.display = 'none';
    setSelectedHtml('')
  })

  // Cancel button mousedown event
  cancelButton.addEventListener('mousedown', () => {
    // Hide the modal
    resizeModal.style.display = 'none';
  });
}

// Function to create and insert a <span> around the inner HTML of a <p> tag
export function createSpanForParagraph(paragraph) {
  // Check if a <span> already exists or the <p> tag is empty
  if (!paragraph.querySelector('span') && paragraph.textContent.trim() !== '') {
    const infoSpan = document.createElement('span');
    infoSpan.innerHTML = paragraph.innerHTML;
    paragraph.innerHTML = '';
    paragraph.appendChild(infoSpan);
  }
}

export function applyShrinkToSpans() {
  const allSpans = document.getElementsByTagName('SPAN');
  Object.keys(allSpans).forEach(key => {
    const span = allSpans[key];
    span.classList.add('shrink-span');
  });
}

export function removeAllContentEditable() {
  const editableElements = document.querySelectorAll('.editable');
  editableElements.forEach((element) => {
    element.contentEditable = 'false';
  })
}
