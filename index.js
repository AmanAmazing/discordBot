// Initialize dotenv
require('dotenv').config();

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// for encouragement 
const sadWords = ["sad", "depressed", "unhappy" ,  "angry"]
const encouragements = [
    "Cheer up",
    "Hang in there.",
    "You are a great person / bot!"
]

// for inspirational quotes
const fetch = require("node-fetch")

function getQuote(){
    return fetch("https://zenquotes.io/api/random")
        .then(res => {
            return res.json()
        })
        .then(data => {
            return data[0]["q"] + " -" + data[0]["a"]
        })
}

// to get movie details 
function getMovie(movieName){
    const template_string = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${movieName}&plot=full`
    return fetch(template_string)
        .then(res => {
            return res.json()
        })
        .then(data => {
            return data 
        })
        .catch(error => {
            console.error("something went wrong fetching movie") 
        })
}





client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    // You can view the msg object here with console.log(msg)
    if (msg.author.bot) return // stops the bot from responding to his own messages 
    
    if (msg.content === "$inspire"){
        getQuote().then(quote => msg.channel.send(quote))
    }

    if (msg.content.startsWith("$movie")){
        movie_name = msg.content.split(" ").slice(1).join('+')
        
        getMovie(movie_name).then(movie => {
            const {Title, Plot,Year, Actors,imdbRating, Metascore} = movie 
            const output_msg = 
            `The movie: ${Title} 
            was released in the year: ${Year}
            with an imdb rating of: ${imdbRating} 
            and a Metascore of: ${Metascore} 
            The plot: ${Plot} 
            It features actors: ${Actors}`
            msg.channel.send(output_msg)
        })
    }


    if (sadWords.some(word => msg.content.includes(word))){
        const encouragement = encouragements[Math.floor(Math.random()* encouragements.length)]
        msg.reply(encouragement)
    } 

});
// Log In our bot
client.login(process.env.CLIENT_TOKEN);

