import { Shelf } from "../../dist/index.esm.js";

const shelf = new Shelf({
    count: 0,
    message: 'Hello, World!'
}, {
    count: [(state) => {
        console.log(`The count is: ${state}`);
    }],
    message: [(state) => {
        console.log(`The message is: ${state}`);
    }]
})

const counter = document.getElementById('counterValue');
const message = document.getElementById('mytext');

const increment = () => {
    const count = shelf.get('count');
    shelf.update({ count: count + 1 });
}

const buttonElement = document.getElementById('mybutton');
buttonElement.onclick = increment;