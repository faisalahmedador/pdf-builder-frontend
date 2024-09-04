// import {getPlaceholder, getSelectedHtml, setPlaceholder, setSelectedHtml} from "./globalVariables";
// import {createPlaceholder} from "./utilityFunctions";
// import {cleanup} from "./cleanUp";
//
// let touchMoveTimeout;
// let hasMoved = false;
// let ghostElement;
//
// export function onTouchStart(htmlElement) {
//   console.log("onTouchStart", htmlElement);
//   const selectedHtml = htmlElement;
//   setSelectedHtml(selectedHtml);
//   const placeholder = createPlaceholder(selectedHtml);
//   setPlaceholder(placeholder);
//   hasMoved = false; // Reset movement tracker
//
//   document.addEventListener('touchmove', onThrottledTouchMove);
//   document.addEventListener('touchend', onTouchEnd);
// }
//
// export function onThrottledTouchMove(e) {
//   // Throttle the touchmove event for better performance
//   if (!touchMoveTimeout) {
//     touchMoveTimeout = setTimeout(() => {
//       onTouchMove(e);
//       touchMoveTimeout = null;
//     }, 16); // Approximately 60fps
//   }
// }
//
// export function onTouchMove(e) {
//   e.preventDefault();
//
//   if (!hasMoved) {
//     // Create and display a ghost element only after the first move
//     ghostElement = createGhostElement(getSelectedHtml());
//     document.body.appendChild(ghostElement);
//     hasMoved = true;
//   }
//
//   // Position the ghost element at the touch point
//   const touch = e.touches[0];
//   ghostElement.style.left = `${touch.clientX}px`;
//   ghostElement.style.top = `${touch.clientY}px`;
//
//   const placeholder = getPlaceholder();
//   let target = document.elementFromPoint(touch.clientX, touch.clientY);
//
//   if (target && target !== getSelectedHtml() && target.classList.contains('moveable')) {
//     let bounding = target.getBoundingClientRect();
//     let offset = bounding.y + bounding.height / 2;
//
//     if (touch.clientY - offset > 0) {
//       target.parentNode.insertBefore(placeholder, target.nextSibling);
//     } else {
//       target.parentNode.insertBefore(placeholder, target);
//     }
//   }
// }
//
// export function onTouchEnd(e) {
//   e.stopPropagation();
//   e.preventDefault();
//
//   if (ghostElement) {
//     ghostElement.remove(); // Remove the ghost element when touch ends
//   }
//
//   const selectedHtml = getSelectedHtml();
//
//   if (!hasMoved) {
//     // If the user didn't move, ensure the element is still visible
//     selectedHtml.style.display = '';
//   } else {
//     const placeholder = getPlaceholder();
//     if (placeholder.parentNode) {
//       selectedHtml.style.display = '';
//       placeholder.parentNode.replaceChild(selectedHtml, placeholder);
//     }
//   }
//
//   cleanup();
// }
//
// function createGhostElement(htmlElement) {
//   const ghost = htmlElement.cloneNode(true);
//   ghost.style.position = 'absolute';
//   ghost.style.pointerEvents = 'none'; // Prevent it from blocking other elements
//   ghost.style.opacity = '0.7';
//   ghost.style.transform = 'scale(0.95)'; // Slightly smaller to indicate it's a drag element
//   ghost.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
//   return ghost;
// }
