# Mittz Chat (chat lab)
Dynamic instant multi-person chat room (can be built / joined to the room), based on node.js + Socket.io + Express. <br>

![version](https://img.shields.io/badge/version-1.04-green.svg)

![join-and-chat](https://cloud.githubusercontent.com/assets/24193072/26714744/837dccfc-47a5-11e7-86e0-953f63dd9c77.png)<br><br>

## Introduction
In <strong>Chat Lab</strong>, users will be added to the "Lobby" by logging in and entering a nickname, and will be able to talk to other users in the same room. This app has the following characteristics:<br>

<ol>

<li>Users can enter the system command: <b>/join [room name]</b> to create a room, and if the room already exists, join it. </li>

<li>In addition to the /join command, clicking on the room block in the right room list can also be added directly. The room with the red background is the room you are currently in, with the number of people in the room in brackets. </li>

<li>Enter the command <b>/ls</b> to refresh the list of rooms. The system refreshes every 30 seconds. If the user joins, leaves the chat lab or creates a room to join, everyone will automatically refresh the list. </li>

</ol>
<br>

## Demo
## How to use the code
 You must first install node.js<br>
 After the command prompt character enters the path of the project, enter:<br><br>
```npm install --save```<br><br>
It will install the dependent modules defined in package.json for you, and enter them when you finish:<br><br>
```node server/server.js```<br><br>
This will start the local server, open the browser and type <b>localhost:3232</b> at the URL (port can change it in the code) and that's it!<br><br>

## License
MIT license.<br><br>

## Information
Author: &nbsp;GW19 &nbsp;\<imgw19@gmail.com\><br>
If you think there is any need for improvement in the code, please let me know, I will thank you very much! <br><br>