
<p align="center">
  <img src="./src/assets/stellar_world.png"/>
</p>
Stellar World
---
Live Globe Visualization of Stellar Quorum sets.

Built as an extension and based on the data provided by <a href="stellarbeat.io">stellarbeat.io</a> - could possibly address  the Stellar Build Challenge (SBC) Task 1: Extending and Improving visualizations around qsets on the Stellar network.

## How to use

This project contains both a client and server side component. You will need to be running both in order to successfully use this app.

### Server Side:
Run the following from the `/server` directory

<pre>
  yarn && yarn start
</pre>

The Stellar World server should not be running on app 3001. 

### Client Side:

Install dependencies for the client app.
<pre>
    yarn
</pre>

Build the project and start the server
<pre>
    yarn build && yarn start
</pre>

The app should now be running on port 3000. <br/>

Open `localhost:3000` from your favorite web browser with the server running to use.

### Other Links
* https://www.stellarbeat.io/%  