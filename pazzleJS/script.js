const containerNode = document.getElementById('fifteen');
const startGame = document.getElementById('game');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 16;
const el = (id) => document.getElementById(id)
if (itemNodes.length !== 16) {
    throw new Error(`MUST BE = ${countItems} IN HTML`)
}


//Position
itemNodes[countItems - 1].style.display = 'none';
let matrix = getMatrix(
    itemNodes.map((item) => Number(item.dataset.matrixId))
);
setPositionItems(matrix);

//Shuffle
document.getElementById('shuffle').addEventListener('click', () => {
    const shuffledArray = shuffleArray(matrix.flat());//тут мы делаем массив который создали плоским а потом
    //перемешиваем его функцией с хабра
    matrix = getMatrix(shuffledArray);//делаем присвоение матрицы к перемешанному массиву
    setPositionItems(matrix);
    reset()

})

const blankNumber = 16;
containerNode.addEventListener('click', (event) => {
    //тут узнаем кликнули ли мы на кнопку или нет

    const buttonNode = event.target.closest('button');
    if (!buttonNode) {
        return;
    }
    const buttonNumber = Number(buttonNode.dataset.matrixId);//тут узнаем номер квадрата по которому кликнули
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const isValid = isVlaidForSwap(buttonCoords, blankCoords);


    if (isValid) {
        swap(buttonCoords, blankCoords, matrix);
        setPositionItems(matrix);

    }
})
//Change position by arrow
window.addEventListener('keydown', (event) => {
    if (!event.key.includes('Arrow')) {
        return;
    }
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const buttonCoords = {
        x: blankCoords.x,
        y: blankCoords.y,
    };
    const direction = event.key.split('Arrow')[1].toLocaleLowerCase();
    const maxIndexMatrix = matrix.length;
    switch (direction) {
        case 'up':
            buttonCoords.y += 1;
            break;
        case 'down':
            buttonCoords.y -= 1;
            break;
        case 'left':
            buttonCoords.x += 1;
            break;
        case 'right':
            buttonCoords.x -= 1;
            break;
    }
    if (blankCoords.y >= maxIndexMatrix || buttonCoords.y < 0
        || blankCoords.x >= maxIndexMatrix || buttonCoords.x < 0) {
        return;
    }
    swap(buttonCoords, blankCoords, matrix);
    setPositionItems(matrix);
})
//final massage

//HELP FUNC
//тут мы делаем матрицу построяния квадратиков по оси Х У
function getMatrix(arr) {
    const matrix = [[], [], [], []];
    // x and y координаты оси x горизонтально y вертикально
    let y = 0;
    let x = 0;

    for (let i = 0; i < arr.length; i++) {
        /* если х т.е горизонтальная линия стала больше 4
         то мы увеличиваем  у  и говорим х что он =0   */
        if (x >= 4) {
            y++;
            x = 0;
        }
        // тут мы присваивам значения матрицы значению массива от i
        matrix[y][x] = arr[i];
        x++;
        /* вот как это работает мы заходим в массив где по началу значения х и у = 0 потом идет цикл
        в которм х увеличивается до тех пор пока не станет >= 4 после этого мы увеличиваем у на +1 т.е добавляем
        еще 1 горизонтальную линию при этом обнуляя х получается что мы заполняем эту матрицу     const matrix = [[], [], [], []];
        по 4 числа в каждые скобки (ну насколько массив позволяет)
        */
    }
    return matrix
}
function setPositionItems(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const value = matrix[y][x];
            const node = itemNodes[value - 1];
            setNodeStyles(node, x, y);
        }
    }
}
// тут мы устанавливаем позиицию благодаря координатам из матрицы

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x * shiftPs}%,${y * shiftPs}%,0)`
}

function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

function findCoordinatesByNumber(number, matrix) { // тут мы пробегаемся по X AND Y и сравниваем внутреннее занчение с числом
    //и возвращаем значения X Y вместо числа 
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] === number) {
                return { x, y };
            }
        }
    }
    return null;
}
// проверяем можно ли поменять местами и задаем условия для 
//замены местами
function isVlaidForSwap(co1, co2) {
    const diffX = Math.abs(co1.x - co2.x);
    const diffY = Math.abs(co1.y - co2.y);
    return (diffX === 1 || diffY === 1) && (co1.x === co2.x || co1.y === co2.y);
}

function swap(co1, co2, matrix) {
    const coords1Number = matrix[co1.y][co1.x];
    matrix[co1.y][co1.x] = matrix[co2.y][co2.x];
    matrix[co2.y][co2.x] = coords1Number;

    if (isWon(matrix)) {
        el('win').style.color = 'black';
        stop()
    } else if (!(isWon(matrix))) {
        start()
        addWonClass();
        el('win').style.color = 'white'
    }
}

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);
function isWon(matrix) {
    const flatMatrix = matrix.flat();
    for (let i = 0; i < winFlatArr.length; i++) {
        if (flatMatrix[i] !== winFlatArr[i]) {
            return false
        }
    }
    return true;
}

const wonClass = 'fifteenWon'
function addWonClass() {
    setTimeout(() => {
        containerNode.classList.add(wonClass);

        setTimeout(() => {
            containerNode.classList.remove(wonClass);
        }, 0);
    }, 0);
}

const time_el = document.querySelector('.watch .time');
const start_btn = document.getElementById('start');
const stop_btn = document.getElementById('stop');
const reset_btn = document.getElementById('reset');

let seconds = 0;//наши секунды
let interval = null;// тиак каждую секунду по умолчанию = null


start_btn.addEventListener('click', start);
stop_btn.addEventListener('click', stop);
reset_btn.addEventListener('click', stop);


function timer() {
    seconds++;

    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60)//секунды делим на 60 получаем минуты
    let secs = seconds % 60;
    if (secs < 10) secs = '0' + secs;
    if (mins < 10) mins = "0" + mins;
    if (hrs < 10) hrs = "0" + hrs;

    time_el.innerText = `${hrs}:${mins}:${secs}`;

}
function start() {
    if (interval) {
        return
    }

    interval = setInterval(timer, 1000);
}
function stop() {
    clearInterval(interval);
    interval = null;
}
function reset() {
    stop()
    seconds = 0;
    time_el.innerText = '00:00:00';
}