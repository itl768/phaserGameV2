// import MainScene from './scenes/main'
import GameScene from './scenes/GameScene'
import Phaser from 'phaser'
import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  width: 800,
	height: 600,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    // width: window.innerWidth * window.devicePixelRatio,
    // height: window.innerHeight * window.devicePixelRatio
  },
	scene: [GameScene,HelloWorldScene] ,
   physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 200 }
    }
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config)
})

// import HelloWorldScene from './scenes/HelloWorldScene'
// import GameScene from './scenes/GameScene'

// const config: Phaser.Types.Core.GameConfig = {
// 	type: Phaser.AUTO,
// 	width: 800,
// 	height: 600,
// 	physics: {
// 		default: 'arcade',
// 		arcade: {
// 			gravity: { y: 300 }
// 		}
// 	},
// 	scene: [GameScene,HelloWorldScene]
// }

// export default new Phaser.Game(config)