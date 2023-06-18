import Phaser from 'phaser'


import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from './BombSpawner'


const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'


export default class GameScene extends Phaser.Scene
{
    player: any
    cursors: any
    scoreLabel: any
    bombSpawner: any
    stars: any
    gameOver: boolean
	  jumpButton: Phaser.GameObjects.Text;
  leftButton: Phaser.GameObjects.Text;
  rightButton: Phaser.GameObjects.Text;
  isLeftButtonDown: boolean;
  isRightButtonDown: boolean;
	constructor()
	{
	super('game-scene')
    this.player = undefined
    this.cursors = undefined
    this.scoreLabel = undefined
    this.bombSpawner = undefined
	this.stars = undefined
	this.gameOver = false
    this.jumpButton = undefined;
    this.leftButton = undefined;
    this.rightButton = undefined;
	this.isLeftButtonDown = false;
    this.isRightButtonDown = false;


	}

	preload()
	{
		this.load.image('sky', 'assets/sky.png')
		this.load.image(GROUND_KEY, 'assets/platform.png')
		this.load.image(STAR_KEY, 'assets/star.png')
		this.load.image(BOMB_KEY, 'assets/bomb.png')

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
	}

  create() {
    this.add.image(400, 300, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

       this.jumpButton = this.createButton(400, 550, 'Jump', () => {
      this.player.setVelocityY(-330);
    });

    this.leftButton = this.createButton(50, 550, 'Left', () => {
      this.isLeftButtonDown = true;
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    });

    this.rightButton = this.createButton(750, 550, 'Right', () => {
      this.isRightButtonDown = true;
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    });

    this.leftButton.on('pointerup', () => {
      this.isLeftButtonDown = false;
      if (!this.isRightButtonDown) {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
      }
    });

    this.rightButton.on('pointerup', () => {
      this.isRightButtonDown = false;
      if (!this.isLeftButtonDown) {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }
 createButton(x, y, text, onClick) {
    const button = this.add.text(x, y, text, {
      fontSize: '20px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: {
        x: 10,
        y: 5,
      },
    })
      .setInteractive()
      .on('pointerdown', onClick)
      .on('pointerup', () => {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
      });

    return button;
  }
    
 collectStar(player, star)
	{
		star.disableBody(true, true)

		this.scoreLabel.add(10)

		if (this.stars.countActive(true) === 0)
		{
			//  A new batch of stars to collect
			this.stars.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true)
			})
		}

		this.bombSpawner.spawn(player.x)
	}

    update()
	{
        if (this.gameOver)
		{
			return
		}
		 if (this.isLeftButtonDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.isRightButtonDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330)
		}
	}
    hitBomb(player, bomb)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.gameOver = true
	}
    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

    createPlatforms()
	{
		const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()
	
		platforms.create(600, 400, GROUND_KEY)
		platforms.create(50, 250, GROUND_KEY)
		platforms.create(750, 220, GROUND_KEY)
        		return platforms

	}
    createStars()
	{
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		})
		
		stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		return stars
	}
    createPlayer()
	{
	const player = this.physics.add.sprite(100, 450, DUDE_KEY)
		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})
        		return player

	}
}