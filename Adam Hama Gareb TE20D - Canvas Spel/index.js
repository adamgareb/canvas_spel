const canvas = document.
  querySelector('canvas')
//c = context
const c = canvas.getContext('2d')

//This width and height function positions the screen so it takes up the whole screen
canvas.width = innerWidth
canvas.height = innerHeight

//Variable for the background music using the Audio function
var audio = new Audio("Thor's Hammer - Ethan Meixsell.mp3")

//Const function for the score from the HTML
const  scoreEl = document.querySelector('#scoreEl')

//const function for the Start Game button
const startGameBtn = document.querySelector('#startGameBtn')

//const funtion for the modalEl
const modalEl = document.querySelector('#modalEl')

//const funtion for score after game over
const bigScoreEl = document.querySelector('#bigScoreEl')

//This class function here is what defines the players' function. We give it a constructor that
//allows us to set the x coordinate, y coordinate, the radius and lastly the color
//Then below we see this draw function. This will draw the player, and in this case make it into a
//circle using the Math.PI * 2
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

//This class functions is what makes the projectiles in this game work. The projectiles are used
//as bullets to shoot the enemies
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    
    }
}

//Enemy class for the enemies
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    
    }
}

//This is code for the first player, where we set the coordinates for it so we can see it on the
//bottom right part of the browser
let player1 = new Player(900, 620, 30, 'purple')

//And this is for the second player, slightly different coordinates so it appears on the bottom left
//part of the browser
let player2 = new Player(450, 620, 30, 'blue')

//Let function for projectiles
let projectiles = []

//Let function for enemies
let enemies = []

//function for all of our classes above
function init() {
    player1 = new Player(900, 620, 30, 'purple')
    player2 = new Player(450, 620, 30, 'blue')
    projectiles = []
    enemies = []
    score = 0
    scoreEl.innerHTML = score
}

//Function for spawning enemies, putting it's x-y functions, radius, color, velocity
function spawnEnemies() {
    setInterval(() => {
        const radius = 20
        const x = Math.random() * canvas.width
        const y =  0
        const color = 'green'
        
        const angle = Math.atan2(canvas.height / 1.55 - y, canvas.width / 2 - x)
    
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

//Animate function for the players, enemies and projectiles
let animationId
let score = 0
function animate() {
    animationId = requestAnimationFrame(animate)
    //We use this rgba function here and type 0.1 in the end to make a somewhat blurry effect on the
    //projectiles
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player1.draw()
    player2.draw()
    projectiles.forEach((projectile) =>
    {
        projectile.update()
    })

    //Various functions for enemy
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player1.x - enemy.x, player1.y - enemy.y)

        const dist2 = Math.hypot(player2.x - enemy.x, player2.y - enemy.y)

        //If statements for when hit it will end game if enemies touch players
        //This modalEl display is for the Start Game ('Game Over') screen to reappear when you get hit
        if (dist - enemy.radius - player1.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        if (dist - enemy.radius - player2.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        if (dist2 - enemy.radius - player1.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        if (dist2 - enemy.radius - player2.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }


        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            //If statement to when projectiles touch enemy
            if (dist - enemy.radius - projectile.radius < 1)
            {
            //This allows the player to get 100 score whenever a projectile hits enemy
            score += 100
            scoreEl.innerHTML = score
            //This is to prevent bugging when shooting enemies
            setTimeout(() => {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
            }, 0)
            }
        })
    })
}

//This const angle here is what lets the console in the browser know where you've clicked, which will
//come in handy for the shooting later
addEventListener('click', (event)  => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2, 
        event.clientX - canvas.width / 2)

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(
        canvas.width / 3.15, 
        canvas.height / 1.1,
        5, 'gray', velocity)
    )
})

addEventListener('click', (event) => 
    {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2, 
        event.clientX - canvas.width / 2)

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(
        canvas.width / 1.57, 
        canvas.height / 1.1,
        5, 'pink', velocity)
    )

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
    audio.play()
})

})