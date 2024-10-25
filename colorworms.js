
const Rule = 110;
const Ether = 'ooooo...o..oo.';
const ether = parseInt(Ether.replaceAll('.','0').replaceAll('o','1'), 2);
const WorldSize = 14 * 12 * 12;
const Window = { size: 14 * 12, begin: 14 * 12 * 6, end: 14 * 12 * 7};

const airGlider = 0b111110; // seems to split into two gliders which move in opposite directions
const sGlider = 0b110000; // oo.... dirty as it seems to split into two gliders which move in opposite directions (might be part of larger glider)

const lGlider = 0b11101110100110;// ooo.ooo.o..oo. seems to be a true spaceship/glider which moves to the right with periode 3

//let world = Array(WorldSize).fill('.');
let initEarth = Array(WorldSize / 14).fill(Ether).join('');

let world = initEarth.split('');

function initWorld(){
  initEarth = Array(WorldSize / 14).fill(Ether).join('');	
  world = initEarth.split('');
}

function mixInPattern(area, position, life, debug = false) {
  const pattern = life.toString(2).replaceAll('0','.').replaceAll('1','o');
  if (debug) {
    console.log('before ' + area.slice(position, position + Ether.length).join(''));
    console.log('pattern ', pattern);
  }  
  let p = position + Ether.length - pattern.length;
  for (let one of pattern) {
	area[p] = one;  
	++p;  
  }
  if (debug) {
    console.log('after ' + area.slice(position, position + Ether.length).join(''));
  }  
}

function replaceEtherBlock(area, position, life, debug = false) {
  let block = Array(Ether.length).fill('.');	
  let pattern = life.toString(2).replaceAll('0','.').replaceAll('1','o').split('');
  // console.log(pattern.join(''));
  let j = Ether.length - 1;
  for(let i = pattern.length - 1; i >= 0; --i) {
	block[j] = pattern[i];  
	--j;
  }
  if (pattern.length > Ether.length) return NaN; 
  if (debug) {
    console.log('before ' + area.slice(position, position + Ether.length).join(''));
    console.log('block ', block.join(''));
  }   
  let p = position;
  for (let one of block) {
	area[p] = one;  
	++p;  
  }
  if (debug) {
    console.log('after ' + area.slice(position, position + Ether.length).join(''));
  }  
}

function webInPattern(area, position, life, debug = false) {
  const pattern = life.toString(2).replaceAll('0','.').replaceAll('1','o');
  if (debug) {
    console.log('before ' + area.slice(position, position + Ether.length).join(''));
    console.log('pattern ', pattern);
  } 
    
  const areaEnd = area.length;  
  const part1 = area.slice(0, position).join('');
  const part2 = area.slice(0, position).join('');
  const newWorld = (part1 + pattern + part2).split('');

  let p = 0;  
  for (let one of newWorld) {
    area[p] = one;
    ++p;  
  }  
  if (debug) {
    console.log('after ' + area.slice(position, position + Ether.length).join(''));
  }  
}

function insertLife(area, position, life) {
  let cells = life;
  let now = position;
  
  while (cells > 0 ) {
	const cell = cells % 2;
	cells = Math.floor(cells/2);  
	area[now] = cell ? 'o' : '.' ;	
	--now;
  }
}

function printWorld() {
  console.log(world.join(''));	
}

function printWindow() {
  const area = world.slice(Window.begin, Window.end);
  console.log(area.join(''));
}

function printWorldWithoutAir(){
  console.log(world.join('').replaceAll(Ether, Array(Ether.length).fill('.').join('')));		
}

function printWindowWithoutAir() {
  const area = world.join('').replaceAll(Ether, Array(Ether.length).fill('.').join(''));
  console.log(area.split('').slice(Window.begin, Window.end).join(''));  
}

// corrects the moving ether 
function printWindowStaticEther() {
  let area = world.slice(Window.begin, Window.end);
  let correction = 0;
  while(area.join('').indexOf(Ether) != 0) {
	area = world.slice(Window.begin + correction, Window.end  + correction);  
	--correction;  
  }
  console.log(area.join(''));
}

// corrects the moving ether and removes the background patter or ether
function printWindow0airStaticEther() {
  let area = world.slice(Window.begin, Window.end);
  let correction = 0;
  while(area.join('').indexOf(Ether) != 0) {
	area = world.slice(Window.begin + correction, Window.end  + correction);  
	--correction;  
  }
  const airfree = world.join('').replaceAll(Ether, Array(Ether.length).fill('.').join(''));
  ++correction;
  area = airfree.split('').slice(Window.begin + correction, Window.end  + correction);  
  console.log(area.join(''));
}

function print0AirDebug() {
  const area = world.join('').replaceAll(Ether, Array(Ether.length).fill('.').join(''));
  const gap = area.split('').slice(Window.begin + Window.size * 0.5, Window.end).join('');  
  const living = countLivingCells(gap);
  console.log(`${gap} cells ${living}`);
}

