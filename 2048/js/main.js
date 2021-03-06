/**
 * 游戏主逻辑
 * 主要用来操作游戏的数据
 */

var board = new Array();
var hasConflicted = new Array();
var score = 0;

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function() {
    prepareMobile();
    newGame();
});

function prepareMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-radius", 0.02 * gridContainerWidth);

    $(".grid-cell").css("width", cellSideLength);
    $(".grid-cell").css("height", cellSideLength);
    $(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}

function newGame() {

    // 初始化棋盘格
    init();
    // 随机在两个棋盘格生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i ++) {
        // 声明表格数组
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j ++) {
            // 初始化棋盘格样式
            var gridCell = $("#grid-cell-" + i +"-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));

            // 初始化数组
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    // 根据 board 里面的值，更新 number-cell 数字
    updateBoardView();

    score = 0;
}

function updateBoardView() {

    $(".number-cell").remove();

    for (var i = 0; i < 4; i ++) {
        for (var j = 0; j < 4; j ++) {
            $("#grid-container").append("<div class='number-cell' id='number-cell-" + i +"-" + j + "'></div>");
            var theNumCell = $("#number-cell-" + i + "-" + j)

            if (board[i][j] == 0) {
                theNumCell.css("width", "0px");
                theNumCell.css("height", "0px");
                theNumCell.css("top", getPosTop(i, j) + cellSideLength / 2);
                theNumCell.css("left", getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumCell.css("width", cellSideLength);
                theNumCell.css("height", cellSideLength);
                theNumCell.css("top", getPosTop(i, j));
                theNumCell.css("left", getPosLeft(i, j));

                // 根据数字更改前景色和背景色
                theNumCell.css("color", getNumberColor(board[i][j]));
                theNumCell.css("background-color", getNumberBackgroundColor(board[i][j]));

                theNumCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }

    $(".number-cell").css("line-height", cellSideLength + "px");
    $(".number-cell").css("font-size", 0.6 * cellSideLength + "px");
}

function generateOneNumber() {
    if (noSpace(board)) {
        return false;
    }

    // 随机生成一个位置
    var randomX = parseInt(Math.floor(Math.random() * 4));
    var randomY = parseInt(Math.floor(Math.random() * 4));

    var times = 0;

    while (times < 50) {
        // 位置为空
        if (board[randomX][randomY] == 0) {
            break;
        }
        // 位置不为空，重新生成新位置
        randomX = parseInt(Math.floor(Math.random() * 4));
        randomY = parseInt(Math.floor(Math.random() * 4));

        times ++;
    }

    if (times == 50) {
        for (var i = 0; i < 4; i ++) {
            for (var j = 0; j < 4; j ++) {
                if (board[i][j] == 0) {
                    randomX = i;
                    randomY = j;
                }
            }
        }
    }

    // 随机生成一个数字
    var randomNumber = Math.random() < 0.5? 2: 4;

    // 在随机位置显示随机数字
    board[randomX][randomY] = randomNumber;
    showNumberWithAnimation(randomX, randomY, randomNumber);

    return true;
}

$(document).keydown(function(event){

    // 阻止默认按键效果（所有的），只使用自己定义的，防止有滚动条时，按上下键移动页面
    // 如果不想使其他按键失效，可以将下面语句添加到每一个按键 case 内
    event.preventDefault();

    switch (event.keyCode) {
        case 37:
            // left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 38:
            // up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39:
            // right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40:
            // down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default:
            break;
    }
});

document.addEventListener("touchstart", function(event) {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

document.addEventListener("touchend", function(event) {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    // 滑动大于一定范围才会触发移动
    if (Math.abs(deltaX) < 0.2 * documentWidth && Math.abs(deltaY) < 0.2 * documentWidth) {
        return;
    }

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        // 在 x 轴方向滑动
        if (deltaX > 0) {
            // 向 x 轴正方向移动（右）
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else if (deltaX < 0) {
            // 向 x 轴负方向移动（左）
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }

    } else {
        // 在 y 轴方向滑动
        if (deltaY > 0) {
            // 向 y 轴正方向移动（下）
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else if (deltaY < 0) {
            // 向 y 轴负方向移动（上）
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
    }
});

function isGameOver() {

    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}

function gameOver() {
    alert("game over!");
}

function moveLeft() {
    if (! canMoveLeft(board)) {
        return false;
    }

    // move left
    for (var i = 0; i < 4; i ++) {
        // 不用考虑第一列
        for (var j = 1; j < 4; j ++) {
            // 存在元素
            if (board[i][j] != 0) {

                for (var k = 0; k < j; k ++) {
                    // 当前元素为零，并且第 i 行从 k 到 j 没有其他元素（障碍物）
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // 移动，从 [i][j] 移动到 [i][k]
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        // 元素相等，且中间没有其他元素
                        // 移动
                        showMoveAnimation(i, j, i, k);

                        // 元素叠加
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        // 加分
                        score += board[i][k];
                        updateScore(score);

                        // 碰撞判断
                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (! canMoveRight(board)) {
        return false;
    }

    // move right
    for (var i = 0; i < 4; i ++) {
        // 不用考虑第一列
        for (var j = 2; 0 <= j; j --) {
            // 存在元素
            if (board[i][j] != 0) {

                for (var k = 3; j < k; k --) {
                    // 当前元素为零，并且第 i 行从 j 到 k 有其他元素（障碍物）
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        // 移动，从 [i][j] 移动到 [i][k]
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        // 元素相等，且中间没有其他元素
                        // 移动
                        showMoveAnimation(i, j, i, k);

                        // 元素叠加
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        // 加分
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (! canMoveUp(board)) {
        return false;
    }

    // move up
    for (var j = 0; j < 4; j ++)  {
        // 不用考虑第一行
        for (var i = 1; i < 4; i ++) {
            // 存在元素
            if (board[i][j] != 0) {

                for (var k = 0; k < i; k ++) {
                    // 当前元素为零，并且第 j 列从 k 到 i 行没有其他元素（障碍物）
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        // 移动，从 [i][j] 移动到 [k][j]
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
                        // 元素相等，且中间没有其他元素
                        // 移动
                        showMoveAnimation(i, j, k, j);

                        // 元素叠加
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        // 加分
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown() {
    if (! canMoveDown(board)) {
        return true;
    }

    for (var j = 0; j < 4; j ++)  {
        // 不用考虑最后
        for (var i = 2; 0 <= i; i --) {
            // 存在元素
            if (board[i][j] != 0) {

                for (var k = 3; i < k; k --) {
                    // 当前元素为零，并且第 j 列从 i 到 k 没有其他元素（障碍物）
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        // 移动，从 [i][j] 移动到 [k][j]
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
                        // 元素相等，且中间没有其他元素
                        // 移动
                        showMoveAnimation(i, j, k, j);

                        // 元素叠加
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        // 加分
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}
