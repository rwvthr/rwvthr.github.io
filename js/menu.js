document.addEventListener("DOMContentLoaded", function () {
    const menuShow = document.getElementById('menu-show');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            menuShow.classList.add('active');
        } else {
            menuShow.classList.remove('active');
        }

        // Fecha os dois menus ao rolar
        document.getElementById('itens-fixo').classList.remove('aberto');
        document.getElementById('hamburger-fixo').innerHTML = '&#9776;';
        document.getElementById('itens-show').classList.remove('aberto');
        document.getElementById('hamburger-show').innerHTML = '&#9776;';
    });

    // Hambúrguer do menu fixo
    const hambFixo = document.getElementById('hamburger-fixo');
    const itensFixo = document.getElementById('itens-fixo');

    hambFixo.addEventListener('click', function () {
        const aberto = itensFixo.classList.toggle('aberto');
        hambFixo.innerHTML = aberto ? '&#10005;' : '&#9776;';
    });

    // Hambúrguer do menu que desce
    const hambShow = document.getElementById('hamburger-show');
    const itensShow = document.getElementById('itens-show');

    hambShow.addEventListener('click', function () {
        const aberto = itensShow.classList.toggle('aberto');
        hambShow.innerHTML = aberto ? '&#10005;' : '&#9776;';
    });

    // Fecha ao clicar em qualquer link
    document.querySelectorAll('.menu-itens a').forEach(function (link) {
        link.addEventListener('click', function () {
            itensFixo.classList.remove('aberto');
            itensShow.classList.remove('aberto');
            hambFixo.innerHTML = '&#9776;';
            hambShow.innerHTML = '&#9776;';
        });
    });
});

