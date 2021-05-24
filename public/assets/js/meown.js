function changeSymbols(input){
  if ( input.includes("!i") ){ input = reSymbol(input,"!i","i!",`<img style="width:20%;height:20%;" src="`, `">`); }
  if ( input.includes("!v") ){ var url = reSymbol(input,"!v","v!"," ", " "), vid = makeVideo(url); vid.setAttribute("onclick", `loadVideo("${url}")`);input = vid.outerHTML;
                             }
  if ( input.includes("```") ){ input = reSymbol(input,"```","```",`<div class=" simple-container simple-card simple-round simple-margin simple-theme-border">`,`</div>`); }
  if ( input.includes("@") ){ input = mention(input); }
  if ( input.includes("\\n") ){ input = input.replace(/\\n/g,"<br>"); }
  if ( input.includes("\\b") ){ input = input.replace(/\\b/g,"&emsp;"); }
  return input
}