const CellsInBasicMode = (28 * 5) * (28 * 2.5);
let World = [];
let Speed = 0;
let BlockCorrection = false;
let NewLife = [];
let Periode = 0;

// console hook 
/*
console.log = function() {
  GRID.textContent += '*' + Array.from(arguments).join('') + '\n';
};
*/

function fillGrid(){
  let cells = [];
  for (let i = 0; i < CellsInBasicMode; ++i) {
    const cell = `<div class='cell' id = 'cell${i}' onclick='changeCell(${i})'></div>`;
    cells.push(cell);
  }
  GRID.innerHTML = cells.join('');
}

function initialize() {
  Periode = 0;
  GRID.style.overflowX = 'initial';
  GRID.style.overflowY = 'initial';
  fillGrid();
  if(MODE == 'basic') {
    initEarth = Array(CellsInBasicMode / 14).fill(Ether).join('');	
    World = initEarth.split('');
    for(let i = 0; i < CellsInBasicMode; ++i) {
      document.getElementById('cell' + i).style.backgroundColor = World[i] == '.' ? 'white' : 'lightgrey';
    }
  }
}

function update() {
  if(Speed <=0) return;
  for(let i = 0; i < Speed; ++i) {
    applyRule110(World);
    ++Periode;
  }  
  const ethermove = World.join('').indexOf(Ether);
  if(BlockCorrection) {
    const Cut = World.join('').slice(ethermove, CellsInBasicMode - Ether.length + ethermove);
    World = Periode % 7 == 0 ? (Ether + Cut).split('') : (Cut + Ether).split('');
    if(World.length !== CellsInBasicMode) {
      console.log('error: world size changed');
    }
  }
  const etherfree = World.join('').replaceAll(Ether, Array(Ether.length).fill('.').join(''));
  
  if(MODE == 'basic') {
      for(let i = 0; i < CellsInBasicMode; ++i) {
        const color = etherfree[i] == '.' ? 'lightgrey' : 'black';
        document.getElementById('cell' + i).style.backgroundColor = World[i] == '.' ? 'white' : color;
      }
  }
}

function changeCell(n) {
  World[n] = World[n] == '.' ? 'o' : '.';
  document.getElementById('cell' + n).style.backgroundColor = World[n] == '.' ? 'white' : 'red';
}

function SpeedMenu(){
  document.getElementById('speed').style.fontSize = '2em';
  document.getElementById('speed').style.visibility = 'visible';
  document.getElementById('currentspeed').textContent = Speed; 
}

function CloseMenu(){
  document.getElementById('speed').style.visibility = 'hidden';
  document.getElementById('settings').style.visibility = 'hidden';
  document.getElementById('searchlife').style.visibility = 'hidden';
  document.getElementById('speed').style.fontSize = '1px';
  document.getElementById('settings').style.fontSize = '1px';
  document.getElementById('searchlife').style.fontSize = '1px';
}

function changeSpeed(speed) {
  if ((Speed + speed) >= 0) {
    Speed += speed;
    document.getElementById('currentspeed').textContent = Speed;  
  }
}

function blockCorrection() {
  BlockCorrection = !BlockCorrection;
  document.getElementById('blockCorrection').textContent = BlockCorrection ? 'on' : 'off';
}

function SettingsMenu(){
  document.getElementById('settings').style.fontSize = '2em';
  document.getElementById('settings').style.visibility = 'visible';
  document.getElementById('blockCorrection').textContent = BlockCorrection ? 'on' : 'off';
}

function SearchLifeMenu(){
  document.getElementById('searchlife').style.fontSize = '2em';
  document.getElementById('searchlife').style.visibility = 'visible';
}

function search14bitLife(){
  GRID.style.overflowX = 'hidden';
  GRID.style.overflowY = 'scroll';
  GRID.textContent = '';
  NewLife = searchFor14bitLife();
  GRID.textContent = JSON.stringify(NewLife);
}

function searchSmallLife(){
  GRID.style.overflowX = 'hidden';
  GRID.style.overflowY = 'scroll';
  GRID.textContent = '';
  NewLife = searchForLife(13, 42, webInPattern);
  GRID.textContent = JSON.stringify(NewLife);
}

setInterval(update, 1000);