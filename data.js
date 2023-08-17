const productsData = [
    {
        id: 1,
        name: "Magnus Chase",
        price: 8000,
        autor: "Rick Riordan",
        libroImg: "./img/Autores/RickRiordan/MagnusChase.png",
    },
    {
        id: 2,
        name: "El Mapa de los Anhelos",
        price: 7500,
        autor: "Alice Kellen",
        libroImg: "./img/Autores/AliceKellen/ElMapaDeLosAnhelos.png",
    },
    {
        id: 3,
        name: "Bajo el Domo",
        price: 9000,
        autor: "Stephen King",
        libroImg: "./img/Autores/StephenKing/Bajoeldomo.png",
    },
    {
        id: 4,
        name: "El Rey Marcado",
        price: 8000,
        autor: "Leigh Bardugo",
        libroImg: "./img/Autores/LeighBerdugo/ElReyMarcado.png",
    },
    {
        id: 5,
        name: "Legend",
        price: 7500,
        autor: "Marie Lu",
        libroImg: "./img/Autores/MarieLu/Legend.jpeg",
    },
    {
        id: 6,
        name: "Seis de Cuervos",
        price: 8000,
        autor: "Leigh Bardugo",
        libroImg: "./img/Autores/LeighBerdugo/SeisDeCuervos.jpg",
    },
    {
        id: 7,
        name: "Percy Jackson",
        price: 9000,
        autor: "Rick Riordan",
        libroImg: "./img/Autores/RickRiordan/PercyJackson.png",
    },
    {
        id: 8,
        name: "Nosotros en la Luna",
        price: 7500,
        autor: "Alice Kellen",
        libroImg: "./img/Autores/AliceKellen/NosotrosEnLaLuna.jpg",
    },
    {
        id: 9,
        name: "It (Eso)",
        price: 9000,
        autor: "Stephen King",
        libroImg: "./img/Autores/StephenKing/It.png",
    },
    {
        id: 10,
        name: "El Lenguaje de las Espinas",
        price: 8000,
        autor: "Leigh Bardugo",
        libroImg: "./img/Autores/LeighBerdugo/ElLenguajeDeLasEspinas.jpg",
    },
    {
        id: 11,
        name: "La Piramide Roja",
        price: 7500,
        autor: "Rick Riordan",
        libroImg: "./img/Autores/RickRiordan/LaPiramideRoja.png",
    },
    {
        id: 12,
        name: "Warcross",
        price: 8000,
        autor: "Marie Lu",
        libroImg: "./img/Autores/MarieLu/Warcross.jpg",
    },
    {
        id: 13,
        name: "Todo lo que Nunca Fuimos",
        price: 9000,
        autor: "Alice Kellen",
        libroImg: "./img/Autores/AliceKellen/TodoLoQueNuncaFuimos.png",
    },
    {
        id: 14,
        name: "Mr. Mercedes",
        price: 8000,
        autor: "Stephen King",
        libroImg: "./img/Autores/StephenKing/MrMercedes.jpg",
    },
    {
        id: 15,
        name: "Skyhunter",
        price: 8000,
        autor: "Marie Lu",
        libroImg: "./img/Autores/MarieLu/Skyhunter.png",
    },
    {
        id: 16,
        name: "Carrie",
        price: 8000,
        autor: "Stephen King",
        libroImg: "./img/Autores/StephenKing/Carrie.png",
    },
    {
        id: 17,
        name: "Pandemia",
        price: 7500,
        autor: "Robin Cook",
        libroImg: "./img/Autores/RobinCook/Pandemia.jpg",
    },
    {
        id: 18,
        name: "Coma",
        price: 8000,
        autor: "Robin Cook",
        libroImg: "./img/Autores/RobinCook/Coma.jpg",
    },
    {
        id: 19,
        name: "Los Archivos de Salem",
        price: 8000,
        autor: "Robin Cook",
        libroImg: "./img/Autores/RobinCook/LosArchivosDeSalem.jpg",
    },
];

//Funcion para dividir los productos en arrays de 'size' productos
const divideProductsInParts = (size) => {
    let productsList = [];
    for (let i = 0; i < productsData.length; i += size)
    productsList.push(productsData.slice(i, i + size))
    return productsList;
};

//Concepto de estado
const appState = {
    products: divideProductsInParts(6),
    currentProductsIndex: 0,
    productsLimit: divideProductsInParts(6).length,
    activeFilter: null
};