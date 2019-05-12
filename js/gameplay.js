//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application(
{
    width: 640,
    height: 1138
});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.backgroundColor = 0x0096FE;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
var scale = scaleToWindow(app.renderer.view);
window.addEventListener("resize", function(event)
{
    scale = scaleToWindow(app.renderer.view);
});
//Define any variables that are used in more than one function
let levels, player, current_level, spr_bg, white_block, start_x_position, start_y_position, state;
//Capture the keyboard arrow keys
let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
let tile_size = 56;
let can_move = true;
//Load sprites
loader
    .add("images/atlas.json")
    .load(setup);

function setup()
{
    levels = [
        [
            [2, 2, 2, 2, 2, 2, 2],
            [2, 1, -1, -1, -1, -1, 2],
            [2, -1, -1, -1, -1, -1, 2],
            [2, -1, -1, -1, -1, -1, 2],
            [2, -1, -1, -1, -1, -1, 2],
            [2, -1, -1, -1, -1, -1, 2],
            [2, 2, 2, 2, 2, 2, 2]
        ]
    ];
    current_level = 0;
    spr_bg = new Sprite(resources["images/atlas.json"].textures["bg.png"]);
    spr_bg.x = 125;
    spr_bg.y = 373;
    app.stage.addChild(spr_bg);
    // Paint level
    start_x_position = 125;
    start_y_position = 373;
    for (var x = 0; x < 7; ++x)
    {
        for (var y = 0; y < 7; ++y)
        {
            // White block
            if (levels[current_level][x][y] == 2)
            {
                white_block = new Sprite(resources["images/atlas.json"].textures["white_block.png"]);
                white_block.x = start_x_position + (x * tile_size);
                white_block.y = start_y_position + (y * tile_size);
                app.stage.addChild(white_block);
            }
            // Player
            if (levels[current_level][x][y] == 1)
            {
                player = new Sprite(resources["images/atlas.json"].textures["player.png"]);
                player.x = start_x_position + (x * tile_size);
                player.y = start_y_position + (y * tile_size);
                app.stage.addChild(player);
            }
        }
    }
    //Set the game state
    state = play;

    //Right arrow key `press` method
    right.press = () =>
    {
        check_move_right();
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
    //player.x += 1;
}

function check_move_right()
{
    if (can_move)
    {
        //player.x = player.x + tile_size;
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