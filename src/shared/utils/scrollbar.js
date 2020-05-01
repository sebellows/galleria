export function getScrollbarWidth() {
  const scrollDiv = document.createElement('div');

  scrollDiv.className = 'modal-scrollbar-measure';

  document.body.appendChild(scrollDiv);

  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

export function adjustScrollContainer(parent, scrollbarWidth = 15) {
  if (parent.scrollHeight > document.documentElement.clientHeight) {
    if (!isOverflowing()) parent.style.paddingLeft = `${scrollbarWidth}px`;
    else parent.style.paddingLeft = '';
  } else if (isOverflowing()) {
    parent.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    parent.style.paddingRight = '';
  }
}

export function resetScrollContainer(parentRef) {
  if (parentRef) {
    parentRef.style.paddingLeft = '';
    parentRef.style.paddingRight = '';
  }
}

// was `checkScrollbar`
export function isOverflowing() {
  const { left, right, height } = document.body.getBoundingClientRect();

  // Extra check for body.height needed for stacked modals
  return left + right < window.innerWidth || height > window.innerHeight;
}

export function setScrollbar(scrollbarWidth = 15) {
  if (isOverflowing()) {
    document.body.__paddingChangedForModal = [];
    document.body.__marginChangedForModal = [];

    // Adjust body padding
    const actualPadding = document.body.style.paddingRight;
    const calculatedPadding = window.getComputedStyle(document.body).paddingRight;

    document.body.setAttribute('data-padding-right', actualPadding);
    document.body.style.paddingRight = `${parseFloat(calculatedPadding) + scrollbarWidth}px`;
  }
}

export function resetScrollbar(parentRef) {
  if (document.body.__paddingChangedForModal) {
    // Restore fixed content padding
    document.body.__paddingChangedForModal.forEach((el) => {
      if (el.hasAttribute('data-padding-right')) {
        el.style.paddingRight = el.getAttribute('data-padding-right') || '';
        el.removeAttribute('data-padding-right');
      }
    });
  }

  if (document.body.__marginChangedForModal) {
    // Restore sticky content and navbar-toggler margin
    document.body.__marginChangedForModal.forEach((el) => {
      if (el.hasAttribute('data-margin-right')) {
        el.style.marginRight = el.getAttribute('data-margin-right') || '';
        el.removeAttribute('data-margin-right');
      }
    });
  }

  document.body.__paddingChangedForModal = null;
  document.body.__marginChangedForModal = null;

  // Restore body padding
  if (document.body.hasAttribute('data-padding-right')) {
    document.body.style.paddingRight = document.body.getAttribute('data-padding-right') || '';
    document.body.removeAttribute('data-padding-right');
  }

  resetScrollContainer(parentRef);
}
