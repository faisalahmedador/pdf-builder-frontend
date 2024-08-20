import {cloneHeaderElement, removeEditor, removeHeaderContent, removeSelectedHtml} from "./app";

export function createFunctionPopup(selectedHtml, functions = []) {
  const popupElement = document.getElementById('moveable-popup');

  popupElement.classList.remove('display-none');
  popupElement.classList.add('display-flex');

  const domRect = selectedHtml.getBoundingClientRect();
  const bodyRect = document.getElementById('body').getBoundingClientRect();

  popupElement.style.top = (domRect.top - 60) + 'px';
  popupElement.style.left = (domRect.left - bodyRect.left) + 'px';


  // if(isHeader) {
  //   functions = ['clone']
  // } else {
  //   if(selectedHtml.tagName === 'H4' || selectedHtml.tagName ===  'H6' || selectedHtml.tagName ===  'P' || selectedHtml.tagName ===  'SPAN') {
  //     functions = ['bold', 'size', 'remove'];
  //   } else if(selectedHtml.tagName === 'ARTICLE' || selectedHtml.tagName === 'DIV') {
  //     functions = ['position'];
  //   }
  //
  // }
  functions.forEach((name) => {
    if(name === 'position') {
      const positions = popupElement.querySelectorAll('i[class*="fa-align"]');
      positions.forEach(position => {
        position.classList.remove('display-none');
        position.classList.add('display-flex');
        position.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          selectedHtml.style.textAlign = position.getAttribute('data');
        });
      });
    } else if(name === 'position-flex') {
      const positions = popupElement.querySelectorAll('i[class*="fa-align"]');
      // write a code that will move the html to its linneheights data value
      positions.forEach(position => {
        position.classList.remove('display-none');
        position.classList.add('display-flex');
        position.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();

          const dataAttr = position.getAttribute('data');
          if (dataAttr === 'left') {
            selectedHtml.style.justifyContent = 'flex-start';
          } else if (dataAttr === 'center') {
            selectedHtml.style.justifyContent = 'center';
          } else if (dataAttr === 'right') {
            selectedHtml.style.justifyContent = 'flex-end';
          }
        });
      })

    }else if(name === 'bold') {
      const bold = popupElement.querySelector('.fa-bold');
      bold.classList.remove('display-none');
      bold.classList.add('display-flex');

      bold.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const fontWeight = getComputedStyle(selectedHtml).fontWeight;
        if(Number(fontWeight) > 500 || fontWeight === 'bold' || fontWeight === 'bolder') {
          selectedHtml.style.fontWeight = '400';
        } else {
          selectedHtml.style.fontWeight = '600';
        }
      });
    } else if(name === 'size') {
      const plus = popupElement.querySelector('.fa-plus');
      const minus = popupElement.querySelector('.fa-minus');
      plus.classList.remove('display-none');
      plus.classList.add('display-flex');

      minus.classList.remove('display-none');
      minus.classList.add('display-flex');

      plus.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const fontSize = getComputedStyle(selectedHtml).fontSize;
        if(parseInt(fontSize) >= 10 && parseInt(fontSize) <= 20) {
          selectedHtml.style.fontSize = `${parseInt(fontSize) + 1}px`;
        }
      });

      minus.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const fontSize = getComputedStyle(selectedHtml).fontSize;
        if(parseInt(fontSize) >= 10 && parseInt(fontSize) <= 20) {
          selectedHtml.style.fontSize = `${parseInt(fontSize) - 1}px`;
        }
      });
    } else if(name === 'remove'){
      const remove = popupElement.querySelector('.fa-trash');
      remove.classList.remove('display-none');
      remove.classList.add('display-flex');

      remove.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeSelectedHtml(true);
      });
    } else if(name === 'clone') {
      const clone = popupElement.querySelector('.fa-clone');
      clone.classList.remove('display-none');
      clone.classList.add('display-flex');

      clone.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        cloneHeaderElement();
      });
    }  else if(name === 'remove-header') {
      const trash = popupElement.querySelector('.fa-trash');
      trash.classList.remove('display-none');
      trash.classList.add('display-flex');

      trash.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeHeaderContent()
      });
    } else if(name === 'line-height') {
      const up = popupElement.querySelector('.fa-arrow-up');
      const down = popupElement.querySelector('.fa-arrow-down');
      up.classList.remove('display-none');
      up.classList.add('display-flex');

      down.classList.remove('display-none');
      down.classList.add('display-flex');

      up.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
       const lineHeight = getComputedStyle(selectedHtml).lineHeight;
       selectedHtml.style.lineHeight = `${parseInt(lineHeight) + 1}px`;
      });

      down.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const lineHeight = getComputedStyle(selectedHtml).lineHeight;
        selectedHtml.style.lineHeight = `${parseInt(lineHeight) - 1}px`;
      });
    }
  });
}
