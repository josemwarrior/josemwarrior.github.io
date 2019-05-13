//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    tween = PIXI.tweenManager,
    Text = PIXI.Text;

const BACKGROUND_COLOR = 0x0096FE;
const TILE_SIZE = 56;
const PLAYER = 1;
const WHITE_BLOCK = 2;
const ORANGE_BLOCK = 0;
const EMPTY_BLOCK = -1;
const WIDTH_STAGE = 640;
const HEIGHT_STAGE = 1138;
const ATLAS_NAME = "images/atlas.json";
const TEXTURE_WHITE_BLOCK = "white_block.png";
const TEXTURE_ORANGE_BLOCK = "orange_block.png";
const TEXTURE_BACKGROUND = "bg.png";
const TEXTURE_PLAYER = "player.png";
const TEXTURE_LABEL = "label_text.png";
const OFFSET_X_LEVEL = 125;
const OFFSET_Y_LEVEL = 373;
const TILES_X = 7;
const TILES_Y = 7;
const TIME_PER_TILE = 20;
const SPR_TEXT_LABEL_X = 198;
const SPR_TEXT_LABEL_Y = 66;
const SPR_TEXT_Y = 72;
const TAG_LEVEL = 'LEVEL ';

//Define any variables that are used in more than one function
let spr_player, current_level, spr_bg, spr_white_block,
    state, player_x_array, player_y_array, number_steps,
    layer_tiles, spr_orange_block, max_levels, spr_label_text,
    level_name;
//Capture the keyboard arrow keys
let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
let can_move = true;
let style = new PIXI.TextStyle(
{
    fontFamily: "Baloo Bhai",
    fontSize: 38,
    fill: "white"
});

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
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
//Load sprites
loader
    .add(ATLAS_NAME)
    .load(start);

function start()
{
    current_level = 1;
    max_levels = levels.length;
    spr_bg = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_BACKGROUND]);
    spr_bg.x = OFFSET_X_LEVEL - TILE_SIZE;
    spr_bg.y = OFFSET_Y_LEVEL - TILE_SIZE;
    app.stage.addChild(spr_bg);
    spr_label_text = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_LABEL]);
    spr_label_text.x = SPR_TEXT_LABEL_X;
    spr_label_text.y = SPR_TEXT_LABEL_Y;
    app.stage.addChild(spr_label_text);
    level_name = new Text(TAG_LEVEL + current_level, style);
    app.stage.addChild(level_name);
    level_name.position.set(WIDTH_STAGE / 2 - level_name.width / 2, SPR_TEXT_Y);

    // Layer color tiles
    layer_tiles = new PIXI.Container();
    app.stage.addChild(layer_tiles);
    print_level();
    //keyboard events
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
    //Set the game state
    state = play;
    //Start the game loop by adding the `gameLoop` function to
    //Pixi's `ticker` and providing it with a `delta` argument.
    app.ticker.add(delta => gameLoop(delta));
}

function print_level()
{
    level_name.text = TAG_LEVEL + current_level;
    level_name.position.set(WIDTH_STAGE / 2 - level_name.width / 2, SPR_TEXT_Y);
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
                layer_tiles.addChild(spr_white_block);
            }
            // Player
            if (levels[current_level][x][y] == PLAYER)
            {
                if (spr_player == undefined)
                {
                    spr_player = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_PLAYER]);
                    app.stage.addChild(spr_player);
                }
                spr_player.x = OFFSET_X_LEVEL + (x * TILE_SIZE);
                spr_player.y = OFFSET_Y_LEVEL + (y * TILE_SIZE);
                player_x_array = x;
                player_y_array = y;
            }
        }
    }

    tint_orange_tile(player_x_array, player_y_array);
}

function tint_orange_tile(x, y)
{
    levels[current_level][x][y] = ORANGE_BLOCK;
    spr_orange_block = new Sprite(resources[ATLAS_NAME].textures[TEXTURE_ORANGE_BLOCK]);
    spr_orange_block.x = OFFSET_X_LEVEL + (x * TILE_SIZE);
    spr_orange_block.y = OFFSET_Y_LEVEL + (y * TILE_SIZE);
    layer_tiles.addChild(spr_orange_block);
}

function gameLoop(delta)
{
    //Move the cat 1 pixel 
    state(delta);
}

