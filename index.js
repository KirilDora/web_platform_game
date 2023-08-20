import platform from './img/platform.png'
//Project setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth//window.innerWidth
canvas.height = innerHeight

const gravity = 0.5
//Player creation
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100
    }
    //gravity moving down
    this.velocity = {
      x: 0,
      y: 0
    }

    this.width = 30
    this.height = 30
  }

  draw(){
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update(){
    this.draw()
    this.position.x += this.velocity.x //movin left/right
    this.position.y += this.velocity.y //moving up/down

    if(this.position.y + this.height + this.velocity.y <= canvas.height){
      this.velocity.y += gravity//accelerate through time
    }
    else{this.velocity.y = 0}
    
  }
}

class Platform {
  constructor({x, y}){
    this.position = {
      x,//x: x
      y//y: y
    }

    this.width = 200
    this.height = 30
  }

  draw(){
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const player = new Player()
const platforms = [new Platform({x: 200, y: 100}), 
  new Platform({x: 500, y: 200})]

const keys = {//using object to move without acceleration
  right:{
    pressed: false
  },
  left:{
    pressed: false
  }
}
//how far platforms scroll on the screen
let scrollOffset = 0

//to loop animation
function animate(){
  requestAnimationFrame(animate)//looping frame
  c.clearRect(0, 0, canvas.width, canvas.height)//to maintain player in borders
  player.update()
  platforms.forEach(platform => {
    platform.draw()  
  });

  //scrolling the background
  if (keys.right.pressed && player.position.x < 400){//borders right
    player.velocity.x = 5;
  }else if (keys.left.pressed && player.position.x > 100){//border left
    player.velocity.x = -5;
  }else {
    //after crossing borders 
    //background start to move/leave/scrolling
    player.velocity.x = 0

    if (keys.right.pressed){
      scrollOffset += 5
      platforms.forEach(platform => {
        platform.position.x -= 5  
      })  
    } else if (keys.left.pressed){
      scrollOffset -= 5
      platforms.forEach(platform => {
        platform.position.x += 5  
      })
    }
  }

  //platform collision detection
  platforms.forEach(platform => {
  if (player.position.y + player.height <= platform.position.y &&
    player.position.y + player.height + player.velocity.y >= platform.position.y &&//to climb on platform
    player.position.x + player.width >= platform.position.x &&//fall down after right side
    player.position.x <= platform.position.x + platform.width){//fall down after right side
    player.velocity.y = 0
    }
  })
  //win scenario
  if (scrollOffset > 2000) {
    console.log('You win!')
  }
}

animate()
//in console we check keyCode 
//to check what key we actually pressed 
addEventListener('keydown', ({ keyCode }) => {
  switch(keyCode){
    case 65: 
      console.log('left');
      keys.left.pressed = true
      break;

    case 83: 
      console.log('down');
      player.velocity.y += 20
      break;
    
    case 68: 
      console.log('right');
      keys.right.pressed = true
      break;

    case 87: 
      console.log('up');
      player.velocity.y -= 20
      break;
  }
})//window.
//not for lopping process 
//after button to be pressed
//as we dont touch the button
//we will not execute command
addEventListener('keyup', ({ keyCode }) => {
  switch(keyCode){
    case 65: 
      console.log('left');
      keys.left.pressed = false
      break;

    case 83: 
      console.log('down');
      player.velocity.y += 20
      break;
    
    case 68: 
      console.log('right');
      keys.right.pressed = false
      break;

    case 87: 
      console.log('up');
      player.velocity.y -= 20
      break;
  }
})