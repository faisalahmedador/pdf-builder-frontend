import pdfData from './vendor/pdfInfo';
import { makeMoveable } from './makeMoveablePrescription';
import { makeResizeable } from './makeResizeable';
import { createFunctionPopup } from './openFunctionPopup';
import {resetPopup} from "./resetFunctionPopup";

let selectedHtml = '';
let qrcode = '';
const popupElement = document.getElementById('moveable-popup');

const mainElement = document.getElementById('main-content');
const footerElement = document.getElementById('footer');

footerElement.addEventListener('mousedown', function (e) {
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

    applyButton.addEventListener('click', function (e) {
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

    // Cancel button click event
    cancelButton.addEventListener('click', () => {
      // Hide the modal
      resizeModal.style.display = 'none';
    });
  }
})



document.addEventListener('keydown', function (e) {
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
})




mainElement.addEventListener('mousedown', function(e) {
  if(selectedHtml) {
    removeSelectedHtml();
  }

  if(e.target === e.currentTarget || e.target.tagName === 'ARTICLE') {
    selectedHtml = e.currentTarget;
    selectedHtml.contentEditable = 'true';
    selectedHtml.focus();
    let functions = ['line-height', 'position'];
    createFunctionPopup(selectedHtml, functions);
  }  else if(e.target.classList.contains('moveable')) {
      selectedHtml = e.target;
      makeMoveable(selectedHtml, resetPopup.bind(null, popupElement));

  } else if(e.target.classList.contains('prescription-details')) {
    selectedHtml = e.target;
    selectedHtml.contentEditable = 'true';
    selectedHtml.focus();
    createFunctionPopup(selectedHtml, ['bold', 'size']);
  } else if(e.target.tagName === 'SPAN') {
    selectedHtml = e.target;
    createFunctionPopup(selectedHtml, ['bold', 'size']);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  qrcode = new QRCode(document.querySelector(".qrcode"), {
    width: 80,
    height: 80,
    margin: '10px'
  });
// Initial QR code generation
// with a default message
  qrcode.makeCode(`${pdfData.prescription.rxNumber}`);
})



const headerElement = document.getElementById('header');

headerElement.addEventListener('click', function(event) {

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
});


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

const divider = document.getElementById('resizable-divider');
const leftPanel = document.getElementById('prescription-left');
const rightPanel = document.getElementById('prescription-right');

divider.addEventListener('mousedown', startDragging);

function startDragging(e) {
  document.addEventListener('mousemove', resizePanels);
  document.addEventListener('mouseup', stopDragging);
}

function resizePanels(e) {
  const container = document.getElementById('prescription');
  const containerRect = container.getBoundingClientRect();
  const dividerPosition = e.clientX - containerRect.left;
  const totalWidth = containerRect.width;

  const leftWidth = ((dividerPosition / totalWidth) * 100).toFixed(2);
  const rightWidth = (100 - parseFloat(leftWidth)).toFixed(2);

  leftPanel.style.width = `${leftWidth}%`;
  rightPanel.style.width = `${rightWidth}%`;
}

function stopDragging() {
  document.removeEventListener('mousemove', resizePanels);
  document.removeEventListener('mouseup', stopDragging);
}
