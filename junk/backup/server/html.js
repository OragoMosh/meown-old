class User {
  constructor(username, age, email) {
    this.username = username;
    this.age = age;
    this.email = email;
  }

  getUserStats() {
    return `
<!DOCTYPE html>
<html>
<a>Name [${this.username}]</a><br>
<a>Age [${this.age}]</a><br>
<a>Email [${this.email}]</a><br>
</html>
      
    `;
  }
}

module.exports = User;