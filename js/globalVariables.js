// Define the global variables
let touchDevice = false;
let selectedHtml = '';
let qrcode = '';
let placeholder = '';

const popupElement = document.getElementById('moveable-popup');
const leftPanel = document.getElementById('prescription-left');
const rightPanel = document.getElementById('prescription-right');
const mainElement = document.getElementById('main-content');
const footerElement = document.getElementById('footer');
const headerElement = document.getElementById('header');

export function getMainElement() {
  return mainElement;
}

export function getFooterElement() {
  return footerElement;
}

export function getHeaderElement() {
  return headerElement;
}

export function getPopupElement() {
  return popupElement;
}

export function getLeftPanel() {
  return leftPanel;
}

export function getRightPanel() {
  return rightPanel;
}

// Getter and Setter for touchDevice
export function getTouchDevice() {
  return touchDevice;
}

export function setTouchDevice(value) {
  touchDevice = value;
}

// Getter and Setter for selectedHtml
export function getSelectedHtml() {
  return selectedHtml;
}

export function setSelectedHtml(element) {
  selectedHtml = element;
}

// Getter and Setter for qrcode
export function getQrcode() {
  return qrcode;
}

export function setQrcode(value) {
  qrcode = value;
}

// Getter and Setter for placeholder
export function getPlaceholder() {
  return placeholder;
}

export function setPlaceholder(element) {
  placeholder = element;
}
