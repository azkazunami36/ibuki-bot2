require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder
} = require("discord.js"),
    client = new Client({
        partials: [
            Partials.GuildMember,
            Partials.Message,
            Partials.User
        ],
        intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    }),
    json = {};
client.on(Events.ClientReady, () => {
    console.info(
        "準備完了！\n" +
        "エラーが発生した際には、エラー文をDiscordにて「あんこかずなみ36#5008」にお送りください！\n" +
        "もちろん、リポジトリ名もお忘れずに。"
    );
    client.guilds.cache.map(guild => {
        client.guilds.cache.get(guild.id).commands.set([]);
        client.application.commands.set([
            new SlashCommandBuilder()
                .setName("authbtncreate")
                .setDescription("認証ボタンを作成します。")
                .addRoleOption(option => option
                    .setName("roles")
                    .setDescription("付与する際に使用するロールを選択します。")
                    .setRequired(true)
                )
        ]);
    });
});
client.on(Events.InteractionCreate, interaction => {
    console.log("インタラクション受信");
    switch (interaction.commandName) {
        case "authbtncreate": {
            const roleID = interaction.options.getRole("roles").id;
            const button = new ButtonBuilder()
                .setLabel("認証！")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("authenticatorbutton" + roleID);
            const components = new ActionRowBuilder()
                .addComponents(button);
            const embed = new EmbedBuilder()
                .setTitle("認証をして僕たちとこのサーバーを楽しもう！")
                .setDescription("✅認証は下のボタンを押下する必要があります。")
                .setAuthor(interaction.guild);
            interaction.channel.send({ embeds: [embed], components: [components] })
                .then(() => { interaction.reply({ content: "作成が完了しました！", ephemeral: true }); });
            console.log("認証ボタン作成");
            break;
        }
    };
    if (interaction.isButton()) {
        if (interaction.customId.match(/authenticatorbutton[0-9]/)) {
            const roleID = interaction.customId.split("authenticatorbutton")[1];
            const embed = new EmbedBuilder();
            json[interaction.user.id] = {
                calc_type: 0,
                one: 0,
                two: 0,
                ord: []
            };
            let data = json[interaction.user.id];
            data.one = Math.floor(Math.random() * 9);
            data.two = Math.floor(Math.random() * 9);
            data.ord.push({ type: "+", Num: data.one + data.two });
            data.ord.push({ type: "-", Num: data.one - data.two });
            data.ord.push({ type: "*", Num: data.one * data.two });
            data.calc_type = Math.floor(Math.random() * (data.ord.length - 1));
            for (let i = (data.ord.length - 1); i != 0; i--) {
                const random = Math.floor(Math.random() * i);
                let tmp = data.ord[i];
                data.ord[i] = data.ord[random];
                data.ord[random] = tmp;
            };
            embed.setTitle("問題！");
            embed.setDescription("下の計算を解くだけで認証が出来ます！");
            embed.addFields({
                name: data.one + data.ord[data.calc_type].type + data.two + "=",
                value: "の答えを下から選びましょう。"
            });
            const components = new ActionRowBuilder();
            for (let i = 0; data.ord.length != i; i++) {
                components.addComponents(
                    new ButtonBuilder()
                        .setLabel(String(data.ord[i].Num))
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(roleID + "calc" + i)
                );
            };
            interaction.reply({
                embeds: [embed],
                components: [components],
                ephemeral: true
            });
        } else if (interaction.customId.match(/[0-9]calc[0-9]/)) {
            const roleID = interaction.customId.split("calc")[0];
            const request = Number(interaction.customId.split("calc")[1]);
            if (interaction.customId.match()) {
                const awnser = json[interaction.user.id].calc_type;
                if (request == awnser) {
                    const role = interaction.guild.roles.cache.get(roleID);
                    interaction.guild.members.cache.get(interaction.user.id).roles.add(role)
                        .then(member => {
                            interaction.reply({
                                content: "認証に成功しました！",
                                ephemeral: true
                            });
                        }).catch(e => {
                            if (e.code) {
                                let error = "";
                                switch (e.code) {
                                    case 50013: error = "権限が不足しています。"; break;
                                    default: console.log(e); break;
                                };
                                if (e.message) error += "/" + e.message;
                                interaction.reply({
                                    content: e.code + ": " + error + "\nこのエラーを管理人に報告してくれると、一時的に対処が行われます。",
                                    ephemeral: true
                                });
                                console.log("エラー確認: " + error + "\nこのエラーはかずなみに送る必要性はなさそうです。");
                            } else {
                                console.log(e);
                                interaction.reply({
                                    content: "認証でエラーが発生してしまいました...\nエラーは管理者が確認し修正します。",
                                    ephemeral: true
                                });
                            };
                        });
                } else {
                    interaction.reply({
                        content: "あぁ...答えが違いますよ...\nもっかいクリックしてやりなおしましょ！",
                        ephemeral: true
                    });
                };
            };
        };
    };
});
client.login(process.env.token);