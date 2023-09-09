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
//Register
const registerForm = document.querySelector('.register__form');
const nameInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('telefono');
const passInput = document.getElementById('contraseña');


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
    //guardar carrito en LS
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

//Auxiliares Register
const users = JSON.parse(localStorage.getItem('users')) || [];

const saveToLocalStorage = () => {
    localStorage.setItem('users', JSON.stringify(users));
};

const isBetween = (input, min, max) => {
    return input.value.length >= min && input.value.length < max;
};

const isEmpty = (input) => {
    return !input.value.trim().length;
};

const isEmailValid = (input) => {
    const re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,4})+$/;
    return re.test(input.value.trim());
};

const isExistingEmail = (input) => {
    return users.some((user) => user.email === input.value.trim());
};

const isPassSecure = (input) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(input.value.trim());
};

const isPhoneValid = (input) => {
    const re = /^[0-9]{10}$/;
    return re.test(input.value.trim());
};

const showError = (input, message) => {
    const registerForm = input.parentElement;
    registerForm.classList.remove('success');
    registerForm.classList.add('error');
    const error = registerForm.querySelector('small');
    error.style.display = 'block';
    error.textContent = message;
};

const showSuccess = (input, message) => {
    const registerForm = input.parentElement;
    registerForm.classList.remove('error');
    registerForm.classList.add('success');
    const error = registerForm.querySelector('small');
    error.textContent = '';
};

//Validacion Inputs
const checkTextInput = (input) => {
    let valid = false;
    const minCharacters = 3;
    const maxCharacters = 25;
    if(isEmpty(input)){
        showError(input, `Este campo es obligatorio`);
        return;
    };
    if(!isBetween(input, minCharacters, maxCharacters)){
        showError(input, `Debe tener entre ${minCharacters}  y ${maxCharacters}  caracteres`);
        return;
    };
    showSuccess(input);
    valid = true;
    return valid;
};

const checkEmail = (input) => {
    let valid = false;
    if (isEmpty(input)){
        showError(input, 'El email es obligatorio');
        return;
    };
    if (!isEmailValid(input)) {
        showError(input, 'El email no es válido');
        return;
    };
    if (isExistingEmail(input)) {
        showError(input, 'El email ya se encuentra en un usuario registrado');
        return;
    };
    showSuccess(input);
    valid = true;
    return valid;
};

const checkPhone = (input) => {
    let valid = false;
    if (isEmpty(input)) {
        showError(input, 'La teléfono es obligatorio');
        return;
    };
    if (!isPhoneValid(input)) {
        showError(input, 'El teléfono no es valido');
        return;
    };
    showSuccess(input);
    valid = true;
    return valid;
};

const checkPassword = (input) => {
    let valid = false;
    if (isEmpty(input)) {
        showError(input, 'La cotraseña es obligatoria');
        return;
    };
    if (!isPassSecure(input)) {
        showError(input, 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
        return;
    };
    showSuccess(input);
    valid = true;
    return valid;
};

//Register form
const validateForm = (e) => {
    e.preventDefault();
    let isNameValid = checkTextInput(nameInput);
    let isEmailValid = checkEmail(emailInput);
    let isPhoneValid = checkPhone(phoneInput);
    let isPasswordValid = checkPassword(passInput);
    let isValidForm = 
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordValid;

    if (isValidForm) {
        users.push({
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: passInput.value
        });
        saveToLocalStorage(users);
        alert('Te has registrado con éxito');
        window.location.href = './login.html';
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
    //Register
    registerForm.addEventListener('submit', validateForm);
    nameInput.addEventListener('input', () => checkTextInput(nameInput));
    emailInput.addEventListener('input', () => checkEmail(emailInput));
    phoneInput.addEventListener('input', () => checkPhone(phoneInput));
    passInput.addEventListener('input', () => checkPassword(passInput));
};
init();