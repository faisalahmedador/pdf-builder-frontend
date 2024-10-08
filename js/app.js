// Detects if the device is touch-enabled
import {editFooterElement, editHeaderElement, editMainElement} from "./editingElement";
import {
  getFooterElement,
  getHeaderElement,
  getMainElement, getProjectInitiated,
  getTouchDevice, setProjectInitiated,
  setQrcode,
  setTouchDevice
} from "./globalVariables";
import {
  appendDragButtons,
  appendEditButtons,
  appendResizeButton,
  applyShrinkToSpans,
  createSpanForParagraph
} from "./utilityFunctions";
import pdfData from "./vendor/pdfInfo";
import {getUrl} from "./vendor/urls";

// Function to initialize event listeners based on device type
function initializeEventListeners() {

  if (getProjectInitiated()) {
    return;
  }

  setProjectInitiated(true);

  const touchDevice = !!(navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);
  setTouchDevice(touchDevice);

  if(touchDevice) {
    enableTouchEventListener();
    applyShrinkToSpans();
  } else {
    enableMouseEventListener();
  }

  console.log(touchDevice);

  console.log('initiated')

  appendEditButtons(touchDevice);
  appendDragButtons(touchDevice);
  appendResizeButton(touchDevice);

// Generate and append QR code only once
  if (!document.querySelector('.qrcode svg')) { // Check if QR code is already appended
    let svgNode = QRCode({
      msg: `${pdfData.prescription.rxNumber}`,
      pad: 5,
    });

    const qrcodeNode = document.querySelector('.qrcode');
    qrcodeNode.appendChild(svgNode);
  }

}

function initiateQrCode() {

}

function enableMouseEventListener() {
  getFooterElement().addEventListener('mousedown', editFooterElement);
  getMainElement().addEventListener('mousedown', editMainElement);
  getHeaderElement().addEventListener('mousedown', editHeaderElement);
}

function enableTouchEventListener() {
  getFooterElement().addEventListener('touchstart', editFooterElement);
  getMainElement().addEventListener('touchstart', editMainElement);
  getHeaderElement().addEventListener('touchstart', editHeaderElement);
}

function onKeyDown(e) {
  const selectedHtml = e.target;
  const paragraphs = selectedHtml.querySelectorAll('p');
  // Process each <p> tag
  paragraphs.forEach(createSpanForParagraph);
}

document.addEventListener('DOMContentLoaded',() => {
  initializeEventListeners()
});
document.addEventListener('keydown', (e) => {
  onKeyDown(e);
});

window.updateConfig = function (){
  const container = document.getElementById('body').cloneNode(true);
  console.log(container)
  // Remove drag buttons
  container.querySelectorAll('.moveable').forEach((element) => {
    const button = element.querySelector('.drag-button-container');
    if (button) {
      element.removeChild(button);
    }
  });

  // Remove edit buttons
  container.querySelectorAll('.editable').forEach((element) => {
    const button = element.querySelector('.edit-button-container');
    if (button) {
      element.removeChild(button);
    }
  });

  // Remove resize button
  const resizeButton = container.querySelector('.resize-button-container');
  if (resizeButton) {
    resizeButton.parentNode.removeChild(resizeButton);
  }


  // Remove 'shrink-span' class from spans if on touch devices
  if (getTouchDevice()) {
    Array.from(container.getElementsByTagName('SPAN')).forEach((span) => {
      span.classList.remove('shrink-span');
    });

    container.querySelectorAll('.moveable').forEach((element) => {
      const button = element.querySelector('.selectable');
      if (button) {
        element.removeChild(button);
      }
    });
  }
  // Prepare and send the PDF generation request\
  const url = `${getUrl(true)}/generatePdf`;
  const header = container.querySelector('#header');
  const footer = container.querySelector('#footer');
  const main = container.querySelector('#main-content');


  const data = {
    templates: {
      header: header.outerHTML,
      footer: footer.innerHTML,
      main: main.innerHTML,
    },
    jsonData: pdfData,
    margin: {
      top: `${document.getElementById('header').offsetHeight + 9 }px`,
      bottom: `${document.getElementById('footer').offsetHeight + 10 }px`,
      left: '10px',
      right: '10px'
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

