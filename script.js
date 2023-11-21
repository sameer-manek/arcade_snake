// game code

// todo: make arrow keys clickable on phones

var grid = document.getElementById('grid');
var snake = [];
var fruit = [];
var strokes = [[0,0]];
var move = false;
var score = 0;
var game_ended = false;

const grid_size = 12;

function update_score() {
    document.getElementById('score').innerHTML = score;
}

function render_grid() {
    let html_block = "";
    for(let i = 0; i < grid_size; i++) {
        html_block += '<div class="row">';
        for(let c = 0; c < grid_size; c++) {
            html_block += '<div class="cell"></div>';
        }
        html_block += '</div>';
    }

    grid.innerHTML = html_block;
}

function add_snake() {
    snake.push([
        random(0, grid_size),
        random(0, grid_size)
    ]);

    toggle_cell(snake[0], "red");
}

function add_fruit() {
    fruit = [
        random(0, grid_size),
        random(0, grid_size)
    ];

    snake.forEach(cell => {
        if (compare_matx(cell, fruit)) {
            fruit = [
                random(0, grid_size),
                random(0, grid_size)
            ];
        }
    })

    toggle_cell(fruit, "green");
}

function move_snake(key) {
    let v = [0, 0]; // velocity
    let tail = [...snake[snake.length-1]];
    let move = false;

    if (key === "ArrowLeft" && snake[0][1] > 0 && (snake.length === 1 || strokes[0][1] != 1)) {
        v = [0, -1];
        move = true;
    }

    if (key === "ArrowRight" && snake[0][1] < grid_size-1 && (snake.length === 1 || strokes[0][1] != -1)) {
        v = [0, 1];
        move = true;
    }

    if (key === "ArrowUp" && snake[0][0] > 0 && (snake.length === 1 || strokes[0][0] != 1)) {
        v = [-1, 0];
        move = true;
    }

    if (key === "ArrowDown" && snake[0][0] < grid_size-1 && (snake.length === 1 || strokes[0][0] != -1)) {
        v = [1, 0];
        move = true;
    }

    if (move) {
        strokes.unshift(v);
        strokes = strokes.splice(0, snake.length+2);

        // update snake pos
        for(let i = 0; i < snake.length; i++) {
            toggle_cell(snake[i], "transparent");
            add_matx(snake[i], strokes[i]);
            toggle_cell(snake[i], "red");
        }

        // check if snake bit itself
        for (i = 1; i < snake.length; i++) {
            if (compare_matx(snake[0], snake[i])) {
                move = false;
                game_ended = true;

                document.getElementById("message").innerHTML = "<b>GAME ENDED - You bit yourself! Hit refresh to start new game</b>";
                break;
            }
        }

        if (compare_matx(snake[0], fruit)) {
            score += 1;
            add_fruit();
            update_score();

            snake.push(tail);
            toggle_cell(tail, "red");
        }
    }
}

function register_stroke () {}

function Init() {
    update_score();
    render_grid();
    add_snake();
    add_fruit();

    document.addEventListener("keydown", e => {
        if (!game_ended) move_snake(e.key)
    });
}

Init();