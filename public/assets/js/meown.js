
function changeSymbols(input){
  if ( !input ) return "ERROR";
  if ( input.includes("!i") ){ var url = reSymbol(input,"!i","i!"," ", ""); input = `<img style="width:20%;height:20%;" src=" ${url} ">`}
  if ( input.includes("!v") ){ var url = reSymbol(input,"!v","v!"," ", " "), vid = makeVideo(url); vid.setAttribute("onclick", `loadVideo("${url}")`);input = vid.outerHTML;
                             }
  if ( input.includes("```") ){ input = reSymbol(input,"```","```",`<div class=" simple-container simple-card simple-round simple-margin simple-theme-border">`,`</div>`); }
  if ( input.includes("@") ){ input = mention(input); }
  if ( input.includes("\\n") ){ input = input.replace(/\\n/g,"<br>"); }
  if ( input.includes("\\b") ){ input = input.replace(/\\b/g,"&emsp;"); }
  if (/*hasUrl(input)*/"ee" == "dd"){
    
    var parts = input.split(" "),
        result = "";
    
    parts.forEach((e)=>{
      
      if (e.includes(".mp4")){
        var vid = makeVideo(url); vid.setAttribute("onclick", `loadVideo("${url}")`);
        result += vid.outerHTML;
      }
      else 
      if (e.includes(".mp3")){
        result += `(MP3-Player W.I.P. ${e})`
      }
      else
      if (e.includes(".png") || e.includes(".jpg") || e.includes(".jpeg")){
        result += `<img style="width:20%;height:20%;" src=" ${e} ">`
      }else
      {
        result += e+" "
      }
      
    })
    console.log(result)
    input = result;
  }
  return input
}