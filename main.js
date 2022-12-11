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
    SlashCommandBuilder,
    PermissionsBitField,
    Interaction
} = require("discord.js"),
    client = new Client({
        partials: [],
        intents: [GatewayIntentBits.Guilds]
    });
client.on(Events.ClientReady, () => {
    console.info(
        "準備完了！\n" +
        "エラーが発生した際には、エラー文をDiscordにて「あんこかずなみ36#5008」にお送りください！\n" +
        "もちろん、リポジトリ名もお忘れずに。"
    );
    client.guilds.cache.map(guild => {
        client.guilds.cache.get(guild.id).commands.set([
            new SlashCommandBuilder()
                .setName("authbtncreate")
                .setDescription("認証ボタンを作成します。")
                .addRoleOption(option => option
                    .setName("roles")
                    .setDescription("付与する際に使用するロールを選択します。")
                    .setRequired(true)
                )
                .addBooleanOption(option => option
                    .setName("question")
                    .setDescription("認証をクリックした際に、計算問題を出すかどうかを決めます(通常は有効)")
                )
                .addStringOption(option => option
                    .setName("title")
                    .setDescription("埋め込みのタイトルを決めます。")
                )
                .addStringOption(option => option
                    .setName("description")
                    .setDescription("埋め込みの説明を決めます。")
                )
        ]);
    });
});
client.on(Events.InteractionCreate, interaction => {
    console.log("インタラクション受信: " + interaction.user.username + "さん");
    switch (interaction.commandName) {
        case "authbtncreate": {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const roleID = interaction.options.getRole("roles").id;
                const question = interaction.options.getBoolean("question");
                const title = interaction.options.getString("title");
                const description = interaction.options.getString("description");
                const point = "authenticatorbutton";
                const customId = point + roleID + point + String(question);
                console.log("ボタンに埋め込まれたデータ: " + customId);
                const components = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("認証！")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(customId)
                    );
                const embed = new EmbedBuilder()
                    .setTitle(title || "認証をして僕たちとこのサーバーを楽しもう！")
                    .setDescription(description || "✅認証は下のボタンを押下する必要があります。")
                    .setAuthor(interaction.guild);
                interaction.channel.send({ embeds: [embed], components: [components] })
                    .then(() => { interaction.reply({ content: "作成が完了しました！", ephemeral: true }); });
                console.log("認証ボタン作成");
            } else interaction.reply({ content: "コマンド発行者自身に管理者権限がないため、実行することが出来ません..." });
            break;
        }
    };
    if (interaction.isButton()) {
        if (interaction.customId.match(/authenticatorbutton[0-9]/)) {
            const customIdSplit = interaction.customId.split("authenticatorbutton");
            const roleID = customIdSplit[1];
            const question = (customIdSplit[2] == "true" || customIdSplit[2] == "null" || customIdSplit[2] == undefined) ? true : false;
            console.log("取得されたデータ:" + roleID + "/" + question);
            if (question) {
                const embed = new EmbedBuilder();
                let one = Math.floor(Math.random() * 9),
                    two = Math.floor(Math.random() * 9),
                    ord = [];
                ord.push({ type: "+", Num: one + two });
                ord.push({ type: "-", Num: one - two });
                ord.push({ type: "*", Num: one * two });
                let calc_type = Math.floor(Math.random() * (ord.length - 1));
                for (let i = (ord.length - 1); i != 0; i--) {
                    const random = Math.floor(Math.random() * i);
                    let tmp = ord[i];
                    ord[i] = ord[random];
                    ord[random] = tmp;
                };
                embed.setTitle("問題！");
                embed.setDescription("下の計算を解くだけで認証が出来ます！");
                embed.addFields({
                    name: one + ord[calc_type].type + two + "=",
                    value: "の答えを下から選びましょう。"
                });
                const components = new ActionRowBuilder();
                for (let i = 0; ord.length != i; i++) {
                    const point = "calc";
                    const customId = roleID + point + i + point + calc_type;
                    console.log("ボタンに埋め込まれたデータ: " + customId);
                    components.addComponents(
                        new ButtonBuilder()
                            .setLabel(String(ord[i].Num))
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(customId)
                    );
                };
                interaction.reply({
                    embeds: [embed],
                    components: [components],
                    ephemeral: true
                });
                console.log("問題作成。データ:" + one + "/" + two + "/" + calc_type, ord);
            } else giveaRole(interaction, roleID);
        } else if (interaction.customId.match(/[0-9]calc[0-9]/)) {
            const splited = interaction.customId.split("calc");
            const roleID = splited[0];
            const request = Number(splited[1]);
            const calc_type = Number(splited[2]);
            console.log("問題合格検査。データ:" + roleID + "/" + request + "/" + calc_type);
            if (interaction.customId.match()) {
                const awnser = calc_type;
                if (request == awnser) giveaRole(interaction, roleID)
                else {
                    interaction.reply({
                        content: "あぁ...答えが違いますよ...\nもっかいクリックしてやりなおしましょ！",
                        ephemeral: true
                    });
                };
            };
        };
    };
});
/**
 * ロールを付与します。
 * @param {Interaction} interaction 
 * @param {string} roleID 
 */
const giveaRole = (interaction, roleID) => {
    console.log("ロール付与。データ:" + roleID);
    interaction.guild.roles.fetch(roleID).then(role => {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        member.roles.add(role)
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
                    let error2 = "";
                    if (e.message) error2 += "/" + e.message;
                    interaction.reply({
                        content: e.code + ": " + error + error2 + "\nこのエラーを管理人に報告してくれると、一時的に対処が行われます。",
                        ephemeral: true
                    });
                    if (error) console.log("エラー確認: " + error + error2 + "\nこのエラーはかずなみに送る必要性はなさそうです。");
                } else {
                    console.log(e);
                    interaction.reply({
                        content: "認証でエラーが発生してしまいました...\nエラーは管理者が確認し修正します。",
                        ephemeral: true
                    });
                };
            });
    });
};
client.login(process.env.token);