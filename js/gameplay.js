//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    tween = PIXI.tweenManager;

//Define any variables that are used in more than one function
let spr_player, current_level, spr_bg, spr_white_block, 
state, player_x_array, player_y_array, number_steps;
//Capture the keyboard arrow keys
let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
let can_move = true;



const BACKGROUND_COLOR = 0x0096FE;
const TILE_SIZE = 56;
const PLAYER = 1;
const WHITE_BLOCK = 2;
const WIDTH_STAGE = 640;
const HEIGHT_STAGE = 1138;
const ATLAS_NAME = "images/atlas.json";
const TEXTURE_WHITE_BLOCK = "white_block.png";
const TEXTURE_BACKGROUND = "bg.png";
const TEXTURE_PLAYER = "player.png";
const OFFSET_X_LEVEL = 125;
const OFFSET_Y_LEVEL = 373;
const TILES_X = 7;
const TILES_Y = 7;
const TIME_PER_TILE = 20;


//Create a Pixi Application
let app = new Application(
{
    width: WIDTH_STAGE,
    height: HEIGHT_STAGE
});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.backgroundColor = BACKGROUND_COLOR;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
var scale = scaleToWindow(app.renderer.view);
window.addEventListener("resize", function(event)
{
    scale = scaleToWindow(app.renderer.view);
});

//Load sprites
loader
    .add(ATLAS_NAME)
    .load(setup);

function setup()
{
    current_level = 0;
    spr_bg = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_BACKGROUND]);
    spr_bg.x = OFFSET_X_LEVEL;
    spr_bg.y = OFFSET_Y_LEVEL;
    app.stage.addChild(spr_bg);
    for (var x = 0; x < TILES_X; ++x)
    {
        for (var y = 0; y < TILES_Y; ++y)
        {
            // White block
            if (levels[current_level][x][y] == WHITE_BLOCK)
            {
                spr_white_block = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_WHITE_BLOCK]);
                spr_white_block.x = OFFSET_X_LEVEL + (x * TILE_SIZE);
                spr_white_block.y = OFFSET_Y_LEVEL + (y * TILE_SIZE);
                app.stage.addChild(spr_white_block);
            }
            // Player
            if (levels[current_level][x][y] == PLAYER)
            {
                spr_player = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_PLAYER]);
                spr_player.x = OFFSET_X_LEVEL + (x * TILE_SIZE);
                spr_player.y = OFFSET_Y_LEVEL + (y * TILE_SIZE);
                app.stage.addChild(spr_player);
                player_x_array = x;
                player_y_array = y;
            }
        }
    }
    //Set the game state
    state = play;

    //arrow key `press` method
    right.press = () =>
    {
        check_move_right();
    };
    left.press = () =>
    {
        check_move_left();
    };
    up.press = () =>
    {
        check_move_up();
    };
    down.press = () =>
    {
        check_move_down();
    };
    //Start the game loop by adding the `gameLoop` function to
    //Pixi's `ticker` and providing it with a `delta` argument.
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta)
{

    //Move the cat 1 pixel 
    state(delta);

}

function play(delta)
{
    PIXI.tweenManager.update();
}

function check_move_right()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while(++player_x_array<TILES_X && levels[current_level][player_x_array][player_y_array]!=WHITE_BLOCK)
        {
            number_steps++;
        }
        --player_x_array;
        var x_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from({ x: spr_player.x }).to({ x: spr_player.x + x_end });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () => { can_move = true; });
        tween_player.start();
        if (number_steps==0) can_move = true;
    }
}

function check_move_down()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while(++player_y_array<TILES_Y && levels[current_level][player_x_array][player_y_array]!=WHITE_BLOCK)
        {
            number_steps++;
        }
        --player_y_array;
        var y_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from({ y: spr_player.y }).to({ y: spr_player.y + y_end });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () => { can_move = true; });
        tween_player.start();
        if (number_steps==0) can_move = true;
    }
}

function check_move_left()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while(--player_x_array>=0&&levels[current_level][player_x_array][player_y_array]!=WHITE_BLOCK)
        {
            number_steps++;
        }
        ++player_x_array;
        var x_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from({ x: spr_player.x }).to({ x: spr_player.x - x_end });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () => { can_move = true; });
        tween_player.start();
        if (number_steps==0) can_move = true;
    }
}

function check_move_up()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while(--player_y_array<TILES_Y && levels[current_level][player_x_array][player_y_array]!=WHITE_BLOCK)
        {
            number_steps++;
        }
        ++player_y_array;
        var y_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from({ y: spr_player.y }).to({ y: spr_player.y - y_end });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () => { can_move = true; });
        tween_player.start();
        if (number_steps==0) can_move = true;
    }
}

//The `keyboard` helper function
function keyboard(keyCode)
{
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event =>
    {
        if (event.keyCode === key.code)
        {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = event =>
    {
        if (event.keyCode === key.code)
        {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

// Touch gestures
let mc = new Hammer(app.view);
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

// listen to events...
mc.on("panleft panright panup pandown tap press", function(ev) {
    //console.log(ev.type +" gesture detected.");
    if (ev.type == "panright")
    {
        check_move_right();
    }
    if (ev.type == "panleft")
    {
        check_move_left();
    }
    if (ev.type == "panup")
    {
        check_move_up();
    }
    if (ev.type == "pandown")
    {
        check_move_down();
    }
});


