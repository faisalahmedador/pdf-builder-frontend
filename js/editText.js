import {appendEditButtons, createFunctionPopup, removeAndReassignEditButtonsListeners} from "./utilityFunctions";
import {removeAllContentEditable} from "./utilityFunctions";
import {getPopupElement, getSelectedHtml, setSelectedHtml} from "./globalVariables";
import {resetPopup} from "./resetFunctionPopup";

export function editTextForTouchDevice(htmlElement, event) {
  event.preventDefault();
  event.stopPropagation();

  const selectedHtmlId = htmlElement.getAttribute('id') || 'content';
  console.log(selectedHtmlId)

  const applyButton = document.getElementById('applyEdit');
  const cancelButton = document.getElementById('cancelEdit');
  const editPopup = document.getElementById('editContentContainer');

  applyButton.addEventListener('click', applyAfterEdit);
  cancelButton.addEventListener('click', cancelAfterEdit);

  function applyAfterEdit() {
    reassignElements();
    reset();
    removeListeners();
    resetPopup(getPopupElement())
  }

  function cancelAfterEdit() {
    reassignElements();
    reset();
    removeListeners();
    resetPopup(getPopupElement());
  }

  function removeListeners() {
    applyButton.removeEventListener('click', applyAfterEdit);
    cancelButton.removeEventListener('click', cancelAfterEdit);
  }

  resetPopup(getPopupElement());

  openPopUp();

  function getClonedHtmlWithoutEditButton() {
    // Clone the original element
    const clonedElement = htmlElement.cloneNode(true);
    if(!clonedElement.getAttribute('id')) {
      clonedElement.setAttribute('id', selectedHtmlId);
    }
    // Remove all button elements from the cloned element
    const buttons = clonedElement.querySelectorAll('.edit-button-container');
    buttons.forEach(button => button.remove());

    const selection = clonedElement.querySelectorAll('.selectable');
    selection.forEach(selection => selection.remove());

    return clonedElement;
  }

  function reassignElements() {
    // Get the current buttons from the original htmlElement
    const buttons = Array.from(htmlElement.querySelectorAll('button'));
    const selection = Array.from(htmlElement.querySelectorAll('select'));

    console.log(editPopup)

    // Replace the htmlElement's innerHTML with the edited content (excluding buttons)
    const content = editPopup.querySelector( `#${selectedHtmlId}`);
    if(content.getAttribute('id') === 'content') {
      content.removeAttribute('id');
    }
    content.contentEditable = "false";
    content.classList.remove('area-selector');
    content.removeEventListener('click', onElementClick);
    const allSpans = content.getElementsByTagName('SPAN');
    Object.keys(allSpans).forEach(span => {
      allSpans[span].classList.add('shrink-span');
    })
    // Re-attach the original buttons to their respective positions
    buttons.forEach(button => {
      content.appendChild(button);
    });

    selection.forEach(selection => content.appendChild(selection));
    htmlElement.parentNode.replaceChild(content, htmlElement);
    console.log(htmlElement.parentNode)
    removeAndReassignEditButtonsListeners(content);

    setSelectedHtml('');
  }


  function reset() {
    const editContent = editPopup.querySelector(`#${selectedHtmlId}`);
    console.log(editPopup)
    if(editContent) {
      editPopup.removeChild(editContent);
    }
    editPopup.style.display = 'none';
    editPopup.style.height ='';
    editPopup.style.margin = '';
  }

  function openPopUp() {
    editPopup.style.display = 'block';
    // Set the editContent to the cloned element's innerHTML without buttons
    const clonedElement = getClonedHtmlWithoutEditButton();
    editPopup.insertBefore(clonedElement, document.getElementById('applyEdit'));
    console.log(editPopup)
    const allSpans = clonedElement.getElementsByTagName('SPAN');
    Object.keys(allSpans).forEach(span => {
      allSpans[span].classList.remove('shrink-span');
    })
    clonedElement.classList.add('area-selector');
    clonedElement.contentEditable = "true";
    clonedElement.focus();
    clonedElement.addEventListener('click', onElementClick);
    setSelectedHtml(clonedElement);
    createFunctionPopup(['bold', 'padding', 'position']);
  }
}

function onElementClick(e) {
  e.preventDefault();
  resetPopup(getPopupElement());
  if(!getSelectedHtml()) return;
  const prescriptionElement = getSelectedHtml()?.querySelector('.prescription-details');
  const prescriptionHeader = getSelectedHtml()?.querySelector('.prescription-content-header');
  const prescriptionWrapper = getSelectedHtml()?.querySelector('.prescription-content-wrapper');

  if(e.target === prescriptionElement || e.target.parentNode.classList.contains('prescription-details')) {
    setSelectedHtml(prescriptionElement);
    createFunctionPopup(['bold', 'padding']);
  } else if(e.target === prescriptionHeader) {
    setSelectedHtml(prescriptionHeader);
    createFunctionPopup(['bold', 'padding', 'position'])
  } else if(e.target === prescriptionWrapper) {
    setSelectedHtml(prescriptionWrapper);
    createFunctionPopup(['bold', 'padding', 'position'])
  } else {
    console.log(e.target)
    setSelectedHtml(e.target);
    createFunctionPopup(['bold', 'padding']);
  }


}

export function editTextForMouseDevice(htmlElement, event) {
  event.preventDefault();
  event.stopPropagation();
  const selectedHtml = htmlElement;
  setSelectedHtml(selectedHtml);
  removeAllContentEditable();
  selectedHtml.contentEditable = 'true';
  selectedHtml.focus();
  createFunctionPopup(['bold', 'size']);
}
