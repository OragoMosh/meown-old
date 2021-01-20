function new_el(values){
if (!values){
values = {element:"a",type:"double",value:undefined,class:undefined,style:undefined,id:undefined,tags:undefined}
}

var result,beginning,middle,end;

beginning=`<${values.element} `;

if(!values.element){values.element=`a`}

if(values.class){beginning+=`class="${values.class}"`}

if(values.style){beginning+=`class="${values.style}"`}

if(values.id){beginning+=`class="${values.id}"`}

beginning+=`>`

if (values.value){middle=values.value;}

result = beginning;

if (middle){result+=middle;}
if (values.type === "double"){
end = `</${values.element}>`
result+=end;
}
return result;
}