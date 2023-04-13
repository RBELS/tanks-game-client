# Tanks Game
****

This is a client side part of the application.

[Server Side](https://github.com/RBELS/tanks-game-server)

To run the app you need to specify machine ip address in ***config.ts*** file

## The client side uses:
- Typescript for types support
- Scss for better stylesheets
- webpack to bundle the app
- WebGL API to draw the game
- React to draw home screen UI
- WebSockets to interact with the webserver

## About the game

Tanks Game is an IO-like multiplayer browser game.

In this game you control a tank.

Current version does not allow you to win. But you can still compete with other players by getting more points.

### Players earn points for:

- Destroying other players

### Players loose points for:

- Being destroyed in the ***"Dead Zone"***

*"Dead Zone" is a zone behind the game map borders.*

### To destroy an enemy tank you need:

- To hurt him till his HP equals 0
- Every player has 100 hp on spawn
- Player shot hurts 10 hp, then you need 10 shoots to destroy and enemy tank
- Make him leave the map and die (You don't yearn points, but you enemy looses them :D)

### Controls

- 'A' and 'D' to rotate the tank
- 'W' and 'S' to move the tank
- Move the cursor to aim
- Left mouse button to shoot. You can hold it to shoot on reloading.
- Reloading time is 1 sec.
- To leave the game simply close the browser window!

### How to start playing

- Enter the resource
- Check if there are any lobbies to join
- Enter a nickname
- If there are click on the chosen lobby
- If there are not or you want to create a new one, click the "Create lobby" button

### Home screen form

![Form image](https://github.com/RBELS/tanks-game-client/blob/master/display-images/form.jpg)

### Online lobbies

![Lobbies image](https://github.com/RBELS/tanks-game-client/blob/master/display-images/lobbies.jpg)

### Game screen

![Game image](https://github.com/RBELS/tanks-game-client/blob/master/display-images/game.jpg)

### Shooting

![Shooting image](https://github.com/RBELS/tanks-game-client/blob/master/display-images/shooting.jpg)

### Dead zone

![Dead zone image](https://github.com/RBELS/tanks-game-client/blob/master/display-images/dead-zone.jpg)
