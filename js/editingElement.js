import {resetPopup} from "./resetFunctionPopup";
import {createFunctionPopup} from "./utilityFunctions";
import {getPopupElement, getSelectedHtml, getTouchDevice, setSelectedHtml} from "./globalVariables";
import {determineHeaderFunctions, openResizeModal} from "./utilityFunctions";

export function editFooterElement(e) {
  if (!shouldEditElement(e)) return;

  if (getSelectedHtml()) removeSelectedHtml();

  const touchDevice = getTouchDevice();


  if (e.target.classList.contains('qrcode') || e.target.tagName === 'svg' || e.target.tagName === 'path') {
    console.log('qrcode')
    const selectedHtml = document.querySelector('.qrcode');
    setSelectedHtml(selectedHtml);
    openResizeModal(selectedHtml);
  } else if (e.target === e.currentTarget || e.target.tagName === 'ARTICLE') {
    const selectedHtml = document.querySelector('.footer-content');
    setSelectedHtml(selectedHtml);
    createFunctionPopup(['margin', 'position-flex'], 'wrapper');
  } else if (e.target.classList.contains('footer-details') || e.target.tagName === 'P') {
    const selectedHtml = document.querySelector('.footer-details');
    setSelectedHtml(selectedHtml);
  } else if (e.target.tagName === 'SPAN') {
    const selectedHtml = e.target;
    setSelectedHtml(selectedHtml);
    if (!touchDevice) {
      createFunctionPopup(['bold', 'size']);
    }

  }
}

export function editMainElement(e) {
  const touchDevice = getTouchDevice();

  if (!shouldEditElement(e) || touchDevice) return;

  if (getSelectedHtml()) removeSelectedHtml();

  if (e.target === e.currentTarget || e.target.tagName === 'ARTICLE') {
    const selectedHtml = e.currentTarget;
    setSelectedHtml(selectedHtml);
    createFunctionPopup(['margin', 'position']);
  } else if (e.target.classList.contains('moveable')) {
    const selectedHtml = e.target;
    setSelectedHtml(selectedHtml);
  } else if (e.target.classList.contains('prescription-details')) {
    const selectedHtml = e.target;
    setSelectedHtml(selectedHtml);
    createFunctionPopup(['bold', 'size']);
  } else if (e.target.tagName === 'SPAN') {
    const selectedHtml = e.target;
    setSelectedHtml(selectedHtml);
    createFunctionPopup(['bold', 'size']);
  }
}

export function editHeaderElement(event) {
  if (!shouldEditElement(event)) return;

  if (getSelectedHtml()) removeSelectedHtml();

  const selectedHtml = event.currentTarget;
  setSelectedHtml(selectedHtml);
  const functions = determineHeaderFunctions();
  createFunctionPopup(functions, 'wrapper');
}

function shouldEditElement(e) {
  return !(e.target.classList.contains('edit-button') ||
    e.target.classList.contains('drag-button') ||
    e.target.classList.contains('edit-button-container') ||
    e.target.classList.contains('drag-button-container'));
}

export function removeSelectedHtml(clear=false) {
  const htmlSelected = getSelectedHtml();
  if(clear) {
    htmlSelected.parentNode.removeChild(htmlSelected);
  }
  setSelectedHtml('');
  resetPopup(getPopupElement());
}
