require('dotenv').config();
const { Client,
    GatewayIntentBits,
    Partials,
    Events,
    EmbedBuilder,
    BaseChannel,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    PresenceUpdateStatus,
    DMChannel
} = require("discord.js"),
    client = new Client({
        partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
        intents: [GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
    });

client.on(Events.ClientReady, () => {
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

client.on(Events.MessageCreate, message => {
});

client.on(Events.InteractionCreate, interaction => {
    switch (interaction.commandName) {
        case "authbtncreate": {
            const button = new ButtonBuilder()
                .setLabel("認証！")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("authenticatorbutton");
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
    };
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case "authenticatorbutton": {
                console.log("ok");
                const embed = new EmbedBuilder();
                const data = {
                    calc_type: 0,
                    one: 0,
                    two: 0,
                    ord: []
                };
                data.calc_type = Math.floor(Math.random() * 2);
                data.one = Math.floor(Math.random() * 9);
                data.two = Math.floor(Math.random() * 9);
                data.ord.push({ type: "+", Num: data.one + data.two });
                data.ord.push({ type: "-", Num: data.one - data.two });
                data.ord.push({ type: "*", Num: data.one * data.two });
                embed.setTitle("問題！");
                embed.setDescription("下の計算を解くだけで認証が出来ます！");
                embed.addFields({
                    name: data.one + data.ord[data.calc_type].type + data.two + "=",
                    value: "の答えをしたから選びましょう。"
                });
                for (let i = (data.ord.length - 1); i != 0; i--) {
                    const random = Math.floor(Math.random() * i);
                    var tmp = data.ord[i];
                    data.ord[i] = data.ord[random];
                    data.ord[random] = tmp;
                };
                const components = new ActionRowBuilder();
                for (let i = 0; data.ord.length != i; i++) {
                    components.addComponents(
                        new ButtonBuilder()
                            .setLabel(String(data.ord[i].Num))
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("is" + data.ord[i].Num)
                    );
                }
                interaction.reply({ embeds: [embed], components: [components] });
                return;
                const role = interaction.guild.roles.cache.get("1035908195186638909");
                if (member.roles.cache.has("1035908195186638909")) {
                    try {
                        member.roles.add(role);
                        interaction.reply({
                            content: "認証に成功しました！",
                            ephemeral: true
                        })
                    } catch (error) {
                        interaction.reply({
                            content: "認証でエラーが発生してしまいました...\nエラーは管理者が確認し修正します。",
                            ephemeral: true
                        });
                    }
                }
            }
        }
    }
});
client.login(process.env.token);