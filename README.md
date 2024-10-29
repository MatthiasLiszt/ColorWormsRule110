# Getting Started 

Clone or download repo and just load Colorworms.html into your browser. Javascript needs to be enabled.
The speed is set to zero by default so in case you want to see the ether moving you gotta click on speed
and set it to a value greater than zero. By clicking on the grid you can make a cell alive or dead. 
The color will changer either from white to red or grey to white. 

# Rule 110 

[Rule 110](https://en.wikipedia.org/wiki/Rule_110) is a one dimensional cellular automata which when filled
with infinitly with a 14 bit repeating background pattern (1111100 0100110) called ether allows oscillators,
gliders and even glider guns to be observed.

Rule 110 was studied and researched by Matthew Cook, Genaro Martínez among others. 

# Ether

The ether is a repeating background pattern which allows gliders, oscillators etc. to form and to be observed.
Replacing the usual 14 bit ether pattern with something else seems to be logical. However cutting an infinite string
of Ether patterns and then inserting a smaller pattern between to ether patterns allows new oscillators and gliders
to be found quicker. The downside is that it is less intuitive to people who are just familiar with Game Of Life. 

The ether or background pattern is moving with a periode of 8. For that I implemented a so called block correction
which makes you feel as if the ether is not moving.  

# About This Approach

The intention was to make Rule 110 feel like Game Of Life as much as possible. So the background pattern or ether
can be automatically corrected so that it seems as if it does not move. In the basic mode I decided to keep the 
ether grey and living cells being not part of the ether to be black.

# Alternative Namings

I decided to call ether air, gliders worms and oscillators plants. I even thought of calling still lifes rocks
but I have not found any still lifes in Rule 110 yet. 

