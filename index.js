const { createInterface } = require("node:readline");
const axios = require("axios");

var username;
var password;
var birthday;

async function start() {
    const interface = createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    interface.question("Handle: ", input =>{
        username = input;
        interface.question("Password: ", input =>{
            password = input;
            interface.question("Birthday (unix timestamp): ",async input =>{
                birthday = input;
                const auth = await axios({
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: 'https://bsky.social/xrpc/com.atproto.server.createSession',
                    data:{
                        identifier: `${username}`,
                        password: `${password}`,
                    }
                });
                if (!auth.data.accessJwt){
                    console.log("Failed to Authenticate: Wrong Handle or Password");
                    return interface.close();
                }
                const oldpref = await axios({
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${auth.data.accessJwt}`,
                        "Content-Type": "application/json"
                    },
                    url: 'https://bsky.social/xrpc/app.bsky.actor.getPreferences',
                });
                if (!oldpref.data.preferences){
                    console.log("Failed to Get Preferences");
                    return interface.close();
                }
                const bbday = new Date(birthday*1000).toISOString();
                oldpref.data.preferences[8].birthDate = bday;
                preferences = oldpref.data.preferences;
                const newpref = await axios({
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${auth.data.accessJwt}`,
                        "Content-Type": "application/json"
                    },
                    url: 'https://bsky.social/xrpc/app.bsky.actor.putPreferences',
                    data: {
                        preferences: preferences
                    }
                });
                if (!newpref.statusCode == 200){
                    console.log("Failed Setting Birthday Try Again");
                    return interface.close();
                }
                console.log("Birthday successfully updated");
                interface.close();
            });
        });
    });
}
start();