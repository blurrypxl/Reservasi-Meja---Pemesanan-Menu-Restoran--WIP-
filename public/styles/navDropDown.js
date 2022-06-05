function toggleFunc(element, clss) {
    element.onclick = function() {
        console.log(element);
        element.classList.toggle(clss);
    };
}

const list = document.querySelectorAll('.list');
list.forEach(function(nav) {
    toggleFunc(nav, 'open');
});

const profilBox = document.querySelector('.profil-box');
toggleFunc(profilBox, 'open');
