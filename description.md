# Project Title: MaxwellDemon

# Descritpion
Game developed for the mcgill physics hackthon on the topic of entropy. The game introduces the player to maxwell's demon paradox. 

# Gameplay
The player sees a box split into 2 equal size by a central wall. Particles represented as balls, are moving around and elastically collide with eachother and the walls. Some particles are faster than others and thus have more energy. The player controls a small door in the wall that can be opened or closed. The goal is to separate the 2 types of balls as to reduce the entropy of the system.

# Tech Stack
## Front end: website 
## Back end: Java

# Packages:


# Tasks
## Phase 1 : Getting started
- [ ]  Figure out the packages needed for the project
- [ ] Coordinate System: Define the "World To Pixel" ratio so your $k_B$ values make sense.
- [ ] The "Hello World": Render a single ball bouncing elastically off four walls.

## Phase 2 : Implementation
- [ ] Tile Class (priority: 1)
This represents the positions that the balls can occupy.
Fields:

- [ ] Big Box Class (priority: 2)
This represents the whole (undivided) background grid
Fields:

- [ ] Box Class (priority: 3)
Represents the sub box either on the left or right of the wall
Fields:

- [ ] Demon class (priority: Low)
Represents the demon and should have some entropy field