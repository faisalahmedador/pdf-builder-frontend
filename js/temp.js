const pdfData = {
  header: {
    name: 'Dr. Hasan Shariar',
    institution: 'DVM(CVASU)',
    mobile: '0167076699',
    email: 'dr.admin@gmail.com',
    bveNumber: '1010'
  },
  basicInfo: {
    farmerName: "Jomir Ali",
    address: "pabna",
    date: "2024-01-01"
  },
  animalInfo: [
    {
      name: "cattle",
      no: "459, 233"
    }
  ],
  findings: [
    {
      name: "NH3",
      value: '2.00ppm'
    }
  ],
  medication: [
    {
      name: "Andopan Powder",
      details: "5gm + 0 + 5gm"
    }
  ],
  advice: ["abcd", "edf"],
  diagnosis: ['Bacterial Infection', 'Foot Rot']
}

function addResizeHandlers(htmlElement, resizeElement) {

  const elements = resizeElement.querySelectorAll('.moveable-controls');
  console.log(elements)
  const minimum_size = 20;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;

  elements.forEach(element => {

    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      original_width = parseFloat(getComputedStyle(htmlElement, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(htmlElement, null).getPropertyValue('height').replace('px', ''));
      original_x = htmlElement.getBoundingClientRect().left;
      original_y = htmlElement.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })

    function resize(e) {

      if (element.getAttribute('direction') === 'bottom-right') {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          htmlElement.style.width = width + 'px'
        }
        if (height > minimum_size) {
          htmlElement.style.height = height + 'px'
        }
      }
      else if (element.getAttribute('direction') === 'bottom-left') {
        const height = original_height + (e.pageY - original_mouse_y)
        const width = original_width - (e.pageX - original_mouse_x)
        if (height > minimum_size) {
          htmlElement.style.height = height + 'px'
        }
        if (width > minimum_size) {
          htmlElement.style.width = width + 'px'
          htmlElement.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
      }
      else if (element.getAttribute('direction') === 'top-right') {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          htmlElement.style.width = width + 'px'
        }
        if (height > minimum_size) {
          htmlElement.style.height = height + 'px'
          htmlElement.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
      else {
        const width = original_width - (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          htmlElement.style.width = width + 'px'
          htmlElement.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
        if (height > minimum_size) {
          htmlElement.style.height = height + 'px'
          resizeElement.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
          htmlElement.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
    }

    function stopResize() {
      window.removeEventListener('mousemove', resize)
    }


  });
}


function makeResizable(componentId) {
  console.log(componentId)
  const htmlElement = document.getElementById(componentId);

  let resizeable = document.createElement('div');

  // Move the h2 and h4 elements into the resizeable div
  while (htmlElement.firstChild) {
    resizeable.appendChild(htmlElement.firstChild);
  }

// Append the resizeable div back into the article element
  htmlElement.appendChild(resizeable);

  resizeable.style.width = `${htmlElement.offsetWidth + 15}px`;
  resizeable.style.height = `${htmlElement.offsetHeight + 15}px`;
  resizeable.style.border = '2px solid #c0c0c0';
  let tx = (htmlElement.getBoundingClientRect().left + window.scrollX) - 15;
  let ty = (htmlElement.getBoundingClientRect().top + window.scrollY) - 15;
  resizeable.style.top = `${ty}px`;
  resizeable.style.left = `${tx}px`;

  let topLeft = document.createElement('div');

  topLeft.style.position = 'absolute';
  topLeft.classList.add('moveable-controls');
  topLeft.style.top = `0px`;
  topLeft.setAttribute('direction', 'top-left');
  let bottomLeft = document.createElement('div');
  bottomLeft.style.position = 'absolute';
  bottomLeft.classList.add('moveable-controls');
  bottomLeft.style.top = `${htmlElement.offsetHeight - 2}px`;
  bottomLeft.setAttribute('direction', 'bottom-left');
  let topRight = document.createElement('div');
  topRight.style.position = 'absolute';
  topRight.classList.add('moveable-controls');
  topRight.style.left = `${htmlElement.offsetWidth - 2}px`;
  topRight.setAttribute('direction', 'top-right');
  let bottomRight = document.createElement('div');
  bottomRight.style.position = 'absolute';
  bottomRight.classList.add('moveable-controls');
  bottomRight.style.left = `${htmlElement.offsetWidth - 2}px`;
  bottomRight.style.top = `${htmlElement.offsetHeight - 2}px`;
  bottomRight.setAttribute('direction', 'bottom-right');

  resizeable.append(topLeft, topRight, bottomLeft, bottomRight);

  addResizeHandlers(htmlElement, resizeable);

  window.addEventListener('mouseup', function () {
    htmlElement.removeChild(resizeable);
  })
}

window.makeResizable = makeResizable;

function makeMoveable(componentId, leftParentId = 'prescription-left', rightParentId = 'prescription-right') {
  const htmlElement = document.getElementById(componentId);
  const leftParentHtmlElement = document.getElementById(leftParentId);
  const rightParentHtmlElement = document.getElementById(rightParentId);
  htmlElement.style.resize = "both";
  htmlElement.style.overflow = "hidden";
  htmlElement.style.border = "1px solid #00ff95";
  htmlElement.style.cursor = "pointer";
  htmlElement.draggable = true;

  // Define the drag over functions
  function onLeftDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function onRightDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  // Define the drop functions
  function onLeftDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    const targetElement = event.target;
    // OR use event.currentTarget instead:
    // const targetElement = event.currentTarget as HTMLElement;

    if (targetElement && targetElement.appendChild && htmlElement) {
      targetElement.appendChild(htmlElement);
    } else {
      console.error("Target element is not valid or does not support appendChild.");
    }
  }

  function onRightDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    const targetElement = event.target;
    // OR use event.currentTarget instead:
    // const targetElement = event.currentTarget as HTMLElement;

    if (targetElement && targetElement.appendChild && htmlElement) {
      targetElement.appendChild(htmlElement);
    } else {
      console.error("Target element is not valid or does not support appendChild.");
    }
  }

  // Attach the event listeners
  leftParentHtmlElement.addEventListener('dragover', onLeftDragOver);
  leftParentHtmlElement.addEventListener("drop", onLeftDrop);
  rightParentHtmlElement.addEventListener('dragover', onRightDragOver);
  rightParentHtmlElement.addEventListener("drop", onRightDrop);

  // Handle mouseup to remove event listeners
  window.addEventListener('mouseup', function () {
    htmlElement.style.resize = "none";
    htmlElement.style.border = "none";
    htmlElement.style.cursor = "auto";

    // Remove the event listeners
    leftParentHtmlElement.removeEventListener('dragover', onLeftDragOver);
    leftParentHtmlElement.removeEventListener('drop', onLeftDrop);
    rightParentHtmlElement.removeEventListener('dragover', onRightDragOver);
    rightParentHtmlElement.removeEventListener('drop', onRightDrop);
  });

}

function updateConfig() {
  const url = 'http://localhost:3000/generatePdf';
  const header = document.getElementById('header')
  const footer = document.getElementById('footer');
  const main = document.getElementById('prescription');
  const data = {
    templates: {
      header: header.innerHTML,
      footer: footer.innerHTML,
      main: main.innerHTML,
    },
    jsonData: JSON.stringify(pdfData),
    margin: {
      top: `${header.offsetHeight}px`,
      bottom: `${footer.offsetHeight}px`,
      left: '10px',
      right: '10px'
    }
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }

  fetch(url, requestOptions)
    .then(response => response.blob())
    .then(blob => {
      const _url = window.URL.createObjectURL(blob);
      window.open(_url, '_blank');
    })

}
