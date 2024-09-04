import {getLeftPanel, getSelectedHtml, getTouchDevice, setPlaceholder} from "./globalVariables";
import {onThrottledTouchMove, onTouchEnd, onTouchMove} from "./touchEvents";
import {onDragEnd, onDragging, onDragOver, onDrop} from "./drag&drop";
import {appendDragButtons, appendEditButtons} from "./utilityFunctions";

export function cleanup() {
  const touchDevice = getTouchDevice();
  if (touchDevice) {
    document.removeEventListener('touchmove', onThrottledTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  } else {
    const selectedHtml = getSelectedHtml();
    const leftPanel = getLeftPanel();
    const rightPanel = getSelectedHtml();
    selectedHtml.removeEventListener('dragstart', onDragging);
    selectedHtml.removeEventListener('dragend', onDragEnd);
    leftPanel.removeEventListener('dragover', onDragOver);
    leftPanel.removeEventListener('drop', onDrop);
    rightPanel.removeEventListener('dragover', onDragOver);
    rightPanel.removeEventListener('drop', onDrop);
  }

  setPlaceholder('');

  // // Reassign buttons after cleanup
  // appendDragButtons(touchDevice);
  // appendEditButtons(touchDevice);
}
