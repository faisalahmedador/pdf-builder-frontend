import {getLeftPanel, getRightPanel} from "./globalVariables";

export function startResizing(e) {
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
  getLeftPanel().style.width = `${leftWidth}%`;
  getRightPanel().style.width = `${rightWidth}%`;
}

function stopDragging() {
  // Removing both mouse and touch events
  document.removeEventListener('mousemove', resizePanels);
  document.removeEventListener('touchmove', resizePanels);
  document.removeEventListener('mouseup', stopDragging);
  document.removeEventListener('touchend', stopDragging);
}
