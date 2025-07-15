document.querySelectorAll('.card-content').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-src');
      if (!src) return; // skip if no content to load
      createModalFromCard(src);
    });
  });
  
  function createModalFromCard(src) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-header">
        <div>Preview</div>
        <div class="close-button">&times;</div>
      </div>
      <div class="modal-content">
        ${src ? getModalContent(src) : '<p>[Empty modal]</p>'}
      </div>
    `;
    document.body.appendChild(modal);
  
    modal.querySelector('.close-button').addEventListener('click', () => {
      modal.remove();
    });
  
    makeDraggable(modal);
  }
  
  function getModalContent(src) {
    const ext = src.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return `<embed src="${src}" width="100%" height="100%" type="application/pdf">`;
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
      return `<img src="${src}" style="width:100%; height:auto;">`;
    } else {
      return `<p>Unsupported file type</p>`;
    }
  }
  
  function makeDraggable(el) {
    const header = el.querySelector('.modal-header');
    let isDragging = false;
    let offsetX, offsetY;
  
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      el.style.zIndex = Date.now(); // bring to front
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
  