// Function to handle 'position'
import {resetPopup} from "./resetFunctionPopup";
import {createFunctionPopup, determineHeaderFunctions} from "./utilityFunctions";
import {getPopupElement, getSelectedHtml, getTouchDevice} from "./globalVariables";
import {editTextForMouseDevice, editTextForTouchDevice} from "./editText";
import {createEditButton} from "./utilityFunctions";

export function handlePosition(popupElement) {
  const positions = popupElement.querySelectorAll('i[class*="fa-align"]');
  positions.forEach(position => {
    position.classList.remove('display-none');
    position.classList.add('display-flex');
    position.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      getSelectedHtml().style.textAlign = position.getAttribute('data');
    });
  });
}

// Function to handle 'position-flex'
export function handlePositionFlex(popupElement) {
  const positions = popupElement.querySelectorAll('i[class*="fa-align"]');
  positions.forEach(position => {
    position.classList.remove('display-none');
    position.classList.add('display-flex');
    position.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const dataAttr = position.getAttribute('data');
      if (dataAttr === 'left') {
        getSelectedHtml().style.justifyContent = 'flex-start';
      } else if (dataAttr === 'center') {
        getSelectedHtml().style.justifyContent = 'center';
      } else if (dataAttr === 'right') {
        getSelectedHtml().style.justifyContent = 'flex-end';
      }
    });
  });
}

// Function to handle 'bold'
export function handleBold(popupElement) {
  const bold = popupElement.querySelector('.fa-bold');
  bold.classList.remove('display-none');
  bold.classList.add('display-flex');

  bold.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const fontWeight = getComputedStyle(getSelectedHtml()).fontWeight;
    if (Number(fontWeight) > 500 || fontWeight === 'bold' || fontWeight === 'bolder') {
      getSelectedHtml().style.fontWeight = '400';
    } else {
      getSelectedHtml().style.fontWeight = '600';
    }
  });
}

// Function to handle 'size'
export function handleSize(popupElement) {
  const plus = popupElement.querySelector('.fa-plus');
  const minus = popupElement.querySelector('.fa-minus');
  plus.classList.remove('display-none');
  plus.classList.add('display-flex');

  minus.classList.remove('display-none');
  minus.classList.add('display-flex');

  plus.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const fontSize = getComputedStyle(getSelectedHtml()).fontSize;
    if (parseInt(fontSize) >= 10 && parseInt(fontSize) <= 20) {
      getSelectedHtml().style.fontSize = `${parseInt(fontSize) + 1}px`;
    }
  });

  minus.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const fontSize = getComputedStyle(getSelectedHtml()).fontSize;
    if (parseInt(fontSize) >= 10 && parseInt(fontSize) <= 20) {
      getSelectedHtml().style.fontSize = `${parseInt(fontSize) - 1}px`;
    }
  });
}

// Function to handle 'remove'
export function handleRemove(popupElement) {
  const remove = popupElement.querySelector('.fa-trash');
  remove.classList.remove('display-none');
  remove.classList.add('display-flex');

  remove.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    // removeSelectedHtml(true);
  });
}

// Function to handle 'clone'
export function handleClone(popupElement) {
  const clone = popupElement.querySelector('.fa-clone');
  clone.classList.remove('display-none');
  clone.classList.add('display-flex');

  clone.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    cloneHeaderElement();
  });
}

// Function to handle 'remove-header'
export function handleRemoveHeader(popupElement) {
  const trash = popupElement.querySelector('.fa-trash');
  trash.classList.remove('display-none');
  trash.classList.add('display-flex');

  trash.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    removeHeaderContent();
  });
}

// Function to handle 'padding'
export function handlePadding(popupElement) {
  const up = popupElement.querySelector('.fa-arrow-up');
  const down = popupElement.querySelector('.fa-arrow-down');
  up.classList.remove('display-none');
  up.classList.add('display-flex');

  down.classList.remove('display-none');
  down.classList.add('display-flex');

  const selectedHtml = getSelectedHtml();
  console.log(selectedHtml);
  up.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const paddingTop = parseInt(getComputedStyle(selectedHtml).paddingTop);
    const paddingRight = parseInt(getComputedStyle(selectedHtml).paddingRight);

    selectedHtml.style.paddingTop = `${paddingTop + 1}px`;
    selectedHtml.style.paddingRight = `${paddingRight + 1}px`;
  });

  down.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const paddingTop = parseInt(getComputedStyle(selectedHtml).paddingTop);
    const paddingRight = parseInt(getComputedStyle(selectedHtml).paddingRight);

    selectedHtml.style.paddingTop = `${paddingTop - 1}px`;
    selectedHtml.style.paddingRight = `${paddingRight - 1}px`;
  });
}

function cloneHeaderElement() {
  const newElement = document.querySelector('.editor-selector').cloneNode(true);
  newElement.classList.add('editor-selector', 'editable');

  const button = newElement.querySelector('.edit-button-container');
  getTouchDevice() ? button.addEventListener('touchstart', editTextForTouchDevice.bind(null, newElement)) :
    button.addEventListener('mousedown', editTextForMouseDevice.bind(null, newElement));

  const headerContainer = document.getElementById('header-content');
  headerContainer.style.display = 'flex';
  headerContainer.style.justifyContent = 'space-between';
  headerContainer.style.alignItems = 'center';
  headerContainer.setAttribute('elements', '2');
  resetPopup(getPopupElement());
  createFunctionPopup(determineHeaderFunctions());
  headerContainer.appendChild(newElement);
}


function removeHeaderContent() {
  const elements = document.querySelectorAll('.editor-selector');
  const headerContainer = document.getElementById('header-content');
  headerContainer.removeChild(elements[elements.length - 1]);

  headerContainer.style.display = '';
  headerContainer.style.justifyContent = '';
  headerContainer.style.alignItems = '';
  headerContainer.setAttribute('elements', '1');
  resetPopup(getPopupElement());
  createFunctionPopup(determineHeaderFunctions());
}
