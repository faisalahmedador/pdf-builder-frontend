import pdfData from './vendor/pdfInfo';
import { createFunctionPopup } from './openFunctionPopup';
import {resetPopup} from "./resetFunctionPopup";

let selectedHtml = '';
let qrcode = '';
let touchDevice = false;
let placeholder = '';
const popupElement = document.getElementById('moveable-popup');
const mainElement = document.getElementById('main-content');
const footerElement = document.getElementById('footer');
const headerElement = document.getElementById('header');
const leftPanel = document.getElementById('prescription-left');
const rightPanel = document.getElementById('prescription-right');
const divider = document.getElementById('resizable-divider');
const dragButton = document.getElementById('dragButton');

function enableMouseEventListener() {
  footerElement.addEventListener('mousedown', editFooterElement);
  mainElement.addEventListener('mousedown', editMainElement);
  headerElement.addEventListener('mousedown', editHeaderElement);
  divider.addEventListener('mousedown', startResizing);
  dragButton.addEventListener('mousedown', onDragStart);
}

function onDragStart(e) {
  console.log(e, 'onDragStart')
  placeholder = createPlaceholder(selectedHtml);
  selectedHtml.addEventListener('dragstart', onDragging);
  selectedHtml.addEventListener('dragend', onDragEnd);
  leftPanel.addEventListener('dragover', onDragOver);
  leftPanel.addEventListener('drop', onDrop);
  rightPanel.addEventListener('dragover', onDragOver);
  rightPanel.addEventListener('drop', onDrop);
}



function onDragging(e) {
  console.log(selectedHtml)
  e.dataTransfer?.setData('text/plain', '');
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => {
    selectedHtml.style.display = 'none';
  }, 0);
}

function onDragEnd(e) {
  console.log('dragEnd::',placeholder)
  if (placeholder.parentNode) {
    selectedHtml.style.display = '';
    placeholder.parentNode.removeChild(placeholder);
  }
}

function onDragOver(e) {
  resetPopup(popupElement);
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

function onDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  if (placeholder.parentNode) {
    selectedHtml.style.display = '';
    placeholder.parentNode.replaceChild(selectedHtml, placeholder);
  }
  cleanup();
}

function enableTouchEventListener() {
  footerElement.addEventListener('touchstart', editFooterElement);
  mainElement.addEventListener('touchstart', editMainElement);
  headerElement.addEventListener('touchstart', editHeaderElement);
  divider.addEventListener('touchstart', startResizing);
  dragButton.addEventListener('touchstart', onTouchStart);
}

function createPlaceholder(selectedHtml) {
  let placeholder = document.createElement('div');
  placeholder.style.height = selectedHtml.clientHeight + 'px';
  placeholder.style.backgroundColor = 'transparent';
  placeholder.style.margin = '10px';
  placeholder.style.border = '1px dotted #c0c0c0'; // Visible placeholder
  selectedHtml.draggable = true;
  return placeholder;
}

