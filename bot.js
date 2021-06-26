const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "!";
const axios = require("axios");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
  if (
    msg.content.startsWith(`${prefix}Pokemon`) ||
    msg.content.startsWith(`${prefix}pokemon`)
  ) {
    const number = msg.content.split(" ")[1];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${number}`)
      .then((response) => {
        const data = response.data;
        const types = data.types.map((type, i) => {
          if (i === 0) {
            return {
              name: "Type: ",
              value: type.type.name,
            };
          } else {
            return {
              name: "Type 2: ",
              value: type.type.name,
              inline: true,
            };
          }
        });
        const stats = data.stats.map((stat) => {
          return {
            name: stat.stat.name,
            value: stat.base_stat,
            inline: true,
          };
        });
        const title = "Name: " + data.name;
        const frontImage = data.sprites.front_default;

        const embed = new Discord.MessageEmbed()
          .setAuthor("PokeBot")
          .setTitle(title)
          .setThumbnail(frontImage)
          .addFields(
            { name: "Height:", value: data.height, inline: true },
            { name: "Weight:", value: data.weight, inline: true },
            types,
            { name: "Pokemon Stats", value: "Stats" },
            stats
          );

        msg.channel.send(embed);
      })
      .catch((error) => {
        msg.channel.send("That's pokemon doesn't exist");
        console.log(error);
      });
  }
});

client.login(process.env.BOT_TOKEN);
