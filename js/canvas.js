import platform from '../img/platform.png'
import platformSmallTall from '../img/platformSmallTall.png'
import background from '../img/background.png'
import hills from '../img/hills.png'
//Project setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024//window.innerWidth
canvas.height = 576

const gravity = 0.5
//Player creation
class Player {
  constructor() {
    this.speed = 5
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
    
  }
}

class Platform {
  constructor({x, y, image}){
    this.position = {
      x,//x: x
      y//y: y
    }

    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw(){
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}
//decorations
class GenericObject {
  constructor({x, y, image}){
    this.position = {
      x,//x: x
      y//y: y
    }

    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw(){
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}
//return object Image created with needed source
function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)

let player = new Player()
let platforms = [
  new Platform({x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, y: 270, image: createImage(platformSmallTall)}),
  new Platform({x: -1, y: 470, image: platformImage}), 
  new Platform({x: platformImage.width - 3, y: 470, image: platformImage}),
  new Platform({x: platformImage.width * 2 + 100, y: 470, image: platformImage}),
  new Platform({x: platformImage.width * 3 + 300, y: 470, image: platformImage}),
  new Platform({x: platformImage.width * 4 + 300 - 2, y: 470, image: platformImage}),
  new Platform({x: platformImage.width * 5 + 700 - 2, y: 470, image: platformImage}),
]

let genericObjects = [
  new GenericObject({x: -1, y: -1, image: createImage(background)}),
  new GenericObject({x: -1, y: -1, image: createImage(hills)})
]

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

function init() {
  platformImage = createImage(platform)

  player = new Player()
  platforms = []
  genericObjects = []

  scrollOffset = 0

}
//to loop animation
function animate(){
  requestAnimationFrame(animate)//looping frame
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)//to maintain player in borders

  genericObjects.forEach(genericObject => {
    genericObject.draw
  })

  platforms.forEach(platform => {
    platform.draw()  
  });
  player.update()//update later than platform 
  //with a matter no to stay after platform

  //scrolling the background
  if (keys.right.pressed && player.position.x < 400){//borders right
    player.velocity.x = player.speed;
  }else if ((keys.left.pressed && player.position.x > 100) || 
  keys.left.pressed && scrollOffset === 0 && player.position.x > 0){//border left
    player.velocity.x = -player.speed;
  }else {
    //after crossing borders 
    //background start to move/leave/scrolling
    player.velocity.x = 0

    if (keys.right.pressed){
      scrollOffset += player.speed
      platforms.forEach(platform => {
        platform.position.x -= player.speed  
      })
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66
      })  
    } else if (keys.left.pressed && scrollOffset > 0){
      scrollOffset -= player.speed
      platforms.forEach(platform => {
        platform.position.x += player.speed  
      })

      genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed * .66
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
  //win condition
  if (scrollOffset > platformImage.width * 5 + 300 - 2) {
    console.log('You win!')
  }

  //lose condition
  //restart game from start point 
  //by reinitializing
  if(player.position.y > canvas.height){
    init()
  }
}

init()
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
      player.velocity.y += 10
      break;
    
    case 68: 
      console.log('right');
      keys.right.pressed = true
      break;

    case 87: 
      console.log('up');
      player.velocity.y -= 25
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
      break;
    
    case 68: 
      console.log('right');
      keys.right.pressed = false
      break;

    case 87: 
      console.log('up');
      break;
  }
})