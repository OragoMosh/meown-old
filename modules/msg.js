class all_values {
  constructor(type, part, url, query) {
    this.values = {"type":type,"part":part,"url":url,"query":query};
  }

  value() {
    var text;
    var values = this.values;
    values.part = values.part||"ERROR";
    values.query = values.query||"";
    values.url = values.url||"/";
    values.type = values.type||"include"
    values.version = values.version||"redirect";
    
  if (values.type === "custom") text = `${values.part}`;
   else if (values.type === "invalid") text = `Invalid input "${values.part}"`;
   else if (values.type === "missing") text = `Missing input "${values.part}"`;
   else if (values.type === "include") text = `Please make sure to include your ${values.part}`;
   else if (values.type === "noAccount") text = `There is no user with this name.`;
   else if (values.type === "exists") text = `A user with this name already exists!`;
   else if (values.type === "notLogged") text = `You are not logged in!!`;
   else if (values.type === "loggedIn") text = `You are already logged in!`;
   else if (values.type === "logout") text = `You have logged out!`;
   else if (values.type === "postCreated") text = `Your Post has been created!`;
   else if (values.type === "postExists") text = `This post already exists!`;
   else if (values.type === "post_does_not_exist") text = `This post doesn't exist!`;
   else if (values.type === "post_deleted") text = `Your post has been deleted!`;
   else if (values.type === "edited") text = `Your account has been edited!`;
   else if (values.type === "incorrect") text = `Incorrect Password given.`;
   else if (values.type === "followed") text = `Your account has been edited!`;
   else if (values.type === "unfolloed") text = `Incorrect Password given.`;
    
    else text = `Invalid/Empty Input '${values.part}'`;
  //return `Invalid/Empty Input '${part}'<br><button onclick=location.replace('https://'+window.location.hostname+'/${url}')>Back</button>`;

    return `<meta http-equiv="Refresh" content="0; url='${values.url}?popup=${text}${values.query}'"/>`;
  }
  
}


module.exports = all_values;