function printCWorld() {
  const cworld = [];	
  for(let i = 0; i < world.length; i+=3) {
	const pattern = world[i] + world[i+1]  + world[i+2];
	let sign = '_';
	switch(pattern) {
		case '..o': sign = "'";
		            break;
		case '.o.': sign = '.';
		            break;            
		case '.oo': sign = '-';
		            break;
		case 'o..': sign = ',';
		            break;
		case 'o.o': sign = 'u';
		            break; 
		case 'oo.': sign = 'n';
		            break;
		case 'ooo': sign = '=';
		            break;                                                           
	}
	cworld.push(sign);
  }
  console.log(cworld.join(''));
}

function applyRule(area, rule) {
  let preliminary = Array(area.length).fill('.');	
  for (let i = 1; i < (area.length - 1); ++i) {
	let value = 0;
	value += area[i - 1] == 'o' ? 4 : 0; 
	value += area[i] == 'o' ? 2 : 0; 
	value += area[i + 1] == 'o' ? 1 : 0; 
	const alife = (rule & (2 ** value)) != 0;
	preliminary[i] = alife ? 'o' : '.';
  }  
  for (let i = 0; i < area.length; ++i) {
	area[i] = preliminary[i];  
  }
}

function applyRule110(area) {
   let preliminary = Array(area.length).fill('.');	
  for (let i = 1; i < (area.length - 1); ++i) {
	let check = area[i-1] + area[i] + area[i+1];
	let alife = true;
	switch(check){
	  case 'ooo': alife = false;
	              break;	     
	  case 'o..': alife = false;
	              break;	
	  case '...': alife = false;
	              break;
	}
	preliminary[i] = alife ? 'o' : '.';
  }  
  for (let i = 0; i < area.length; ++i) {
	area[i] = preliminary[i];  
  }
}

function applyNtimes(area, rule, n, print) {
  for(let i = 0; i < n; ++i) {
	rule(area);  
	print();
  }	
}

function checkIfPeriodicObject(rule, object, maxPeriode, insert, debug = false){
  let found1 = 0; 	
  let initialPosition = Ether.length * 5;
  let position = initialPosition;
  const test = Array(WorldSize / 14).fill(Ether).join('').split('');
  insert(test, Window.begin + initialPosition, object);  
  
  const O = object.toString(2).replaceAll('1', 'o').replaceAll('0','.');
  const nCells = countLivingCells(O);
  let mutations = [];
  for(let i = 0; i < maxPeriode; ++i) {
	rule(test);
	const airfree = test.join('').replaceAll(Ether, Array(Ether.length).fill('.').join(''));
	const begin = Window.begin;
	const wsize = Window.size;
	const Area = airfree.slice(Window.begin, Window.end);
	const currentCells = countLivingCells(Area);	
	let where = Area.indexOf(O);
	if (debug) {
	  console.log(`search for ${O} , object cells ${nCells}, living cells ${currentCells}, where ${where}`);	
	  console.log(Area);
	}
	if (found1 > 0) {
	  const patternStart = Area.indexOf('o');
	  const tail = Area.slice(patternStart, Area.length);
	  const mutation = tail.split(Array(14).fill('.').join(''));
	  mutations.push(mutation.join(''));	
	}
	if(where > 0 && nCells == currentCells) {
	  console.log(`${O} refound at iteration ${i}`);
	  if(found1 > 0) {
		const periode = i - found1 + 1;  
		const speed = (where - initialPosition) / periode;
		return {periode: periode, speed: speed, mutations: JSON.parse(JSON.stringify(mutations))};
	  } else {
		found1 = i;  
	  } 
	}
  }	
  return {};
}

function countLivingCells(pattern) {
  let alife = 0;	
  for(let one of pattern) {
	if(one == 'o') ++alife; 
  }
  return alife; 
}


function searchForLife(cells, maxPeriode, insert) {
  const zoo = [];	
  for (let o = 16; o < 2 ** cells; ++o) {
	let found = checkIfPeriodicObject(applyRule110, o, maxPeriode, insert);  
	if(Object.keys(found).length > 0) {
	  const worm = o.toString(2).replaceAll('1', 'o').replaceAll('0','.');	
	  zoo.push({
		  pattern: worm, 
		  binary: o, 
		  periode: found.periode, 
		  speed: found.speed, 
		  mutations: found.mutations
	  });	
	}	
	if(o%512 == 0){
	  console.log('.');	
	}
  }	
  console.log('done');
  return zoo;
}

function searchFor14bitLife(maxPeriode = 42) {
  const zoo = [];	
  const insert = replaceEtherBlock;
  for (let o = 0; o < 2 ** 14; ++o) {
	let found = checkIfPeriodicObject(applyRule110, o, maxPeriode, insert);  
	if(Object.keys(found).length > 0) {
	  const worm = (o + 2 ** 15).toString(2).replaceAll('1', 'o').replaceAll('0','.').slice(2);	
	  zoo.push({
		  pattern: worm, 
		  binary: o < 2 ** 13 ? -o : o, 
		  periode: found.periode, 
		  speed: found.speed, 
		  mutations: found.mutations
	  });	
	}
	if(o%512 == 0){
	  console.log('.');	
	}
  }	
  console.log('done');
  return zoo;
}
