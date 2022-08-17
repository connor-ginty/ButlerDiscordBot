
//Your personal butler bot
//Build-a-butler, if you will.

const Discord = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv').config();

//environment variables
const token = process.env.TOKEN;
const cocktailUrl = process.env.COCKTAIL_URL;
const activityUrl = process.env.ACTIVITY_URL;
const dogPicUrl = process.env.DOG_PIC_URL;

const prefix = '!';

const client = new Discord.Client({
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true,

    },
    intents: [ //guilds = Discord servers
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_PRESENCES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGE_REACTIONS",
    ],
});

//Getting the bot up and running
client.on("ready", () => {
    console.log("Your personal butler is at your service!")

})

//Command handling

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);
    const command = args.shift().toLowerCase();

    //Write new commands here >>>>>

    //test command
    if (command === 'test') {
        message.channel.send('Excellent job running the test, ' +
            message.author.username +
            '. Let me know if I can be of service.')
    }

    //greeting command
    if (command === 'hello' || command === 'greeting' || command === 'hi') {
        message.channel.send('Warmest greetings, ' +
            message.author.username +
            '. I hope you are having a wonderful day!')
    }
    //summon command
    if (command === 'bell' || command === 'summon' || command === 'ring') {
        message.channel.send('Coming, ' + message.author.username + '.')
    }

    //cocktail command
    if (command === 'cocktail' || command === 'drink') {
        let getCocktail = async () => {
            let response = await axios.get(cocktailUrl);
            let cocktail = response.data;
            return cocktail;
        };
        let cocktailValue = await getCocktail();
        console.log(cocktailValue);
        let cocktailMessage = cocktailValue.drinks[0]["strDrinkThumb"] + "\n";
        cocktailMessage += "\n" + cocktailValue.drinks[0]["strDrink"] + "\n\nIngredients: \n";
        for (var i = 1; i < 15; i++) {
            let thisIngredient = cocktailValue.drinks[0]["strIngredient" + i.toString()]
            let thisMeasurement = cocktailValue.drinks[0]["strMeasure" + i.toString()]
            if (thisIngredient !== null) {
                if (thisMeasurement !== null) {
                    cocktailMessage += thisMeasurement + " ";
                }
                cocktailMessage += thisIngredient + "\n"
            }
            else {
                break;
            }
        }
        cocktailMessage += "\n" + cocktailValue.drinks[0]["strInstructions"];
        message.reply(`I do hope you enjoy this drink I made for you, ` + message.author.username + `. \n\n` + cocktailMessage);
    }

    //random activity
    if (command === 'activity' || command === 'bored') {
        let getActivity = async () => {
            let response = await axios.get(activityUrl);
            let activity = response.data;
            return activity;
        }
        let activityValue = await getActivity();
        console.log(activityValue);
        message.reply(`Here is a suggestion for an activity to keep your mind occupied: _**${activityValue.activity}.**_ ` + 'I hope this was helpful, ' + message.author.username + '.');
    }

    //random doggo picture
    if (command === 'dog' || command === 'doggo' || command === 'pupper' || command === 'puppy') {
        let getDogPic = async () => {
            let response = await axios.get(dogPicUrl);
            let dogPic = response.data;
            return dogPic;
        }
        let dogPicLink = await getDogPic();
        console.log(dogPicLink);
        message.reply(`I found this picture within the finest collection of the goodest boys and girls for your viewing pleasure. ${dogPicLink.message}`);
    }
});
//No commands past this point

//Keep it secret. Keep it safe.
client.login(token);

