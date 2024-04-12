const video = document.getElementById('input_video');

const out = document.getElementById('camera_canvas');
const output_canvas = out.getContext('2d');

const game = document.getElementById('game_canvas');
const game_canvas = game.getContext('2d')

const distance_text = document.getElementById('distance')



class Paddle {
    constructor({ position }) {
      this.position = position
      this.velocity = {
        x: 0,
        y: 0,
      }
      this.width = 4
      this.height = 20
    }

    draw() {
      game_canvas.fillStyle = 'black'
      game_canvas.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
      this.draw()

      if (
        this.position.y + this.velocity.y > 0 &&
        this.position.y + this.height + this.velocity.y <= game.height
      ) {
        this.position.y += this.velocity.y
      }
    }
}



class Ball {
    constructor({ position }) {
      this.position = position

      const speed = 2
      const direction = {
        x: Math.random() - 0.5 >= 0 ? -speed : speed,
        y: Math.random() - 0.5 >= 0 ? -speed : speed,
      }
      this.velocity = {
        x: direction.x,
        y: direction.y,
      }

      this.width = 4
      this.height = 4
    }

    draw() {
      game_canvas.fillStyle = 'black'
      game_canvas.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
      this.draw()
      const rightSide = this.position.x + this.width + this.velocity.x
      const leftSide = this.position.x + this.velocity.x
      const bottomSide = this.position.y + this.height
      const topSide = this.position.y

      // paddle 1 collision
      if (
        leftSide <= paddle1.position.x + paddle1.width &&
        bottomSide >= paddle1.position.y &&
        topSide <= paddle1.position.y + paddle1.height
      ) {
        this.velocity.x = -this.velocity.x
      }

      // paddle 2 collision
      if (
        rightSide >= paddle2.position.x &&
        bottomSide >= paddle2.position.y &&
        topSide <= paddle2.position.y + paddle2.height
      ) {
        this.velocity.x = -this.velocity.x
      }

      // reverse y directions
      if (
        this.position.y + this.height + this.velocity.y >= game.height ||
        this.position.y + this.velocity.y <= 0
      ) {
        this.velocity.y = -this.velocity.y
      }

      //reset Ball
      if (
        this.position.x + this.width + this.velocity.x >= game.width ||
        this.position.x + this.velocity.x <= 0
      ) {
        this.position.x = game.width / 2
        this.position.y = game.height / 2
      }
      

      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }

  const paddle1 = new Paddle({
    position: {
      x: 10,
      y: 100,
    },
  })

  const paddle2 = new Paddle({
    position: {
      x: game.width - 10 * 2,
      y: 100,
    },
  })

  const ball = new Ball({
    position: {
      x: game.width / 2,
      y: game.height / 2,
    },
})



function animate() {
    requestAnimationFrame(animate)
    game_canvas.fillStyle = 'white'
    game_canvas.fillRect(0, 0, game.width, game.height)
    
    paddle2.position.y = ball.position.y
    
    paddle1.update()
    paddle2.update()

    ball.update()

}

animate()




function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1);
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
  }
  
  

  
function onResultsPose(results) {

    console.log(results)
    
    output_canvas.save();
    output_canvas.clearRect(0, 0, out.width, out.height);
    output_canvas.drawImage(
        results.image, 0, 0, out.width, out.height);
    drawConnectors(
        output_canvas, results.poseLandmarks, POSE_CONNECTIONS, {
            color: (data) => {
              const x0 = out.width * data.from.x;
              const y0 = out.height * data.from.y;
              const x1 = out.width * data.to.x;
              const y1 = out.height * data.to.y;
    
              const z0 = clamp(data.from.z + 0.5, 0, 1);
              const z1 = clamp(data.to.z + 0.5, 0, 1);
    
              const gradient = output_canvas.createLinearGradient(x0, y0, x1, y1);
              gradient.addColorStop(
                  0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
              gradient.addColorStop(
                  1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
              return gradient;
            }
        });

    drawLandmarks(
        output_canvas,
        Object.values(POSE_LANDMARKS_LEFT)
              .map(index => results.poseLandmarks[index]),
          {color: zColor, fillColor: '#FF0000'});

      drawLandmarks(
        output_canvas,
          Object.values(POSE_LANDMARKS_RIGHT)
              .map(index => results.poseLandmarks[index]),
          {color: zColor, fillColor: '#00FF00'});

      drawLandmarks(
        output_canvas,
          Object.values(POSE_LANDMARKS_NEUTRAL)
              .map(index => results.poseLandmarks[index]),
          {color: zColor, fillColor: '#AAAAAA'});

      output_canvas.restore();    
  
      output_canvas.fillStyle = 'red'
      output_canvas.fillRect(results.poseLandmarks[16].x * out.width,
        results.poseLandmarks[18].y * out.height,
        10,10)    

      
      
     
      //shoulderDistance.innerHTML = "Shoulder Distance: " + (results.poseLandmarks[11].x - results.poseLandmarks[12].x);
      //Nose: 0  ; Left Eye: 2 ; Right Eye: 5 ; Mouth: 9, 10 ; Left Shoulder: 11 ; Right Shoulder: 12 ; Left Elbow: 13 ; Right Elbow: 14 ; Left Hand: 15 ; Right Hand:16
   
    // Forward Backward motion moves the paddle
    /*if ((results.poseLandmarks[11].x - results.poseLandmarks[12].x)  >  0.2) {
        paddle1.velocity.y = -4
    } else {
        paddle1.velocity.y = 4
    }   */


    //Right Hand
    
    if ((results.poseLandmarks[11].x - results.poseLandmarks[12].x)  <  0.2) {
      paddle1.position.y =  (results.poseLandmarks[18].y * game.height * 1.25 - 50 )
      distance_text.innerHTML = "Right Distance"
    }
    else {
      distance_text.innerHTML = "Too Close"
    }   

    // Squats
    /*
    if ((results.poseLandmarks[11].x - results.poseLandmarks[12].x)  <  0.2) {
      paddle1.position.y =  (results.poseLandmarks[0].y * game.height * 1.25 - 100 )
      distance_text.innerHTML = "Right Distance"
    }
    else {
      distance_text.innerHTML = "Too Close"
    }
    */

}





    
  
  
const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});
pose.onResults(onResultsPose);
    
  
  
const camera = new Camera(video, {
    onFrame: async () => {
       await pose.send({image: video});
    },
    width: 1280,
    height: 720
});
camera.start();

