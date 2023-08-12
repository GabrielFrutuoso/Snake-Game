const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const audio = document.querySelector('audio')

const modal = document.querySelector('dialog')
const button = document.querySelector('button')
const scorePlayer = document.querySelector('.score')
const finalScore = document.querySelector('.finalScore')

let score = 0

ctx.fillStyle = 'white'
const size = 30


let snake = [
    {x: 240, y: 270},
]



const randomNumber = (min, max)=>{
    return Math.round(Math.random() * (max - min) + min)
  
}

const randomPosition = ()=>{
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / size) * size
}

const randomColor = ()=>{
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)
    
    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(), 
    y: randomPosition(), 
    color: randomColor()
}

let direction, loopID 

const drawFood = ()=>{

    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = ()=>{
   
snake.forEach((position)=>{
    ctx.fillStyle = '#3E5902'
    ctx.fillRect(position.x, position.y, size, size)
})

}


const moveSnake = ()=>{

    if(!direction) return

    const head = snake[snake.length -1]

    if(direction == 'right'){
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == 'left'){
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == 'down'){
        snake.push({x: head.x, y: head.y + size})
    }

    if(direction == 'up'){
        snake.push({x: head.x, y: head.y - size})
    }
    
  snake.shift()
}

const checkEat = ()=>{
    const head = snake[snake.length -1]

    if(head.x == food.x && head.y == food.y){
        snake.push(head)
        audio.play()
        score += 30
        scorePlayer.innerHTML = score
        finalScore.innerHTML = score
        
    

    let x = randomPosition()
    let y = randomPosition()

    while(snake.find((position)=>position.x == x && position.y == y)){
         x = randomPosition()
        y = randomPosition()
    }
    
    food.x = x
    food.y = y
    food.color = randomColor()
}}

const checkCollision = ()=>{
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfColision = snake.find((position, index)=>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfColision){
        gameOver()
    }
}

const gameOver = ()=>{
    direction = undefined
    modal.show()
}


const gameLoop = ()=>{
    clearInterval(loopID)

    ctx.clearRect(0, 0, 600, 600)
    
    moveSnake()
    drawSnake()
    drawFood()
    checkEat()
    checkCollision()

    loopID = setTimeout(()=>{
        gameLoop()
    }, 100)
}

button.addEventListener('click', ()=>{
    score = 0
    scorePlayer.innerHTML = '00'
    finalScore.innerHTML = '00'
    snake = [{x: 240, y: 270}]
    modal.close()

})

gameLoop()


document.addEventListener('keydown', ({key})=>{
    
    if(key == 'ArrowRight' && direction != 'left'){
        direction = 'right'
    }

    if(key == 'ArrowLeft' && direction != 'right'){
        direction = 'left'
    }

    if(key == 'ArrowDown' && direction != 'up'){
        direction = 'down'
    }

    if(key == 'ArrowUp' && direction != 'down'){
        direction = 'up'
    }


})