// Function to handle 'position'
import {resetPopup} from "./resetFunctionPopup";
import {createFunctionPopup, determineHeaderFunctions} from "./utilityFunctions";
import {getPopupElement, getSelectedHtml, getTouchDevice} from "./globalVariables";
import {editTextForMouseDevice, editTextForTouchDevice} from "./editText";
import {createEditButton} from "./utilityFunctions";

export function handlePosition(popupElement) {
  const selectPosition = document.querySelector('.fa-align-justify');
  const positions = document.querySelectorAll('i[class*="fa-align"]');
  selectPosition.classList.remove('display-none');
  selectPosition.classList.add('display-flex');
  selectPosition.addEventListener('mousedown', (e) => {
    positions.forEach(position => {
      position.classList.remove('display-none');
      position.classList.add('display-flex');
      position.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        getSelectedHtml().style.textAlign = position.getAttribute('data');
      });
    });
  })
}

// Function to handle 'position-flex'
export function handlePositionFlex(popupElement) {
  const selectPosition = document.querySelector('.fa-align-justify');
  const positions = document.querySelectorAll('i[class*="fa-align"]');
  selectPosition.classList.remove('display-none');
  selectPosition.classList.add('display-flex');
  selectPosition.addEventListener('mousedown', (e) => {
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
  })

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
  const size = document.querySelector('.fa-text-height');
  const sizeIncrease = document.querySelector('.fa-plus-circle');
  const sizeDecrease = document.querySelector('.fa-minus-circle');

  size.classList.remove('display-none');
  size.classList.add('display-flex');


  size.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    sizeIncrease.classList.remove('display-none');
    sizeIncrease.classList.add('display-flex');

    sizeDecrease.classList.remove('display-none');
    sizeDecrease.classList.add('display-flex');

    sizeIncrease.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const fontSize = getComputedStyle(getSelectedHtml()).fontSize;
      console.log(fontSize)
      getSelectedHtml().style.fontSize = `${parseFloat(fontSize) + .5}px`;
    });

    sizeDecrease.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const fontSize = getComputedStyle(getSelectedHtml()).fontSize;
      getSelectedHtml().style.fontSize = `${parseFloat(fontSize) - .5}px`;
    });
  })
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
export function handleMargin(popupElement) {
  const margin = document.querySelector('.fa-xmarks-lines');
  const marginIncrease = document.querySelector('.fa-plus');
  const marginDecrease = document.querySelector('.fa-minus');

  margin.classList.remove('display-none');
  margin.classList.add('display-flex');

  margin.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    marginIncrease.classList.remove('display-none');
    marginIncrease.classList.add('display-flex');

    marginDecrease.classList.remove('display-none');
    marginDecrease.classList.add('display-flex');

    const selectedHtml = getSelectedHtml();
    marginIncrease.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const marginLeft = parseInt(getComputedStyle(selectedHtml).marginLeft);
      const marginRight = parseInt(getComputedStyle(selectedHtml).marginRight);

      selectedHtml.style.marginLeft = `${marginLeft + 1}px`;
      selectedHtml.style.marginRight = `${marginRight + 1}px`;
    });

    marginDecrease.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const marginLeft = parseInt(getComputedStyle(selectedHtml).marginLeft);
      const marginRight = parseInt(getComputedStyle(selectedHtml).marginRight);

      selectedHtml.style.marginLeft = `${marginLeft - 1}px`;
      selectedHtml.style.marginRight = `${marginRight - 1}px`;
    });
  })

}

export function handleLineHeight() {
  const lineHeight = document.querySelector('.fa-arrow-down-up-across-line');
  const upLine = document.querySelector('.fa-arrows-up-to-line');
  const downLine = document.querySelector('.fa-arrows-down-to-line');

  lineHeight.classList.remove('display-none');
  lineHeight.classList.add('display-flex');

  lineHeight.addEventListener('mousedown', (e) => {
    e.preventDefault();
    upLine.classList.remove('display-none');
    upLine.classList.add('display-flex');

    downLine.classList.remove('display-none');
    downLine.classList.add('display-flex');

    const selectedHtml = getSelectedHtml();
    console.log(selectedHtml);
    upLine.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const lineHeight = parseInt(getComputedStyle(selectedHtml).lineHeight);

      selectedHtml.style.lineHeight = `${lineHeight + 1}px`;
    });

    downLine.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const lineHeight = parseInt(getComputedStyle(selectedHtml).lineHeight);
      selectedHtml.style.lineHeight = `${lineHeight - 1}px`;
    });
  })
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
  createFunctionPopup(determineHeaderFunctions(), 'wrapper');
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
  createFunctionPopup(determineHeaderFunctions(), 'wrapper');
}
