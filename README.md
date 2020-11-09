# Dinopark ~ Anqi Qu

Dinopark is an interactive and visual tool which can be used to help employees of Dinopark carry out their maintenance jobs around the dinosaur park. The UI shows the park divided into a grid of zones. Zones that need maintenance will show a wrench icon. Zones that are definitely safe to enter will be shaded in green, and zones that are unsafe to enter will be shaded in red. 

## How to run the dev server

Download the code and install packages. Then run `ng serve` in the terminal for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## How I approached the problem 

After reading through the brief, I started thinking about what 

At first I wanted to save the data into an in-memory database, or even make a backend 

I tried to include as many knowledge points as I reasonably could into this project so that I could demonstrate my skill. This includes: components, a custom service, a custom pipe, enums, interfaces, custom theming and a favicon. 

The app is also responsive.

## What I would do differently if I had to do it again

I'd focus much more on the app's performance, as Lighthouse said that it could be improved. I'd also try to make the app a PWA.

## What I learned from this project

My biggest takeaway from this project is probably the timing of async.

## How I think this challenge can be improved 

// Side note: The data returned from the api sometimes doesn't match the docs provided. In the docs, some logs had fields called "id" but those fields were actually returned as "dinosaur_id" from the api. 

### Harder

We can make the app more interactive
- Have a field to change the time and date (like a dateTime picker, so the employees can plan their maintenance) 
- Show where the dinosaurs are on the grid (I know this is already kind of done, since only blocks containing dinosaurs will be shaded, but maybe there could be a dinosaur icon to explicitly show the locations of the dinosaurs or something) 
- Have an input form to add new dinosaurs 
- Click on a dinosaur to remove it or feed it
- Click on a block to maintain the block

### Even Harder
- Dinosaurs can escape.
- A dinosaur will have its speed per hour (in blocks) logged when it is moved to the park.
- When a dinosaur escapes, the program can calculate and show the possible blocks where the dinosaur might be at the time of viewing (and shade the blocks in yellow or something) 