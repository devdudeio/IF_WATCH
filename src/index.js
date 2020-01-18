const iotaCore = require('@iota/core');
const cron = require('node-cron');
const hookcord = require('hookcord');
const isConfigurated = () => (!!process.env.DISCORD_ID && !!process.env.DISCORD_TOKEN && !!process.env.IOTA_ADDRESS);
!isConfigurated() && console.log('⚠️ set env DISCORD_ID, DISCORD_TOKEN and IOTA_ADDRESS ⚠️️');
!isConfigurated() && process.exit();
console.log('');
console.log('starting iota address watcher 🚀');
console.log('🔒 discord credentials:', process.env.DISCORD_ID, process.env.DISCORD_TOKEN);
console.log('😎 watching iota address:', process.env.IOTA_ADDRESS);
console.log('');
const testHook = () => {
    const Hook = new hookcord.Hook();
    Hook.login(process.env.DISCORD_ID, process.env.DISCORD_TOKEN);
    Hook.setPayload(
        {
            "username": "IF WATCHER",
            "avatar_url": "https://fontmeme.com/images/Doom-Logo.jpg",
            "content": `Ich sag bescheid :wen: sich auf \n\n*${process.env.IOTA_ADDRESS}*\n\nwas ändert.`,
        }
    );
    Hook.fire()
};
const sendHook = () => {
    const Hook = new hookcord.Hook();
    Hook.login(process.env.DISCORD_ID, process.env.DISCORD_TOKEN);
    Hook.setPayload(
        {
            "username": "IF WATCHER",
            "avatar_url": "https://fontmeme.com/images/Doom-Logo.jpg",
            "content": "@everyone",
            "embeds": [
                {
                    "title": `ALAAAAARM! Da bewegt sich was :man_firefighter: :woman_firefighter: :man_firefighter: :man_firefighter: :man_firefighter: `,
                    "color": 15258703,
                    "fields": [
                        {
                            "name": "last balance",
                            "value": `${lastBalance}`,
                            "inline": true,
                        },
                        {
                            "name": "explorer",
                            "value": `https://thetangle.org/address/${process.env.IOTA_ADDRESS}`,
                        }
                    ],
                    "footer": {
                        "text": `dump soon?`,
                    }
                }
            ]
        }
    );
    Hook.fire()
};


const iota = iotaCore.composeAPI({
    provider: 'https://pow.iota.community:443'
});
let lastBalance = null;
testHook();
cron.schedule('0,15,30,45 * * * * *', () =>
    iota.getBalances([process.env.IOTA_ADDRESS], 100)
        .then(({ balances }) => {
            if(lastBalance === null) lastBalance = balances[0];
            if(lastBalance > balances[0]) sendHook();
            lastBalance = balances[0];
        })
);
