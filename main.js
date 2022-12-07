require('dotenv').config();
const { Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    BaseChannel,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder,
    PresenceUpdateStatus,
    DMChannel
} = require("discord.js"),
    client = new Client({
        partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
        intents: [GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
    });
client.on("messageCreate", message => {
});

client.on("interactionCreate", interaction => {
    switch (interaction.commandName) {
        case "facterButtonCreate": {
                const button = new ButtonBuilder()
                    .setLabel("認証！")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("facterButton");
                const embed = new EmbedBuilder()
                    .setTitle("認証をして僕たちとこのサーバーを楽しもう！")
                    .setDescription("✅認証は下のボタンを押下する必要があります。")
                    .setAuthor(interaction.guild);
                interaction.channel.send({ embeds: [embed], components: [button] })
                    .then(message => {
                        console.log(message);
                        console.log(message.id);
                    });
                break;
            }
    }
});
client.login(process.env.token);