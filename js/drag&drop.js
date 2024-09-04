import {
  getLeftPanel,
  getPlaceholder,
  getRightPanel,
  getSelectedHtml,
  setPlaceholder,
  setSelectedHtml
} from "./globalVariables";
import {createPlaceholder} from "./utilityFunctions";
import {cleanup} from "./cleanUp";

export function onDragStart(htmlElement) {
  setSelectedHtml(htmlElement);
  const selectedHtml = getSelectedHtml();
  setPlaceholder()
  const placeholder = createPlaceholder(selectedHtml);
  setPlaceholder(placeholder);
  const leftPanel = getLeftPanel();
  const rightPanel = getRightPanel();
  selectedHtml.addEventListener('dragstart', onDragging);
  selectedHtml.addEventListener('dragend', onDragEnd);
  leftPanel.addEventListener('dragover', onDragOver);
  leftPanel.addEventListener('drop', onDrop);
  rightPanel.addEventListener('dragover', onDragOver);
  rightPanel.addEventListener('drop', onDrop);
}

export function onDragging(e) {
  e.dataTransfer?.setData('text/plain', '');
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => {
    getSelectedHtml().style.display = 'none';
  }, 0);
}

export function onDragEnd(e) {
  const placeholder = getPlaceholder();
  const selectedHtml = getSelectedHtml();
  if (placeholder.parentNode) {
    selectedHtml.style.display = '';
    placeholder.parentNode.removeChild(placeholder);
  }
  cleanup();
}

export function onDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  const placeholder = getPlaceholder();
  if (e.target && e.target !== getSelectedHtml() && e.target.classList.contains('moveable')) {
    let bounding = e.target.getBoundingClientRect();
    let offset = bounding.y + bounding.height / 2;
    if (e.clientY - offset > 0) {
      e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
    } else {
      e.target.parentNode.insertBefore(placeholder, e.target);
    }
  }
}

export function onDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  const placeholder = getPlaceholder();
  const selectedHtml = getSelectedHtml();
  if (placeholder.parentNode) {
    selectedHtml.style.display = '';
    placeholder.parentNode.replaceChild(selectedHtml, placeholder);
  }
  cleanup();
}

