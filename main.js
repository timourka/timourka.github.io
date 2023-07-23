let offs = 100;
let size = 30;
let wait = 80;
let img_w = 20;
let img_h = 14;
let coords = [[0, 0]];

class Node {
    constructor(data) {
      this.data = data;
      this.next = null;
    }
}
  
class Queue {
    constructor() {
      this.front = null; // Начало очереди
      this.rear = null; // Конец очереди
      this.size = 0; // Размер очереди
    }
  
    // Добавление элемента в конец очереди
    enqueue(item) {
      const newNode = new Node(item);
      if (this.isEmpty()) {
        this.front = newNode;
        this.rear = newNode;
      } else {
        this.rear.next = newNode;
        this.rear = newNode;
      }
      this.size++;
    }
  
    // Удаление и возврат элемента из начала очереди
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      const data = this.front.data;
      this.front = this.front.next;
      this.size--;
      return data;
    }
  
    // Возвращает элемент из начала очереди без его удаления
    peek() {
      if (this.isEmpty()) {
        return null;
      }
      return this.front.data;
    }
  
    // Проверка, пуста ли очередь
    isEmpty() {
      return this.size === 0;
    }
  
    // Возвращает размер очереди
    getSize() {
      return this.size;
    }
  
    // Очистить очередь
    clear() {
      this.front = null;
      this.rear = null;
      this.size = 0;
    }
}
  

