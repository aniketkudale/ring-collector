let game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	//Loading assets such as background image, object image, game sprites.
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('ring', 'assets/ring.png');
	game.load.image('player', 'assets/player.png');
}

// Variables

let player;
let platforms;
let cursors;

let rings;
let points = 0;
let pointsText;

function create() {
	// Since we are build an arcade style game, we enable arcade physics system using following function
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // This function will add 'sky' asset as background to our canvas.  
    game.add.sprite(0, 0, 'sky');

    // The platforms group contains the ground and the 3 ledges we can jump on
    platforms = game.add.group();

    // Enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    let ground = platforms.create(0, game.world.height - 64, 'ground');

    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    // This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // Now let's create three ledges, at 3 different location
    let ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
	
	    ledge = platforms.create(400, 150, 'ground');
    ledge.body.immovable = true;

    // The player and its settings, such as height and width
    player = game.add.sprite(32, game.world.height - 150, 'player');

    // Enable physics on the player
    game.physics.arcade.enable(player);

    // Player physics properties, such as bounce and bounding it to canvas only so it does not go off screen
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    // Adding some rings to collect
    rings = game.add.group();

    // We will also enable physics for any ring that is created in this group
    rings.enableBody = true;

    // Here we'll create 10 of them evenly spaced apart
    for (let i = 0; i < 10; i++)
    {
        // Create a ring inside of the 'rings' group
        let ring = rings.create(i * 70, 0, 'ring');

        // Add some gravity
        ring.body.gravity.y = 300;

	}

    // The pointsText displays current score in top right corner of canvas
    pointsText = game.add.text(624, 16, 'points: 0', { fontSize: '32px', fill: '#000' });

    // Using keyboard controls
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {

    // Collide the player and the rings with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(rings, platforms);

    // Checks if the player overlaps with any of the rings, if he does call the collectRing function
    game.physics.arcade.overlap(player, rings, collectRing, null, this);

    // Reset the players velocity (movement), if no key is pressed
    player.body.velocity.x = 0;
	
	// If left or right key is pressed
    if (cursors.left.isDown) 
    {
        // Move left
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) 
    {
        // Move right
        player.body.velocity.x = 150;
    }
    else
    {
        // Dont move
        player.animations.stop();
        player.frame = 4;
    }
    
    //  Allows the player to jump only if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}

function collectRing (player, ring) {
    
    // Removes the ring from the screen, when player touches the ring
    ring.kill();

    //  Add and update the score points
    points = points + 10;
    pointsText.text = 'Points: ' + points;

}