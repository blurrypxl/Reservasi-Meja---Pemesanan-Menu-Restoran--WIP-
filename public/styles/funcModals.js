let modalContainer = document.querySelectorAll('.modal-container');
let btnModals = document.querySelectorAll('.btn-modals');
let closeModal = document.querySelectorAll('.close-modal');

function toggleBtn(element, className) {
  element.classList.toggle(className);
};

// Open Modals
for (let i = 0; i < btnModals.length; i++) {
  btnModals[i].onclick = () => {
    console.log(i);
    toggleBtn(modalContainer[i], "open");
  };
}
// Close Modals
for (let i = 0; i < closeModal.length; i++) {
  closeModal[i].onclick = () => {
    console.log(i);
    toggleBtn(modalContainer[i], "open");
  };
}
