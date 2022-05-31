const list = document.querySelectorAll('.list');

list.forEach(function(nav) {
    nav.addEventListener('click', function() {
        console.log(nav);
        nav.classList.toggle('open');
    });
});