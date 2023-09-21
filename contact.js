//Elementos del DOM
//Contacto
const formContacto = document.querySelector('.contacto__form');
const inputName = document.getElementById('nombre');
const inputNumber = document.getElementById('numero');
const inputMail = document.getElementById('mail');
const inputBox = document.getElementById('notas');
const inputCheckbox = document.getElementById('newsletter');
//Newsletter
const formNewsletter = document.querySelector('.contacto__newsletter__input');
const inputNewsletter = document.querySelector('.newsletter__input');
const buttonNewsletter = document.querySelector('.newsletter__button');

//Contacto Pagina Principal
const newsletter = JSON.parse(localStorage.getItem('newsletter')) || [];

const saveNewsletterToLocalStorage = () => {
    localStorage.setItem('newsletter', JSON.stringify(newsletter));
};

const contacto = JSON.parse(localStorage.getItem('contacto')) || [];

const saveContactoToLocalStorage = () => {
    localStorage.setItem('contacto', JSON.stringify(contacto));
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
    return newsletter.some((newsletter) => newsletter.email === input.value.trim());
};

const isPhoneValid = (input) => {
    const re = /^[0-9]{10}$/;
    return re.test(input.value.trim());
};

const showError = (input, message) => {
    const formNewsletter = input.parentElement;
    formNewsletter.classList.remove('success');
    formNewsletter.classList.add('error');
    const error = formNewsletter.querySelector('small');
    error.style.display = 'block';
    error.textContent = message;
};

const showSuccess = (input, message) => {
    const formNewsletter = input.parentElement;
    formNewsletter.classList.remove('error');
    formNewsletter.classList.add('success');
    const error = formNewsletter.querySelector('small');
    error.textContent = '';
};

const checkName = (input) => {
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
        showError(input, 'El email ya se encuentra en registrado en el Newsletter');
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

const checkTrue = (input) => {
    if (document.getElementById('newsletter').checked) {
        return true;
    };
};

//NEWSLETTER
const validateNewsletter = (e) => {
    e.preventDefault();
    let isEmailValid = checkEmail(inputNewsletter);
    let isValidNewsletter = isEmailValid;

    if (isValidNewsletter) {
        newsletter.push({email: inputNewsletter.value, });
        saveNewsletterToLocalStorage(newsletter);
        alert('Te has registrado al Newsletter con éxito!');
        window.location.href = './index.html#contacto';
    };
};

//CONTACTO
const validateContact = (e) => {
    e.preventDefault();
    let isNameValid = checkName(inputName);
    let isEmailValid = checkEmail(inputMail);
    let isPhoneValid = checkPhone(inputNumber);
    let isTrueCheckbox = checkTrue(inputCheckbox);
    let isValidForm = 
    isNameValid &&
    isEmailValid &&
    isPhoneValid;

    if (isValidForm) {
        contacto.push({
            name: inputName.value,
            email: inputMail.value,
            phone: inputNumber.value,
            add: inputBox.value,
            newsletter: inputCheckbox.boolean
        });
        if (isTrueCheckbox) {
            newsletter.push({email: inputMail.value, });
            saveNewsletterToLocalStorage(inputMail.value);
        };
        saveContactoToLocalStorage(contacto);
        alert('Tu formuario de contacto se ha enviado con éxito');
        window.location.href = './index.html#contacto';
    };
};


const contact = () => {
    //newsletter
    formNewsletter.addEventListener('submit', validateNewsletter);
    inputNewsletter.addEventListener('input', () => checkEmail(inputNewsletter));
    //contacto
    formContacto.addEventListener('submit', validateContact);
    inputName.addEventListener('input', () => checkName(inputName));
    inputMail.addEventListener('input', () => checkEmail(inputMail));
    inputNumber.addEventListener('input', () => checkPhone(inputNumber));
    inputCheckbox.addEventListener('input', () => checkTrue(inputCheckbox));
};
contact();