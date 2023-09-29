const socket = io();  

const renderProducts = async () => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const limit = paramsUrl.get('limit');
    const page = paramsUrl.get('page');
    const sort = paramsUrl.get('sort');
    const query = paramsUrl.get('query');

    let url = 'api/products?';

    if (limit) {
        url += `limit=${limit}&`;
    } 
    if (page) {
        url += `page=${page}&`;
    } 
    if (sort) {
        url += `sort=${sort}&`;
    } 
    if (query) {
        url += `query=${query}&`;
    } 

    try {
        const response = await fetch(url);

        if (response.ok) {
            const products = await response.json(); 
            console.log(products)
            const ulProduct = document.getElementById('products');
            let ul = '';

            products.forEach((product) => {
                ul += `<li id="${product.id}">
                    <p>Id: ${product.id}</p>
                    <a href="/products/${product.id}">${product.title}</a>
                    <p>Categoría: ${product.category}</p>
                    <p>Precio: ${product.price}</p>
                    <button class="add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>
                </li>`;
            });

            ulProduct.innerHTML = ul;

            const totalPages = products.totalPages;
            const hasNextPage = products.hasNextPage;
            const hasPrevPage = products.hasPrevPage;
            const nextPage = products.nextPage;
            const prevPage = products.prevPage;

            const divPaginas = document.getElementById('divPaginas');

            if(hasNextPage){
                const linkToNextPage = document.createElement('a');
                linkToNextPage.href = `products?page=${nextPage}`
                linkToNextPage.innerHTML = 'Next Page'
                divPaginas.appendChild(linkToNextPage) 
            }
            if(hasPrevPage){
                const linkToPrevPage = document.createElement('a');
                linkToPrevPage.href = `products?page=${prevPage}`
                linkToPrevPage.innerHTML = 'Prev Page'
                divPaginas.appendChild(linkToPrevPage) 
            }
        } else {
            console.error('Error en la solicitud:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
};

renderProducts();

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.getAttribute('data-product-id');
        const cartId = '1'; 

        try {
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:{ quantity: 1 } 
            });

            if (response.ok) {
                console.log('Producto agregado al carrito con éxito');
                alert('Producto agregado al carrito con éxito');
            } else {
                console.error('Error al agregar el producto al carrito:', response.statusText);
                alert('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error de red al agregar el producto al carrito:', error);
            alert('Error de red al agregar el producto al carrito');
        }
    }
});
