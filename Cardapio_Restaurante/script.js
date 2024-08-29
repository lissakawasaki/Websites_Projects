document.addEventListener('DOMContentLoaded', () => {
    const favoritos = [];
    const listaFavoritos = document.getElementById('lista-favoritos');

    document.querySelectorAll('.favoritar').forEach(button => {
        button.addEventListener('click', () => {
            const prato = button.closest('.prato');
            const pratoId = prato.getAttribute('data-id');
            const pratoNome = prato.querySelector('h3').textContent;
            
            if (favoritos.includes(pratoId)) {
                alert('Já está nos favoritos!');
                return;
            }

            favoritos.push(pratoId);
            atualizarFavoritos();
        });
    });

    function atualizarFavoritos() {
        listaFavoritos.innerHTML = '';

        favoritos.forEach(id => {
            const pratoElement = document.querySelector(`.prato[data-id="${id}"]`);
            const pratoNome = pratoElement.querySelector('h3').textContent;
            const item = document.createElement('li');
            item.innerHTML = `
                <h3>${pratoNome}</h3>
                <button data-id="${id}">Remover</button>
            `;
            listaFavoritos.appendChild(item);
            item.querySelector('button').addEventListener('click', () => {
                removerFavorito(id);
            });
        });
    }

    function removerFavorito(id) {
        const index = favoritos.indexOf(id);
        if (index !== -1) {
            favoritos.splice(index, 1);
            atualizarFavoritos();
        }
    }
});
