import shuffle from 'shuffle-array';

const footballUrls = `
kylian-mbappe-lottin, super_rare, https://assets.sorare.com/card/d22347db-8e61-4e9e-9e78-8cd4d5eed882/picture/tinified-314121dfe1d9fef1bd18c10cc5e2b274.png
lionel-andres-messi-cuccittini, rare, https://assets.sorare.com/card/816d3ce2-470f-4976-8532-82eeb1b42bf7/picture/tinified-df6de81882204a9164a51299a84d94f2.png
marcos-aoas-correa, limited, https://assets.sorare.com/card/1d19d088-44e6-4fba-9af6-6f990a343fc3/picture/tinified-a46ceb02eb1f90e4fec44ed92e9e7877.png
rafael-alexandre-conceicao-leao, limited, https://assets.sorare.com/card/5b772585-5efc-4d89-b174-14f4395250cd/picture/tinified-30096400e0bceb20a8dbb76de241a7bc.png
theo-bernard-francois-hernandez, super_rare, https://assets.sorare.com/carddata/4b810f57-085a-461e-bacf-aab705ddc851/picture/tinified-ea96b27faab146fbae55e22e4f7ed6d6.png
sandro-tonali, limited, https://assets.sorare.com/carddata/0cc309f1-1a72-4cd4-a2b3-874e1d2dfd64/picture/tinified-05d7b71c01e529c5890a2856d88e987e.png
mike-maignan, rare, https://assets.sorare.com/carddata/415088ec-d0a8-47fa-8b7a-e25941bee961/picture/tinified-9efcc02da9e52dd5f1dd9e1ba6c0f4d6.png
ismael-bennacer, rare, https://assets.sorare.com/card/3e885e7f-f98d-4130-9e02-8ad12c0c2cde/picture/tinified-08915e217bb968791f3ba0a7eac6a085.png
manuel-neuer, rare, https://assets.sorare.com/card/e7805af9-4cef-477f-86f0-dcb51b7ecd46/picture/tinified-cff593f5e151e747bed702cdaf3f48b2.png
joshua-kimmich, super_rare, https://assets.sorare.com/carddata/0f5062ee-0fcb-4b89-a4b9-313df29c2961/picture/tinified-71f38b9ef2ef0aae02b5d2cc6e021eff.png
alphonso-davies, limited, https://assets.sorare.com/carddata/106b1776-1f5d-47ce-aa56-129f6b758291/picture/tinified-c82c0600a161b8a5709bf1975e9dcd9c.png
jamal-musiala, limited, https://assets.sorare.com/carddata/65aa6b22-cd5b-4845-9717-0fb7e0719aa4/picture/tinified-0149666f9d314b4c08b51901ba665543.png
thibaut-courtois, rare, https://assets.sorare.com/card/b412ad3d-9b12-415d-80e4-528c704ca4a8/picture/tinified-dac1aa12740ab369e6e435faf79703b6.png
vinicius-jose-paixao-de-oliveira-junior, super_rare, https://assets.sorare.com/carddata/8ca2f64e-fb6e-442b-bcd4-168600b1dedd/picture/tinified-bd44bce92e655fcd13040d58047b7519.png
david-olatukunbo-alaba, limited, https://assets.sorare.com/card/73cc8abd-0850-4f80-80c6-0d52bd0197b0/picture/tinified-e041e5721a1676caa64eb662741f4ff0.png
eduardo-camavinga, super_rare, https://assets.sorare.com/carddata/589e0e42-ae96-49a9-be8f-9a56ee31e529/picture/tinified-791c10f71d7a924f1a55dd159e96e7a5.png
karim-benzema, super_rare, https://assets.sorare.com/carddata/b10381a0-1c29-4fae-bf30-3a74ab4f7c9c/picture/tinified-0555800fcc53e91459313000911d0825.png
sebastien-haller, limited, https://assets.sorare.com/carddata/7926b26d-8109-488f-b9cf-e35c628dadf5/picture/tinified-762b744221db0918df48e2b66e3e95a1.png
cody-mathes-gakpo, limited, https://assets.sorare.com/card/b42a5429-e4df-4618-9903-c1d9c4a9d891/picture/tinified-f80b2522f66b46986994bfdee2d7ced0.png
orkun-kokcu, limited, https://assets.sorare.com/carddata/9d6a1b45-082e-4aeb-a870-7d238e6b33e7/picture/tinified-ce8dc2feec6532a78c7e86b53c08fd27.png
owen-wijndal, limited, https://assets.sorare.com/carddata/2ba1cd6b-164b-45e3-a858-a894b20efb7a/picture/tinified-fbf937aa4b86e280b4d56e3bd9d2c218.png
maduka-okoye, limited, https://assets.sorare.com/card/2f540a11-2e74-449c-a6a1-57d9844e690f/picture/tinified-7be293d7a0cbc7cd0ca91fa702ec38a4.png
thiago-almada, limited, https://assets.sorare.com/card/3f952d51-c016-4f2a-898a-aa6d745c5241/picture/tinified-704e4d27b22dade02077fef246a74932.png
josef-alexander-martinez, limited, https://assets.sorare.com/carddata/f4854e88-0ebf-41fa-9a1d-bbac850f63e3/picture/tinified-b160cf3bdd76fe841c445c2d41661bba.png
valentin-mariano-jose-castellanos-gimenez, rare, https://assets.sorare.com/card/ee08c769-6f21-4941-a1b6-cd019d5a5180/picture/tinified-1736ce7fbb040fa75558baaea5b18f3d.png
alan-agustin-velasco, super_rare, https://assets.sorare.com/card/324ab542-9927-45a7-8bc9-fcbf0203d675/picture/tinified-2be76eba8bfa7252ff886c1d81d9e0a8.png
emanuel-reynoso, limited, https://assets.sorare.com/card/390aca1d-096f-45f1-87fb-cdf391314f46/picture/tinified-8efac46a576ded3a8a27ec9284e41071.png
`
  .split('\n')
  .filter(i => !!i)
  .map(i => i.split(', ')[2]);

const footballCards = shuffle(footballUrls);

export default footballCards;
