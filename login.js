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
//Login
const loginForm = document.querySelector('.login__form');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('contraseña');
const errorMessage = document.getElementById('form__error');


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

//Auxiliares Login
const users = JSON.parse(localStorage.getItem('users')) || [];

const saveToSessionStorage = (user) => {
    sessionStorage.setItem('activeUser', JSON.stringify(user));
};

const isEmpty = (input) => {
    return !input.value.trim().length;
};

const isExistingEmail = (input) => {
    return users.some((user) => user.email === input.value.trim());
};

const isMatchingPass = (input) => {
    const user = users.find((user) => user.email === emailInput.value.trim());
    return user.password === input.value.trim();
};

const showError = (message) => {
    errorMessage.textContent = message;
};

const isValidAccount = () => {
    let valid = false;
    if (isEmpty(emailInput)) {
        showError('Por favor, complete los campos requeridos');
        return;
    };
    if (!isExistingEmail(emailInput)) {
        showError('El email ingresado es inválido');
        return;
    };
    if (isEmpty(passInput)) {
        showError('Por favor, complete los campos requeridos');
        return;
    };
    if (!isMatchingPass(passInput)) {
        showError('Los datos ingresados son incorrectos');
        loginForm.reset();
        return;
    };
    alert('Bienvenido nuevamente, ya estás en línea');
    valid = true;
    errorMessage.textContent = '';
    loginForm.reset;
    return valid;
};

//Login Form
const login = (e) => {
    e.preventDefault();
    if (isValidAccount()) {
        const user = users.find((user) => user.email === emailInput.value.trim());
        saveToSessionStorage(user);
        window.location.href = './index.html'
    };
};

const init = () => {
    //Menu-Cart
    cartBtn.addEventListener('click', toggleCart);
    menuBtn.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', closeOnScroll);
    overlay.addEventListener('click', closeOnOverlayClick);
    document.addEventListener('DOMContentLoaded', renderCart);
    document.addEventListener('DOMContentLoaded', showCartTotal);
    productsCart.addEventListener('click', handleQuantity);
    buyBtn.addEventListener('click', completeBuy);
    deleteBtn.addEventListener('click', deleteCart);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
    //Login
    loginForm.addEventListener('submit', login);
};
init();