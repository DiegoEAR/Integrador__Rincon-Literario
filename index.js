// Contenedor de produtos
const productsContainer = document.querySelector('.libros__cards__container');
const showMoreBtn = document.querySelector('.btn__load');
// Contenedor de categorias
const categoriesContainer = document.querySelector('.categorias');
const categorieslist = document.querySelectorAll('.categoria');
// Carrito
const cartBtn = document.querySelector('.cart__label');
const cartMenu = document.querySelector('.cart');
// Menu Hamburguesa
const barsMenu = document.querySelector('.navbar__list');
const menuBtn = document.querySelector('.menu__label');
const overlay = document.querySelector('.overlay');


// Funcion para renderizar una lista de productos
const createProductTemplate = (product) => {
    const {id, name, price, autor, libroImg} = product;
    return `
    <div class="card">
        <img class="libroIMG" src=${libroImg}  alt=${name} >
        <h3>${name}</h3>
        <div class="card__text">
            <p>$${price}</p>
            <button
                data-id='${id}'
                data-name='${name}'
                data-price='${price}'
                data-autor='${autor}'
                data-img='${libroImg}'
            ><img src="./img/add-to-cart.png" alt="Agregar al carrito"></button>
        </div>
    </div>
    `
};

//Funcion para averiguar si el indice actual renderizado de la lista de productos es igual al limite de productos
const isLastIndexOf = () => {
    return appState.currentProductsIndex === appState.productsLimit-1;
};

//Funcion para mostrar mas productos ante el click del usuario en el boton 'ver mas'
const showMoreProducts = () => {
    appState.currentProductsIndex += 1;
    let {products, currentProductsIndex} = appState;
    renderProducts(products[currentProductsIndex]);
    if (isLastIndexOf()) {
        showMoreBtn.classList.add('hidden');
    };
};

//Funcion que me permite renderizar nuestra app sin necesidad de escuchar un evento
const renderProducts = (productsList) => {
    productsContainer.innerHTML += productsList
    .map(createProductTemplate)
    .join('');
};

//Funcion para aplicar el filtro cuando se clickea el boton de categoria, si el boton no es de categoria o esta activo, no hace nada
const applyFilter = ({ target }) => {
    if (!isInactiveFilterBtn(target)) return;
    changeFilterState(target);
    productsContainer.innerHTML = '';
    if (appState.activeFilter) {
        renderFilterProducts();
        appState.currentProductsIndex = 0;
        return;
    };
    renderProducts(appState.products[0]);
};

//Renderizar los productos filtrados
const renderFilterProducts = () => {
    const filteredProducts = productsData.filter(
        (product) => product.autor === appState.activeFilter
    );
    renderProducts(filteredProducts);
}; 

const isInactiveFilterBtn = (element) => {
    return (
        element.classList.contains('categoria') &&
        !element.classList.contains('active')
    );
};

//Cambio el estado del filtro
const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.autor;
    changeBtnActiveState(appState.activeFilter);
};

//Funcion para cambiar el estado de los botones de categorias
const changeBtnActiveState = (selectedCategory) => {
    const categorias = [... categorieslist];
    categorias.forEach((categoryBtn) => {
        if (categoryBtn.dataset.autor !== selectedCategory) {
            categoryBtn.classList.remove ('active');
            return;
        }
        categoryBtn.classList.add('active');
    })
};

// Funcion para mostrar u ocultar el boton de ver mas segun corresponda
const setShowMoreVisibility = () => {
    if (!appState.activeFilter) {
        showMoreBtn.classList.remove('hidden')
        return
    }
    showMoreBtn.classList.add('hidden')
};

//Toggle del cart y si esta abierto lo cierra
//Muestra el overlay si no hay nada abierto y se esta abriendo el carrito
const toggleCart = () => {
    //cada vez que el user haga click, va a tener la clase open cart
    cartMenu.classList.toggle('open__cart');
    //chequear si el menu hamburguesa esta abierto, lo cierro y retorno
    if (barsMenu.classList.contains('open__menu')) {
        barsMenu.classList.remove('open__menu');
        return; 
    }
    //si esta cerrado entro a la clase y la cambiamos con toggle
    overlay.classList.toggle('show__overlay');
};

//funcion para mostrarr u oultar el menu hamburguesa y el overlay segun corresponda
const toggleMenu = () => {
    barsMenu.classList.toggle('open__menu');
    if (cartMenu.classList.contains('open__cart')) {
        cartMenu.classList.remove('open__cart');
        return; // siu ya habia algo abierto no se togglea el overlay, por eso return
    }
    overlay.classList.toggle('show__overlay');
};

//funcion para errar el menu o carrito cuando el usuario scrolee
const closeOnScroll = () => {
    if (
        !barsMenu.classList.contains('open__menu') &&
        !cartMenu.classList.contains('open__cart')
        ) {
        return;
    };
    barsMenu.classList.remove('open__menu');
    cartMenu.classList.remove('open__cart');
    overlay.classList.remove('show__overlay');
};

// Funcion inicializadora
const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener('click', showMoreProducts);
    categoriesContainer.addEventListener('click', applyFilter);
    cartBtn.addEventListener('click', toggleCart);
    menuBtn.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', closeOnScroll);
};
init();