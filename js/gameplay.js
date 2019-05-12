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
  let spr_bg = new Sprite(resources["images/atlas.json"].textures["bg.png"]);
  spr_bg.x = 125;
  spr_bg.y = 373;
  app.stage.addChild(spr_bg);
  let white_block = new Sprite(resources["images/atlas.json"].textures["white_block.png"]);
  white_block.x = 125;
  white_block.y = 373;
  app.stage.addChild(white_block);

}

