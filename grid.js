const CellsInBasicMode = (28 * 5) * (28 * 2.5);
let World = [];
let Speed = 0;
let BlockCorrection = false;

function fillGrid(){
  let cells = [];
  for (let i = 0; i < CellsInBasicMode; ++i) {
    const cell = `<div class='cell' id = 'cell${i}' onclick='changeCell(${i})'></div>`;
    cells.push(cell);
  }
  GRID.innerHTML = cells.join('');
  initialize();
}

function initialize() {
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
  document.getElementById('speed').style.visibility = 'visible';
  document.getElementById('currentspeed').textContent = Speed; 
}

function CloseMenu(){
  document.getElementById('speed').style.visibility = 'hidden';
  document.getElementById('settings').style.visibility = 'hidden';
}

function decreaseSpeed(){
  Speed = Speed > 0 ? --Speed : Speed;
  document.getElementById('currentspeed').textContent = Speed;
}

function increaseSpeed(){
  ++Speed;
  document.getElementById('currentspeed').textContent = Speed;
}

function blockCorrection() {
  BlockCorrection = !BlockCorrection;
  document.getElementById('blockCorrection').textContent = BlockCorrection ? 'on' : 'off';
}

function SettingsMenu(){
  document.getElementById('settings').style.visibility = 'visible';
  document.getElementById('blockCorrection').textContent = BlockCorrection ? 'on' : 'off';
}

setInterval(update, 1000);