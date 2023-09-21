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
const productsCart = document.querySelector('.cart__container');
const total = document.querySelector('.total');
const successModal = document.querySelector(".add__modal");
const buyBtn = document.querySelector('.buy__btn');
const deleteBtn = document.querySelector('.delete__btn');


//Renderizar una lista de productos
const createProductTemplate = (product) => {
    const {id, name, price, autor, libroImg } = product;
    return `
    <div class="card">
        <img class="libroIMG" src=${libroImg} alt="Libro de la tienda" />
        <h3>${name}</h3>
        <div class="card__text">
            <p>$${price}</p>
            <button><img 
                data-id=${id}
                data-name=${name}
                data-price=${price}
                data-img=${libroImg} class="btn__add" src="./img/add-to-cart.png" alt="Agregar al carrito"></button>
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
    cartMenu.classList.toggle('open__cart');
    if (barsMenu.classList.contains('open__menu')) {
        barsMenu.classList.remove('open__menu');
        return; 
    }
    overlay.classList.toggle('show__overlay');
};

//funcion para mostrarr u oultar el menu hamburguesa y el overlay segun corresponda
const toggleMenu = () => {
    barsMenu.classList.toggle('open__menu');
    if (cartMenu.classList.contains('open__cart')) {
        cartMenu.classList.remove('open__cart');
        return;
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

//funcion para cerrar el menu hamburguesa o el carrito y ocultar el overlay cuando el usuario hace clik en el overlay`
const closeOnOverlayClick = () => {
    barsMenu.classList.remove('open__menu');
    cartMenu.classList.remove('open__cart');
    overlay.classList.remove('show__overlay');
};

//RENDER DEL CARRITO

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

//funcion para renderizar los productos del carrito o enviar el msg no hay productos
const renderCart = () => {
    if (!cart.length) {
        productsCart.innerHTML =`
        <p class="empty__msg">No hay productos en el carrito.</p>
        `;
        return;
    }
    productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
};

//crear el template de un producto del carrito
const createCartProductTemplate = (cartProduct) => {
    const {id, name, price, img, quantity } = cartProduct;
    return `
    <div class="cart__item">
        <img src=${img} alt="Libro del carrito" />
        <div class="item__info">
            <h3>${name}</h3>
            <span> $${price}</span>
        </div>
        <div class="item__quantity__container">
            <span class="quantity down" data-id=${id}>-</span> 
            <span class="item__quantity">${quantity}</span>
            <span class="quantity up" data-id=${id}>+</span>
        </div>
    </div>
    `
};

//funcion para mostrar el total de la compra
const showCartTotal = () => {
    total.innerHTML = ` $ ${getCartTotal().toFixed(2)}`;
};
//funcion aux para que me traiga el total del carrito
const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0)
};

//logica para agregar al carrito
const addProduct = (e) => {
    if (!e.target.classList.contains('btn__add')) { return };
    const product = createProductData(e.target.dataset);
    if (isExistingCartProduct(product)) {
        addUnitToProduct(product);
        showSuccessModal('Se agregó una unidad del producro al carrito.');
    } else {
        createCartProduct(product);
        showSuccessModal('Se agregó el producto al carrito.');
    };
    updateCartState();
};

//funcion desestructuradora
const createProductData = (product) => {
    const { id, name, price, img } = product;
    return { id, name, price, img };
};

//funion que comprueba si el producto ya fue agregado al carrito
const isExistingCartProduct = (product) => {
    return cart.find((item) => item.id === product.id);
};

//funcion para agregar una unidad al produto que ya tengo en el cart
const addUnitToProduct = (product) => {
    cart = cart.map((cartProduct) => 
        cartProduct.id === product.id
            ? {...cartProduct, quantity: cartProduct.quantity + 1}
            : cartProduct
    );
};

//funcion para darle una devolucion al usuario
const showSuccessModal = (msg) => {
    successModal.classList.add("active__modal");
    successModal.textContent = msg;
    setTimeout(() => {
        successModal.classList.remove("active__modal")
    }, 1500);
};

//creamos un objeto con la ifo del producto que queremos agregar
const createCartProduct = (product) => {
    cart = [...cart, {...product, quantity: 1}];
};

//habilitar o deshabilitar un boton segun corresponda - misma logica, si esl carro esta cavio los saco a ambos`, si hay algo en el cart los habilito.
const disableBtn = (btn) => {
    if (!cart.length) {
        btn.classList.add('disabled');
    } else {
        btn.classList.remove('disabled');
    }
};

//funcion de actualizacion del carro
const updateCartState = () => {
    //guardar arrito en LS
    saveCart();
    //renderizo el carro
    renderCart();
    //mostrar el total
    showCartTotal();
    //Misma funcion para ambos botones
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
};

//Manejo del evento click del boton + de cada producto
const handlePlusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    addUnitToProduct(existingCartProduct);
};

//Manejo del evento click del boton - de cada producto
const handleMinusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    if (existingCartProduct.quantity === 1) {
        if (window.confirm('¿Desea Eliminar este producto del carrito?')) {
            removeProductFromCart(existingCartProduct);
        }
    return;
    }
    substractProductUnit(existingCartProduct);
};

//Quitar una unidad del producto
const substractProductUnit = (existingProduct) => {
    cart = cart.map((product) => {
        return product.id === existingProduct.id
        ? { ...product, quantity: Number(product.quantity) - 1 }
        : product;
    });
};

//Eliminar un producto
const removeProductFromCart = (existingProduct) => {
    cart = cart.filter((product) => product.id !== existingProduct.id);
    updateCartState();
};

//Manejador de eventos a partir de los botones + y -
const handleQuantity = (e) => {
    if (e.target.classList.contains('down')) {
        handleMinusBtnEvent(e.target.dataset.id);
    } else if (e.target.classList.contains('up')) {
        handlePlusBtnEvent(e.target.dataset.id);
    }
    updateCartState();
};

//Vaciar el carrito
const resetCartItems = () => {
    cart = [];
    updateCartState();
};

//Completar la compra y vaciar el carrito
const completeCartAction = (confirmMsg, successMsg) => {
    if (!cart.length) return;
    if (window.confirm(confirmMsg)) {
        resetCartItems();
        alert(successMsg);
    }
};

//Mensaje de compra exitosa
const completeBuy = () => {
    completeCartAction(
        '¿Desea completar su compra?',
        '¡Gracias por su compra!'
    );
};

//Mensaje de vaciar carrito
const deleteCart = () => {
    completeCartAction(
        '¿Desea vaciar el carrito?',
        'No hay productos en el carrito'
    );
};


// Funcion inicializadora
const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener('click', showMoreProducts);
    categoriesContainer.addEventListener('click', applyFilter);
    cartBtn.addEventListener('click', toggleCart);
    menuBtn.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', closeOnScroll);
    overlay.addEventListener('click', closeOnOverlayClick);
    document.addEventListener('DOMContentLoaded', renderCart);
    document.addEventListener('DOMContentLoaded', showCartTotal);
    productsContainer.addEventListener('click', addProduct);
    productsCart.addEventListener('click', handleQuantity);
    buyBtn.addEventListener('click', completeBuy);
    deleteBtn.addEventListener('click', deleteCart);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
};
init();