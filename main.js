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

client.on("ready", () => {
    console.log("準備ok");
    client.guilds.cache.map(guild => {
        client.guilds.cache.get(guild.id).commands.set([]);
        client.application.commands.set([
            new SlashCommandBuilder()
                .setName("authbtncreate")
                .setDescription("認証ボタンを作成します。")
        ]);
    });
});

client.on("messageCreate", message => {
});

client.on("interactionCreate", interaction => {
    switch (interaction.commandName) {
        case "authbtncreate": {
            const button = new ButtonBuilder()
                .setLabel("認証！")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("authenticatorButton");
            const components = new ActionRowBuilder()
                .addComponents(button);
            const embed = new EmbedBuilder()
                .setTitle("認証をして僕たちとこのサーバーを楽しもう！")
                .setDescription("✅認証は下のボタンを押下する必要があります。")
                .setAuthor(interaction.guild);
            interaction.channel.send({ embeds: [embed], components: [components] })
                .then(message => {
                    console.log(message);
                    console.log(message.id);
                    interaction.reply({ content: "作成が完了しました！", ephemeral: true });
                });
            break;
        }
    }
});
client.login(process.env.token);