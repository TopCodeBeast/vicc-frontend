import shuffle from 'shuffle-array';

const mlbUrls = `
mike-trout-19910807, https://assets.sorare.dev/cardsamplepicture/da702710-c66b-4de5-a11d-46eb55d0023d/picture/cca2ed8c92c721c2c70333383ab8448b.png
gerrit-cole-19900908, https://assets.sorare.dev/cardsamplepicture/f9a7fe08-ba9d-4f45-96cc-726e64740ae6/picture/791626f27b26fb10d4a3b8c0d687bfa2.png
justin-verlander-19830220, https://assets.sorare.dev/cardsamplepicture/669f0055-d73f-4b3b-80f3-fc4f679655f2/picture/33bb5f0d530c14a3d5c0a7f503099eeb.png
trea-turner-19930630, https://assets.sorare.dev/cardsamplepicture/d5d1a234-7ef0-4244-9b14-33c75e243f50/picture/1b9243d5cb234928eebb89a04d005410.png
giancarlo-stanton-19891108, https://assets.sorare.dev/cardsamplepicture/3054f970-7218-492b-ad1a-eb55606f3ca5/picture/be98ae6f0df6d1181638d4edd2f4fbd1.png
jose-ramirez-19920917, https://assets.sorare.dev/cardsamplepicture/6a9f9f56-c226-411a-8aa1-3cb7d6e62bd2/picture/12655025d3a67b487439fc5390ddbecb.png
manny-machado-19920706, https://assets.sorare.dev/cardsamplepicture/d0adbd7b-1505-4b5b-9ac0-fe788a2b5862/picture/c1f138952aed8105d88b9946eaa52d8e.png
paul-goldschmidt-19870910, https://assets.sorare.dev/cardsamplepicture/c0c82269-c9dc-44e7-be3a-1823b1c54cf4/picture/2995e23fd6399fd601b62aa31fd3785d.png
corbin-burnes-19941022, https://assets.sorare.dev/cardsamplepicture/6f2a9600-4867-4ea7-98f8-9f0bdfa9c7af/picture/07692ed102ffa78c16003c9a307d4713.png
xander-bogaerts-19921001, https://assets.sorare.dev/cardsamplepicture/751028a2-2a84-448b-9f88-8175cd16ecd5/picture/ffe247b2f0e4fd745df65e1ba6ff8236.png
bo-bichette-19980305, https://assets.sorare.dev/cardsamplepicture/154e4a65-093d-4d72-abb8-81cba8794dcc/picture/16a1ff578bd2d4d68d4601000616fedb.png
jose-altuve-19900506, https://assets.sorare.dev/cardsamplepicture/ab13c718-e54b-4c77-acd1-048bebb8c314/picture/a9ffa1dd6c3f4f6cb0d60ebab5fe1c3f.png
george-springer-19890919, https://assets.sorare.dev/cardsamplepicture/bdeeab03-e021-403f-a7e3-3a8de48468a0/picture/33e5ef3a0452fab6a43f867d18ffe174.png
juan-soto-19981025, https://assets.sorare.dev/cardsamplepicture/2d11e562-028f-4daa-a1a2-f70caab086ce/picture/edd049eb8b54ee2b6c352c1abb4f2a80.png
joc-pederson-19920421, https://assets.sorare.dev/cardsamplepicture5f53c420-c6bd-4458-89c2-c7a997b1d115/picture/8796a52ccab215240cf63ef5000f84ad.png
aaron-nola-19930604, https://assets.sorare.dev/cardsamplepicture/d9e98dc9-9b61-4c5a-a5e4-d98359cf0fcb/picture/405948e1918a31184fc36469f430ec0e.png
shane-mcclanahan-19970428, https://assets.sorare.dev/cardsamplepicture/1e4dd428-d72d-4a90-8d48-6aa78e953e13/picture/427f87d6534165284dc28604821ee791.png
josh-hader-19940407, https://assets.sorare.dev/cardsamplepicture/7d4266b2-b927-4380-866f-9286737f0f17/picture/a6fb2f32059ee63266a0f5b46d50610d.png
kevin-gausman-19910106, https://assets.sorare.dev/cardsamplepicture/d1eab58e-29be-4794-ad9a-52948f354c0a/picture/c6261f7a018891fcbfe5eff72d76780d.png
max-fried-19940118, https://assets.sorare.dev/cardsamplepicture/d866de88-f2d1-4449-8064-333db40c7b8d/picture/181b9c23c4ca6c06774412fcf4ed80ff.png
rafael-devers-19961024, https://assets.sorare.dev/cardsamplepicture/db1f0afb-986c-48d7-9faa-8a52e7678b4a/picture/f4bcef34719abfdae47334a7c968967c.png
willson-contreras-19920513, https://assets.sorare.dev/cardsamplepicture/9af97ea0-e332-4b7a-a0bb-75fc19c7d7f0/picture/ff9bdf2abc7c6f1c4b2bf97b1b27d64a.png
byron-buxton-19931218, https://assets.sorare.dev/cardsamplepicture/286b89e3-c881-4935-aed8-1481f9bc1de0/picture/c75b6a5a49e7ff262f39147dfa97dbbe.png
nolan-arenado-19910416, https://assets.sorare.dev/cardsamplepicture/c3cf99df-9d34-4447-ad50-ff905b792c6f/picture/63c2a03f5a01cf6d66ba09a7def93576.png
tim-anderson-19930623, https://assets.sorare.dev/cardsamplepicture/ca6c8e72-36cd-4037-8a6d-06f04fcb9363/picture/fe3d319496ecf84d56628eabaf460ef8.png
yordan-alvarez-19970627, https://assets.sorare.dev/cardsamplepicture/36d3114f-876e-4c01-96e0-a3a5b2c40dae/picture/3423576031dcef7e0df0daee3df38259.png
pete-alonso-19941207, https://assets.sorare.dev/cardsamplepicture/70d18d16-25a1-4d79-adef-268c9fd034cb/picture/999ee4fc2d43ee5935f7c5011f616636.png
sandy-alcantara-19950907, https://assets.sorare.dev/cardsamplepicture/ec73ccd7-8e94-4a35-a8ed-b43082f92004/picture/a6e6478f48bd451d16320cec483655ce.png
`
  .split('\n')
  .filter(i => !!i)
  .map(i => i.split(', ')[1]);
const mlbCards = shuffle(mlbUrls);
export default mlbCards;
