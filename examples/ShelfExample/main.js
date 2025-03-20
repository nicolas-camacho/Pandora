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

counter.innerHTML = shelf.get('count');
message.innerHTML = shelf.get('message');

const increment = () => {
    const count = shelf.get('count');
    shelf.update({ count: count + 1 });
    counter.innerHTML = shelf.get('count');
}

const changeMessage = () => {
    shelf.update({ message: 'Hello, Shelf!' });
    message.innerHTML = shelf.get('message');
};

const buttonElement = document.getElementById('mybuttonCount');
buttonElement.onclick = increment;

const buttonElement2 = document.getElementById('mybuttonText');
buttonElement2.onclick = changeMessage;

const multiplyCounter = (value) => {
    console.log(`Multiplying the counter by 2: ${value * 2}`);
}

shelf.links({ count: [multiplyCounter] });

shelf.links([() => {
    console.log('This is a global reactor');
}])