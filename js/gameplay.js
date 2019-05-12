//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({width: 640, height: 1138});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.backgroundColor = 0x0096FE;      
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
var scale = scaleToWindow(app.renderer.view);
window.addEventListener("resize", function(event){ 
  scale = scaleToWindow(app.renderer.view);
});  

//Load sprites
loader
  .add("images/atlas.json")
  .load(setup);

function setup() 
{
  let level_1 = [[2,-1,2,2,2,2,2],
                [-1,2,-1,-1,-1,-1,2],
                [2,-1,-1,-1,-1,-1,2],
                [2,-1,-1,-1,-1,-1,2],
                [2,-1,-1,-1,-1,-1,2],
                [2,-1,-1,-1,-1,-1,2],
                [2,2,2,2,2,2,2]];
  let spr_bg = new Sprite(resources["images/atlas.json"].textures["bg.png"]);
  spr_bg.x = 125;
  spr_bg.y = 373;
  //app.stage.addChild(spr_bg);
  let start_x_position = 125;
  let start_y_position = 373;
  for(var x=0;x<7;++x)
  {
    for(var y=0;y<7;++y)
    {
      console.log(level_1[x][y]);
      if (level_1[x][y]==2)
      {
        let white_block = new Sprite(resources["images/atlas.json"].textures["white_block.png"]);
        white_block.x = start_x_position + (x * 56);
        white_block.y = start_y_position + (y * 56);
        app.stage.addChild(white_block);
      }
    }
  }
}