let img_map = [
    2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function setup() {
    createCanvas(offs + img_w * size, offs + img_h * size);
    startCrawl();
    show_map();
    main();
}

function draw() { }

function show_map() {
    background(255);

    stroke(255, 0, 0);
    strokeWeight(1);
    for (let i = 1; i < coords.length; i++) {
        line(offs + size / 2 + coords[i - 1][0] * size,
            offs + size / 2 + coords[i - 1][1] * size,
            offs + size / 2 + coords[i][0] * size,
            offs + size / 2 + coords[i][1] * size
        );
    }

    stroke(0);
    strokeWeight(0.3);
    for (let y = 0; y < img_h; y++) {
        for (let x = 0; x < img_w; x++) {
            let v = 1 - img_map[x + y * img_w];
            fill(v * 255);
            rect(offs + x * size, offs + y * size, size, size);
        }
    }
    show_head();

    stroke(255, 0, 0);
    strokeWeight(1);
    for (let i = 1; i < coords.length; i++) {
        line(offs + size / 2 + coords[i - 1][0] * size,
            offs + size / 2 + coords[i - 1][1] * size,
            offs + size / 2 + coords[i][0] * size,
            offs + size / 2 + coords[i][1] * size
        );
    }

    stroke(0);
    strokeWeight(0.3);
}
function show_head() {
    fill(255, 0, 0);
    rect(offs + cr_x * size, offs + cr_y * size, size, size);
}
function show_search(x, y) {
    fill(255, 255, 0);
    rect(offs + x * size, offs + y * size, size, size);
}

let cr_x = 0, cr_y = 0, cr_px = 0, cr_py = 0;
let cr_size = 1;
let cr_head = 0;
let cr_count = 0;
let cr_loop = 0;
let cr_skip = 1;


async function main() {

    async function DFS(startX, startY){
        let x_ = startX;
        let y_ = startY;
    
        moveTo(x_, y_);
        // Функция для проверки пикселя на препятствие
        async function check(x, y) {
            await sleep(wait);
            show_search(x, y);

            if (getBuffer(x, y) == 1) {
                show_map();
                await sleep(10);
                await DFS(x,y);
                moveTo(x_, y_);
                return true;
            }
            return false;
        }
    
        async function moveTo(x, y) {
            coords.push([x, y]);
            cr_count++;
            img_map[x + y * img_w] = 2;

            if (cr_count % cr_skip == 0) {
                cr_px = x;
                cr_py = y;
            }
            cr_x = x;
            cr_y = y;
        }

        // Функция для получения значения цвета пикселя
        function getBuffer(x, y) {
            if (x < 0 || x >= img_w || y < 0 || y >= img_h) return 0;
            return img_map[x + y * img_w];
        }
    
        // Массив функций для проверки доступности направлений движения ползунка
        let  checkers = [
          async function () {
            if (await check(x_, y_ - 1)) {
                return true; // Двигаемся вверх
            }
            return false;
          },
          async function () {
            let v = await check(x_ + 1, y_);
            if (v) {
                return true; // Двигаемся вправо
            }
            return false;
          },
          async function () {
            if (await check(x_, y_ + 1)) {
                return true; // Двигаемся вниз
            }
            return false;
          },
          async function () {
            if (await check(x_ - 1, y_)) {
                return true; // Двигаемся влево
            }
            return false;
          },
        ];

        // Проверяем доступность каждого направления движения и выбираем следующее направление
        for (let i = 0; i < 4; i++) {
          let v = await checkers[i]();
        }

    }

    async function findNearest(xStart, yStart){

        let minLen = 999999999;
        let minX1 = -1, minY1 = -1, minX2 = -1, minY2 = -1;
        function countLen(x1,y1,x2,y2){
            return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
        }
        async function checkArea(startX, startY) {

            cr_x = startX;
            cr_y = startY;

            async function check(x, y) {
                show_search(x, y);
    
                if (getBuffer(x, y) == 1) {

                    show_map();
                    await sleep(100);
                    return [x, y];
                }
                return [-1,-1];
            }
    
            function getBuffer(x, y) {
                if (x < 0 || x >= img_w || y < 0 || y >= img_h) return 0;
                return img_map[x + y * img_w];
            }
    
            let checkers = [
                async function () {
                    for (let x = cr_x - cr_size; x < cr_x + cr_size; x++) {
                        let v = await check(x, cr_y - cr_size);
                        if (v[0]!=-1)
                            return v
                    }
                    return [-1,-1];
                },
                async function () {
                    for (let y = cr_y - cr_size; y < cr_y + cr_size; y++) {
                        let v = await check(cr_x + cr_size, y);
                        if (v[0]!=-1)
                            return v
                    }
                    return [-1,-1];
                },
                async function () {
                    for (let x = cr_x + cr_size; x > cr_x - cr_size; x--) {
                        let v = await check(x, cr_y + cr_size);
                        if (v[0]!=-1)
                            return v
                    }
                    return [-1,-1];
                },
                async function () {
                    for (let y = cr_y + cr_size; y > cr_y - cr_size; y--) {
                        let v = await check(cr_x - cr_size, y);
                        if (v[0]!=-1)
                            return v
                    }
                    return [-1,-1];
                }
            ];
    
    
            let cr_loop = 1;
            for (let i = 0; i < 4; i++) {
                let v = await checkers[i]();
                if (v[0]!=-1) {
                    return v;
                }
            }
            return [-1,-1];
        }

        async function BFS(startX, startY){

            let visited = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            ];

            function getBuffer2(x, y) {
                if (x < 0 || x >= img_w || y < 0 || y >= img_h) return 1;
                try{
                    return visited[y][x];
                }
                catch{
                    console.log(pizda);
                }
            }

            function setBuffer2(x, y) {
                if (x < 0 || x >= img_w || y < 0 || y >= img_h) return ;
                visited[y][x] = 1;
            }

            async function check2(x, y) {
                return getBuffer2(x, y) != 1;
            }

            function getBuffer(x, y) {
                if (x < 0 || x >= img_w || y < 0 || y >= img_h) return 0;
                return img_map[x + y * img_w];
            }

            async function check(x, y) {
                await sleep(1);
                show_search(x, y);
    
                if (getBuffer(x, y) == 1) {
                    show_map();
                    await sleep(100);
                    return [x, y];
                }
                return [-1,-1];
            }
    
            let queue = new Queue();

            await queue.enqueue([startX, startY]);
            setBuffer2(startX,startY);
            while (!queue.isEmpty()){
                let el = await queue.dequeue();
                let be = await check(el[0], el[1]);
                if (be[0] != -1){
                    return [el[0], el[1]];
                }
                if (await countLen(startX, startY, el[0], el[1]) > minLen){
                    return [-1,-1];
                }
                if (await check2(el[0]+1, el[1])){
                    setBuffer2(el[0]+1, el[1]);
                    await queue.enqueue([el[0]+1, el[1]]);
                }
                if (await check2(el[0], el[1]+1)){
                    setBuffer2(el[0], el[1]+1);
                    await queue.enqueue([el[0], el[1]+1]);
                }
                if (await check2(el[0]-1, el[1])){
                    setBuffer2(el[0]-1, el[1]);
                    await queue.enqueue([el[0]-1, el[1]]);
                }
                if (await check2(el[0], el[1]-1)){
                    setBuffer2(el[0], el[1]-1);
                    await queue.enqueue([el[0], el[1]-1]);
                }
            }
            return [-1,-1];
        }

        async function DFS(startX, startY){
            let x_ = startX;
            let y_ = startY;
        
            // Функция для проверки пикселя на препятствие
            async function check(x, y) {
                await sleep(wait);
                show_search(x, y);
    
                if (getBuffer(x, y) == 2) {
                    img_map[x + y * img_w] = 3;
                    cr_size = 1;
                    let v = [-1,-1];
                    v = await BFS(x, y);
                    show_map();
                    await sleep(100);
                    if (v[0]!=-1){
                        let len = await countLen(v[0], v[1], x, y);
                        if (minLen >= len){
                            minX1 = x;
                            minX2 = v[0];
                            minY1 = y;
                            minY2 = v[1];
                            minLen = len;
                        }
                    }
                    await DFS(x,y);
                    return true;
                }
                return false;
            }
    
            // Функция для получения значения цвета пикселя
            function getBuffer(x, y) {
                if (x < 0 || x >= img_w || y < 0 || y >= img_h) return 0;
                return img_map[x + y * img_w];
            }
        
            // Массив функций для проверки доступности направлений движения ползунка
            let  checkers = [
              async function () {
                if (await check(x_, y_ - 1)) {
                    return true; // Двигаемся вверх
                }
                return false;
              },
              async function () {
                let v = await check(x_ + 1, y_);
                if (v) {
                    return true; // Двигаемся вправо
                }
                return false;
              },
              async function () {
                if (await check(x_, y_ + 1)) {
                    return true; // Двигаемся вниз
                }
                return false;
              },
              async function () {
                if (await check(x_ - 1, y_)) {
                    return true; // Двигаемся влево
                }
                return false;
              },
            ];
    
            // Проверяем доступность каждого направления движения и выбираем следующее направление
            for (let i = 0; i < 4; i++) {
              let v = await checkers[i]();
            }
    
        }

        await DFS(xStart, yStart);

        return[minX1, minY1, minX2, minY2]
    }

    async function DFS2(startX, startY, finishX, finishY){
        if (startX == finishX && startY == finishY){
            moveTo(finishX, finishY);
            return true;
        }

        let x_ = startX;
        let y_ = startY;
    
        moveTo(x_, y_);
        // Функция для проверки пикселя на препятствие
        async function check(x, y) {
            await sleep(wait);
            show_search(x, y);

            if (getBuffer(x, y) == 3) {
                show_map();
                await sleep(10);
                let finish = await DFS2(x,y, finishX, finishY);
                if (!finish){
                    moveTo(x_, y_);
                    return false;
                }
                return true;
            }
            return false;
        }
    
        async function moveTo(x, y) {
            coords.push([x, y]);
            cr_count++;
            img_map[x + y * img_w] = 0;

            if (cr_count % cr_skip == 0) {
                cr_px = x;
                cr_py = y;
            }
            cr_x = x;
            cr_y = y;
        }

        // Функция для получения значения цвета пикселя
        function getBuffer(x, y) {
            if (x < 0 || x >= img_w || y < 0 || y >= img_h) return 0;
            return img_map[x + y * img_w];
        }
    
        // Массив функций для проверки доступности направлений движения ползунка
        let  checkers = [
          async function () {
            if (await check(x_, y_ - 1)) {
                return true; // Двигаемся вверх
            }
            return false;
          },
          async function () {
            let v = await check(x_ + 1, y_);
            if (v) {
                return true; // Двигаемся вправо
            }
            return false;
          },
          async function () {
            if (await check(x_, y_ + 1)) {
                return true; // Двигаемся вниз
            }
            return false;
          },
          async function () {
            if (await check(x_ - 1, y_)) {
                return true; // Двигаемся влево
            }
            return false;
          },
        ];

        // Проверяем доступность каждого направления движения и выбираем следующее направление
        for (let i = 0; i < 4; i++) {
          let v = await checkers[i]();
          if (v)
            return v;
        }
        return false;

    }

    let nearest = await findNearest(-1,0);
    let lastCoordX = 0, lastCoordY = 0;
    while (nearest[2] != -1){
        await DFS2(lastCoordX, lastCoordY, nearest[0], nearest[1])
        lastCoordX = nearest[2], lastCoordY = nearest[3];
        await DFS(nearest[2], nearest[3]);
        nearest = await findNearest(nearest[2], nearest[3]);
    }
}

function startCrawl() {
    cr_x = 0, cr_y = 0, cr_px = 0, cr_py = 0;
    cr_count = 0;
    cr_size = 1;
}