//Create a Pixi Application
let app = new PIXI.Application({width: 640, height: 1138});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.backgroundColor = 0x63E8EE;      
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
var scale = scaleToWindow(app.renderer.view);
window.addEventListener("resize", function(event){ 
  scale = scaleToWindow(app.renderer.view);
});  

//Load sprites
PIXI.loader.add("images/bg.png", {crossOrigin: true}).load(setup);

function setup() 
{
  let spr_bg = new PIXI.Sprite
  (
    PIXI.loader.resources["images/bg.png"].texture
  );
  app.stage.addChild(spr_bg);
}

