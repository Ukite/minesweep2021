


function renderBoard(numRows, numCols, grid) {           /* function可理解为定义函数，括号内为参数 */
    let boardEl = document.querySelector("#board");      /* 盒子模型中的board属性 */

    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr");           /* 创建变量并为其命名，tr为表中的一行 */
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";                     /* cellel表示一个小块 */
            grid[i][j].cellEl = cellEl;                    /* 为每个小格定义值（变量） */

            // if ( grid[i][j].count === -1) {
            //     cellEl.innerText = "*";    
            // } else {
            //     cellEl.innerText = grid[i][j].count;
            // }
            function handler(){
                cellEl.classList.toggle("sweep");
            }
    
            cellEl.addEventListener("contextmenu",handler)
                board.oncontextmenu = function () {
                    return false
                }                                           /* 取消默认右击动作 */

            cellEl.addEventListener("click", (e)=> {
                if (grid[i][j].count === -1) {
                    explode(grid, i, j, numRows, numCols)
                    return;
                }

                if (grid[i][j].count === 0 ) {
                    searchClearArea(grid, i, j, numRows, numCols);
                } else if (grid[i][j].count > 0) {
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear");
                    grid[i][j].cellEl.innerText = grid[i][j].count;
                }

                checkAllClear(grid);
                // cellEl.classList.add("clear");
            })
            cellEl.addEventListener("click",(e)=> {
                easyClearArea(grid, i, j, numRows, numCols);
            });
            

            let tdEl = document.createElement("td");          /* td为表中的一列 */
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
    }
}

const directions = [
    [-1, -1], [-1, 0], [-1, 1], // TL, TOP, TOP-RIGHT
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
    ]
    
    // 创建方向函数，代表一个雷周围的八个方向，为其定义（方向数值）//
    
function initialize(numRows, numCols, numMines) {
    let grid = new Array(numRows);                         /* grid为小网格 */
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = {                                 
                clear: false,
                count: 0
            };                       /* 为grid定义初始量，最初clear为false，表示未被点击（清理） */
        }
    }
    
    let mines = [];
    for (let k = 0; k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols);
        // Math.trunc表示取整，Math.random（）为一随机函数，可得0-1之间的任意随机数
        // 这一步的目的时在盘面上随机分布雷，cellsn为名称
        let row = Math.trunc(cellSn / numCols);
        let col = cellSn % numCols;
    
        // 此处目的是提取出雷的行、列坐标
    
        console.log(cellSn, row, col);              /* 输出参数，相当于print */
    
        grid[row][col].count = -1;
        mines.push([row, col]);                     /* 令有雷的格数值为-1，并为雷赋行列值 */
    }
    
    // 计算有雷的周边为零的周边雷数
    for (let [row, col] of mines) {                    /* 从雷里定义值 */
        console.log("mine: ", row, col);
        for (let [drow, dcol] of directions) {         /* 定义方向值 */
            let cellRow = row + drow;
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                continue;
            }                                          /* 若值符合上述条件则跳过，进行下一步 */
            if (grid[cellRow][cellCol].count === 0) {
                console.log("target: ", cellRow, cellCol);
    
                let count = 0;
                for (let [arow, acol] of directions) {
                    let ambientRow = cellRow + arow;
                    let ambientCol = cellCol + acol;
                    if (ambientRow < 0 || ambientRow >= numRows || ambientCol < 0 || ambientCol >= numCols) {
                        continue;
                    }
                    // 遍历每个方向数值，
                    if (grid[ambientRow][ambientCol].count === -1) {
                        console.log("danger!", ambientRow, ambientCol);
                        count += 1;
                    }
                }
    
                if (count > 0) {
                    grid[cellRow][cellCol].count = count;
                }
            }
            // 这是一个计算出周围雷数量的循环
        }
    
    }
    
    // console.log(grid);
    
    return grid;
}

function searchClearArea(grid, row, col, numRows, numCols) {
    let gridCell = grid[row][col];
    gridCell.clear = true;
    gridCell.cellEl.classList.add("clear");

    for (let [drow, dcol] of directions) {                      /* 遍历每个方向 */
        let cellRow = row + drow;
        let cellCol = col + dcol;
        console.log(cellRow, cellCol, numRows, numCols);
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }

        let gridCell = grid[cellRow][cellCol];

        console.log(cellRow, cellCol, gridCell);
        
        if (!gridCell.clear) {                               /* 若未检查过，则进行检查 */
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            if (gridCell.count === 0) {                      /* 递归函数，等于0则再次执行，清空 */
                searchClearArea(grid, cellRow, cellCol, numRows, numCols);
            } 
            else if (gridCell.count > 0) {                   /* 若有数值，则附近有雷，显示此值 */
                gridCell.cellEl.innerText = gridCell.count;
            } 
        }
    }
}

function easyClearArea(grid, row, col, numRows, numCols) {
    for (let [drow, dcol] of directions) {         
        let cellRow = row + drow;
        let cellCol = col + dcol;
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }                                          
        let count1 = 0;
        if (grid[cellRow][cellCol].count === -1) {
            count1 += 1;
        }
            if (grid[row][col].count = count1)  {
                for (let [drow, dcol] of directions) {        
                    let cellRow = row + drow;
                    let cellCol = col + dcol;
                    if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                        continue;
                    }        
    
                    let gridCell = grid[cellRow][cellCol];
    
                    if (gridCell.count === 0) {
                        gridCell.clear = true;
                        gridCell.cellEl.classList.add("clear");
                        easyClearArea(grid, cellRow, cellCol, numRows, numCols);
                    }
    
                    if (gridCell.count > 0) {
                        gridCell.clear = true;
                        gridCell.cellEl.classList.add("clear");                 
                        gridCell.cellEl.innerText = gridCell.count;
                    }
                } 
            }
    }
}
    
function explode(grid, row, col, numRows, numCols) {
    grid[row][col].cellEl.classList.toggle("exploded");         /* 添加explode样式 */
            
    for (let cellRow = 0; cellRow < numRows; cellRow++) {
        for (let cellCol = 0; cellCol < numCols; cellCol++) {
            let cell =  grid[cellRow][cellCol];
            cell.clear = true;
            cell.cellEl.classList.add('clear');
                    // 在雷爆破的同时，将其他非雷格清空
            
            if (cell.count === -1) {                        
                cell.cellEl.classList.add('landmine');
                cell.cellEl.classList.toggle("sweep");
            }
        }
    }                   
        return false
} 

function checkAllClear(grid) {
    for (let row = 0; row < grid.length; row ++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col ++) {
            let cell = gridRow[col];
            if (cell.count !== -1 && !cell.clear) {
                return false;
            }
        }
    }
            
    for (let row = 0; row < grid.length; row ++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col ++) {
            let cell = gridRow[col];
            if (cell.count === -1) {
                cell.cellEl.classList.toggle('landmine');
            }
                        
            cell.cellEl.classList.remove("landmine")
            cell.cellEl.classList.toggle("success")
        }
    }
    swal("Win")
    return true;
}        




function start() {
    swal(document.getElementById("s").value)
    switch (document.getElementById("s").value) {
        case "Easy": {
            grid = initialize(9,9,9); //初始化，得到二维数组
            renderBoard(9,9,grid);
            break;
        }
        case "Medium": { 
            grid = initialize(16, 16, 40); //初始化，得到二维数组
            renderBoard(16,16,grid);
            break;
        }
        case "Hard": {
            grids = initialize(16, 25, 88); //初始化，得到二维数组
            renderBoard(16,25,grids);
            break;
        }
    }
}

