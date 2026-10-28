import { degreesToRadian } from './utils/degreesToRadian.js';
import { DomVariable } from './utils/domVariable.js';

const canvas = document.querySelector('#game-field');
const ctx = canvas.getContext('2d');
const startButton = document.querySelector('#start-game');
const title = document.querySelector('.page-title');
const betMenu = document.querySelector('#bet-menu');

class Turtle {
    constructor(x, y, context, color) {
        this.x = x;
        this.y = y;
        this.ctx = context;
        this.color = color;
        this.hasWon = false;
        this.betItem = document.createElement('div');
        betMenu.append(this.betItem);
        this.betItem.id = `bet-item-${this.color}`;
        this.betItem.style.backgroundColor = this.color;
        this.betItem.innerHTML = `
            <button class='subtraction-button'>&minus;</button>
            <input type='number' value=0>
            <button class='addition-button'>&plus;</button>
        `;
        this.betItem.querySelectorAll('button').forEach(button => {
            button.style.backgroundColor = `color-mix(in srgb, ${this.color}, black 20%`;
        })
        const inputField = this.betItem.querySelector('input');
        this.betItem.querySelector('.subtraction-button').addEventListener('click', () => {
            inputField.value = inputField.value - 10;
            if (inputField.value < 0) {inputField.value = 0}
        });
        this.betItem.querySelector('.addition-button').addEventListener('click', () => {
            inputField.value = Number(inputField.value) + 10;
        })
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.ellipse(this.x, this.y, 30, 20, 0, 0, Math.PI*2);// lichaam
        this.ctx.rect(this.x + 27, this.y - 5, 10, 10);// nek
        this.ctx.ellipse(this.x + 45, this.y, 15, 10, 0, 0, Math.PI*2);// hoofd
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(degreesToRadian(40));
        this.ctx.rect(-40, 5, 15, 10);// been linksboven
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(degreesToRadian(145));// been rechtsboven
        this.ctx.rect(-39, -7, 15, 10);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(degreesToRadian(-40));
        this.ctx.rect(-40, -10, 15, 10);// been linksonder
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(degreesToRadian(-145));// been rechtsonder
        this.ctx.rect(-39, -3, 15, 10);
        this.ctx.restore();
        this.ctx.fill();
    }
}

const classicTurtleColors = [
    'red',
    'blue',
    'yellow',
    'pink',
    'green',
    'brown'
];

const turtles = [];
const totalTurtles = 6;
const beginY = 40;
const endY = 660;

const beginX = 50;
const endX = 700;
let anyTurtleHasWon = false;

let defaultBalance = 50;
const balance = new DomVariable(0, '#balance');
balance.set(defaultBalance);
let betMultiplier = 6;

function resetBet() {
    turtles.forEach(turtle => {
        turtle.betItem.querySelector('input').value = 0;
    })
}

function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX, canvas.height);
    ctx.stroke();
}

function setup() {
    drawBackground();
    for (let i=0; i < totalTurtles; i++) {
        turtles.push(new Turtle(
            beginX,
            (((endY-beginY) / totalTurtles) * i) + beginY,
            ctx,
            classicTurtleColors[i]
        ))
        turtles[i].draw();
    }
}

function finish() {
    let wonTurtleColors = [];
    let winAmount = 0;
    turtles.forEach(turtle => {
        if(turtle.hasWon) {
            wonTurtleColors.push(turtle.color);
            winAmount += Number(turtle.betItem.querySelector('input').value) * betMultiplier;
        }
    });
    resetBet();
    balance.add(winAmount);
    title.innerHTML = `You won ${winAmount} points. ${wonTurtleColors.join(' and ')} won`;
}

function turn() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    for(let i=0; i<turtles.length; i++) {
        turtles[i].x += Math.random() * 5;
        turtles[i].draw();
        if (turtles[i].x >= endX) {
            anyTurtleHasWon = true;
            turtles[i].hasWon = true;
        }
    }
    if(anyTurtleHasWon) {
        finish();
    }
    else {
        requestAnimationFrame(turn);
    }
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    anyTurtleHasWon = false;
    turtles.forEach(turtle => {
        turtle.x = beginX;
        turtle.hasWon = false;
    });
}

function start() {
    let totalLost = 0;
    turtles.forEach(turtle => totalLost += Number(turtle.betItem.querySelector('input').value));
    if(totalLost <= balance.value) {
        reset();
        balance.subtract(totalLost);
        requestAnimationFrame(turn);
    }
    else resetBet();
}

function fullReset() {
    reset();
    balance.set(defaultBalance);
    turtles.forEach(turtle => turtle.draw());
}

setup();

startButton.addEventListener('click', start);
document.querySelector('#reset-bet').addEventListener('click', resetBet);
document.querySelector('#reset-game').addEventListener('click', fullReset);
document.querySelector('#dev-menu-button').addEventListener('click', () => {
    const devMenu = document.querySelector('#dev-menu');
    devMenu.style.display = devMenu.style.display == 'flex' ? 'none' : 'flex';
});
document.querySelector('#submit').addEventListener('click', () => {
    betMultiplier = document.querySelector('#bet-multiplier').value;
    defaultBalance = document.querySelector('#start-balance').value;
});