function onTouchStart(e) {
  console.log(selectedHtml)
  placeholder = createPlaceholder(selectedHtml);
  setTimeout(() => {
    // e.dataTransfer?.setData('text/plain', '');
    // e.dataTransfer.effectAllowed = 'move';
    selectedHtml.style.display = 'none';
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  }, 0);
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

function cleanup() {
  if(touchDevice) {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  } else {
    dragButton.removeEventListener('dragstart', onDragStart);
    dragButton.removeEventListener('dragend', onDragEnd);
    leftPanel.removeEventListener('dragover', onDragOver);
    leftPanel.removeEventListener('drop', onDrop);
    rightPanel.removeEventListener('dragover', onDragOver);
    rightPanel.removeEventListener('drop', onDrop);
  }
  placeholder = '';
  selectedHtml.removeChild(dragButton)
  dragButton.classList.remove('display-block');
  dragButton.classList.add('display-none');
  dragButton.style = "cursor: move; z-index: 2";
  console.log('cleanup')
}


document.addEventListener('keydown', onKeyDown);

document.addEventListener('DOMContentLoaded', onInitiate)

function editFooterElement(e) {
  if(selectedHtml) {
    removeSelectedHtml();
  }
  console.log(e.target)

  if(e.target === e.currentTarget || e.target.tagName === 'ARTICLE') {
    selectedHtml = document.querySelector('.footer-content');
    createFunctionPopup(selectedHtml, ['line-height', 'position-flex'])
  } else if(e.target.classList.contains('footer-details') || e.target.tagName === 'P') {
    selectedHtml = document.querySelector('.footer-details');
    selectedHtml.contentEditable = 'true';
    selectedHtml.focus();
    createFunctionPopup(selectedHtml, ['bold', 'size']);
  } else if(e.target.tagName === 'SPAN') {
    selectedHtml = e.target;
    createFunctionPopup(selectedHtml, ['bold', 'size'])
  } else if(e.target.tagName === 'IMG') {
    selectedHtml = e.target;
    const resizeModal = document.getElementById('resizeModal');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const applyButton = document.getElementById('applyResize');
    const cancelButton = document.getElementById('cancelResize');


    const bodyRect = document.getElementById('body').getBoundingClientRect();

    resizeModal.style.display = 'block';
    const domRect = footerElement.getBoundingClientRect();
    console.log(domRect, bodyRect)
    resizeModal.style.top = (domRect.top - 200) + 'px';
    resizeModal.style.left = (domRect.left - bodyRect.left) + 'px';
    // Set initial values in inputs
    widthInput.value = selectedHtml.offsetWidth;
    heightInput.value = selectedHtml.offsetHeight;

    applyButton.addEventListener('mousedown', function (e) {
      const newWidth = parseInt(widthInput.value, 10);
      const newHeight = parseInt(heightInput.value, 10);

      // Update the QR code with new dimensions
      qrcode.clear(); // Clear the old QR code
      let qrElement = document.querySelector(".qrcode");
      qrElement.innerHTML = '';


      qrcode = new QRCode(qrElement, {
        width: newWidth,
        height: newHeight,
        margin: 10
      });
      qrcode.makeCode(`${pdfData.prescription.rxNumber}`);

      // Hide the modal
      resizeModal.style.display = 'none';
      selectedHtml = ''
    })

    // Cancel button mousedown event
    cancelButton.addEventListener('mousedown', () => {
      // Hide the modal
      resizeModal.style.display = 'none';
    });
  }
}

function editMainElement(e) {
  // Check if dragButton is visible
  if (dragButton.classList.contains('display-block')) {
    if(e.target.classList.contains('drag-button')) {
      return
    }
    cleanup();
  }

  if(selectedHtml) {
    removeSelectedHtml();
  }

  console.log(e.target.classList.contains('moveable'))
  if(e.target === e.currentTarget || e.target.tagName === 'ARTICLE') {
    selectedHtml = e.currentTarget;
    selectedHtml.contentEditable = 'true';
    selectedHtml.focus();
    let functions = ['line-height', 'position'];
    createFunctionPopup(selectedHtml, functions);
  }  else if(e.target.classList.contains('moveable')) {
    selectedHtml = e.target;
      selectedHtml.appendChild(dragButton)
      dragButton.classList.remove('display-none');
      dragButton.classList.add('display-block');
      dragButton.style.position = 'absolute';
      dragButton.style.top = selectedHtml.offsetTop + 'px';
      dragButton.style.left = selectedHtml.offsetLeft + 'px';
      console.log(selectedHtml)


  } else if(e.target.classList.contains('prescription-details')) {
    selectedHtml = e.target;
    selectedHtml.contentEditable = 'true';
    selectedHtml.focus();
    createFunctionPopup(selectedHtml, ['bold', 'size']);
  } else if(e.target.tagName === 'SPAN') {
    selectedHtml = e.target;
    createFunctionPopup(selectedHtml, ['bold', 'size']);
  }

  console.log(selectedHtml)
}

function editHeaderElement(event) {

  if(selectedHtml) {
    removeSelectedHtml();
  }

  if (event.target === event.currentTarget || event.target.tagName === 'DIV' || event.target.tagName === 'P') {
    // Clicked directly on the header (not on any child element)
    selectedHtml = headerElement;
    selectedHtml.contentEditable = "true";
    selectedHtml.focus();

    let functions = [];
    const headerContainer = document.getElementById('header-content');
    if(!headerContainer.hasAttribute('elements')) {
      functions.push('clone');
      headerContainer.setAttribute('elements', '1');
    } else {
      const elements = headerContainer.getAttribute('elements')
      if(Number(elements) < 2) {
        functions.push('clone');
      } else if(Number(elements) ===2) {
        functions.push('remove-header');
      }
    }

    functions = [...functions, 'position', 'line-height'];

    createFunctionPopup(selectedHtml, [...functions]);

  } else {
    selectedHtml = event.target;
    createFunctionPopup(selectedHtml, ['bold', 'size']);
  }
}

function onKeyDown(e) {
  setTimeout(() => {
    const selectedElement = e.target;
    console.log(selectedElement)
    const appPTags = selectedElement.querySelectorAll('p');
    const createSpan = (tag) => {
      const infoSpan = document.createElement('span');
      const tagHtml = tag.innerHTML;
      tag.innerHTML = '';
      infoSpan.innerHTML = tagHtml;
      tag.appendChild(infoSpan);
    }

    appPTags.forEach((tag) => {
      if (!tag.querySelector('span') || tag.textContent.trim() === '') {
        createSpan(tag);
      }
    }, 0)
  })

  console.log(e.target)
}

function onInitiate(e) {
  console.log(e)
  qrcode = new QRCode(document.querySelector(".qrcode"), {
    width: 80,
    height: 80,
    margin: '10px'
  });


  touchDevice = !!(navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);
  touchDevice ? enableTouchEventListener() : enableMouseEventListener();
  console.log(touchDevice)
// Initial QR code generation
// with a default message
  qrcode.makeCode(`${pdfData.prescription.rxNumber}`);
}

function startResizing(e) {
  document.addEventListener('mousemove', resizePanels);
  document.addEventListener('touchmove', resizePanels);
  document.addEventListener('mouseup', stopDragging);
  document.addEventListener('touchend', stopDragging);
}

function resizePanels(e) {
  const container = document.getElementById('prescription');
  const containerRect = container.getBoundingClientRect();

  // Determine the position based on touch or mouse event
  let dividerPosition;
  if (e.type === 'mousemove') {
    dividerPosition = e.clientX - containerRect.left;
  } else if (e.type === 'touchmove') {
    dividerPosition = e.touches[0].clientX - containerRect.left;
  }

  const totalWidth = containerRect.width;
  const leftWidth = ((dividerPosition / totalWidth) * 100).toFixed(2);
  const rightWidth = (100 - parseFloat(leftWidth)).toFixed(2);

  // Assuming you have leftPanel and rightPanel already defined
  leftPanel.style.width = `${leftWidth}%`;
  rightPanel.style.width = `${rightWidth}%`;
}

function stopDragging() {
  // Removing both mouse and touch events
  document.removeEventListener('mousemove', resizePanels);
  document.removeEventListener('touchmove', resizePanels);
  document.removeEventListener('mouseup', stopDragging);
  document.removeEventListener('touchend', stopDragging);
}


window.updateConfig = function (){
  const url = 'http://localhost:3000/generatePdf';
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  const main = document.getElementById('main-content');

  const data = {
    templates: {
      header: header.outerHTML,
      footer: footer.innerHTML,
      main: main.innerHTML,
    },
    jsonData: pdfData,
    margin: {
      top: `${header.offsetHeight + 30}px`,
      bottom: `${footer.offsetHeight + 40}px`,
      left: '20px',
      right: '20px'
    }
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  };

  fetch(url, requestOptions)
    .then(response => response.blob())
    .then(blob => {
      const _url = window.URL.createObjectURL(blob);
      window.open(_url, '_blank');
    });
};

export function cloneHeaderElement() {
  const newElement = document.querySelector('.editor-selector').cloneNode(true);
  newElement.classList.add('editor-selector');
  const headerContainer = document.getElementById('header-content');
  headerContainer.style.display = 'flex';
  headerContainer.style.justifyContent = 'space-between';
  headerContainer.style.alignItems = 'center';
  headerContainer.setAttribute('elements', '2');
  resetPopup(popupElement);
  createFunctionPopup(selectedHtml, ['line-height','position', 'remove-header']);
  headerContainer.appendChild(newElement);
}


export function removeSelectedHtml(clear=false) {
  if(clear) {
    selectedHtml.parentNode.removeChild(selectedHtml);
  }
  selectedHtml = '';
  resetPopup(popupElement);
}

export function removeHeaderContent() {
  const elements = document.querySelectorAll('.editor-selector');
  const headerContainer = document.getElementById('header-content');
  headerContainer.removeChild(elements[elements.length - 1]);

  selectedHtml.style.display = '';
  selectedHtml.style.justifyContent = '';
  selectedHtml.style.alignItems = '';
  selectedHtml.setAttribute('elements', '1');
  resetPopup(popupElement);
  createFunctionPopup(selectedHtml, ['clone', 'position', 'line-height']);
}