function play(delta)
{
    PIXI.tweenManager.update();
    //check_finished_level();
}

function check_finished_level()
{
    var empty_blocks = 0;
    for (var x = 0; x < TILES_X; ++x)
    {
        for (var y = 0; y < TILES_Y; ++y)
        {
            // White block
            if (levels[current_level][x][y] == EMPTY_BLOCK)
            {
                ++empty_blocks;
            }
        }
    }
    if (empty_blocks == 0)
    {
        can_move = false;
        load_next_level();
    }
    else
    {
        return false;
    }
}

function load_next_level()
{
    if (exists_next_level())
    {
        ++current_level;
        can_move = true;
        layer_tiles.children.forEach(function(element)
        {
            element.visible = false;
        });
        print_level();
    }
}

function exists_next_level()
{
    return current_level + 1 < max_levels;
}

function finished_movement()
{
    can_move = true;
    var timer = {
        x: 0
    };
    var tween_check_completed_level = tween.createTween(timer);
    tween_check_completed_level.from(
    {
        x: 0
    }).to(
    {
        x: 100
    });
    tween_check_completed_level.time = 30;
    tween_check_completed_level.on('end', () =>
    {
        check_finished_level();
    });
    tween_check_completed_level.start();
}

function check_move_right()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while (++player_x_array < TILES_X && levels[current_level][player_x_array][player_y_array] != WHITE_BLOCK)
        {
            number_steps++;
            check_tile_colour(current_level, player_x_array, player_y_array, number_steps);
        }
        --player_x_array;
        var x_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from(
        {
            x: spr_player.x
        }).to(
        {
            x: spr_player.x + x_end
        });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () =>
        {
            finished_movement();
        });
        tween_player.start();
        if (number_steps == 0) can_move = true;
    }
}

function check_move_down()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while (++player_y_array < TILES_Y && levels[current_level][player_x_array][player_y_array] != WHITE_BLOCK)
        {
            number_steps++;
            check_tile_colour(current_level, player_x_array, player_y_array, number_steps);
        }
        --player_y_array;
        var y_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from(
        {
            y: spr_player.y
        }).to(
        {
            y: spr_player.y + y_end
        });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () =>
        {
            finished_movement();
        });
        tween_player.start();
        if (number_steps == 0) can_move = true;
    }
}

function check_move_left()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while (--player_x_array >= 0 && levels[current_level][player_x_array][player_y_array] != WHITE_BLOCK)
        {
            number_steps++;
            check_tile_colour(current_level, player_x_array, player_y_array, number_steps);
        }
        ++player_x_array;
        var x_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from(
        {
            x: spr_player.x
        }).to(
        {
            x: spr_player.x - x_end
        });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () =>
        {
            finished_movement();
        });
        tween_player.start();
        if (number_steps == 0) can_move = true;
    }
}

function check_move_up()
{
    if (can_move)
    {
        can_move = false;
        number_steps = 0;
        while (--player_y_array >= 0 && levels[current_level][player_x_array][player_y_array] != WHITE_BLOCK)
        {
            number_steps++;
            check_tile_colour(current_level, player_x_array, player_y_array, number_steps);
        }
        ++player_y_array;
        var y_end = number_steps * TILE_SIZE;
        var tween_player = tween.createTween(spr_player);
        tween_player.from(
        {
            y: spr_player.y
        }).to(
        {
            y: spr_player.y - y_end
        });
        tween_player.time = TIME_PER_TILE * number_steps;
        tween_player.on('end', () =>
        {
            finished_movement();
        });
        tween_player.start();
        if (number_steps == 0) can_move = true;
    }
}

function check_tile_colour(current_level, x, y, steps)
{
    if (levels[current_level][x][y] != ORANGE_BLOCK)
    {
        var timer = {
            x: 0
        };
        var tween_colour = tween.createTween(timer);
        tween_colour.from(
        {
            x: 0
        }).to(
        {
            x: 100
        });
        tween_colour.time = TIME_PER_TILE * steps;
        tween_colour.on('end', () =>
        {
            tint_orange_tile(x, y)
        });
        tween_colour.start();
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
mc.get('pan').set(
{
    direction: Hammer.DIRECTION_ALL
});

// listen to events...
mc.on("panleft panright panup pandown tap press", function(ev)
{
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