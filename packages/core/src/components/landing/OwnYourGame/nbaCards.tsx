import shuffle from 'shuffle-array';

const nbaUrls = [
  'https://assets.sorare.com/cardsamplepicture/74193d61-4b11-4e46-9355-7d757fe7104e/picture/tinified-dc4800edf95ed5976bba5df7c1d26156.png',
  'https://assets.sorare.com/cardsamplepicture/27a3ee65-0143-4713-b7da-68d17acf4587/picture/tinified-b198742e03e5aaa1c4d990ea2273f9d6.png',
  'https://assets.sorare.com/cardsamplepicture/b59dec1c-c662-498a-9691-a80cb3c8d2eb/picture/tinified-28e77ecc08ed023c0c22a06e8e071950.png',
  'https://assets.sorare.com/cardsamplepicture/01178e44-0ae4-4404-bebd-4fb27e59a5ec/picture/tinified-142f81e19fcc787812fd9a0b1b2e4191.png',
  'https://assets.sorare.com/cardsamplepicture/f15630de-2522-4a10-ac7f-2ee04ba9e6f5/picture/tinified-fe8a938f8d3a6720f7a1b15978cb4632.png',
  'https://assets.sorare.com/cardsamplepicture/36c094f5-a9af-4028-8dcf-fcb45e8f6a11/picture/tinified-2e12f564eb6b56d863d4a2afdbe0961f.png',
  'https://assets.sorare.com/cardsamplepicture/2ea4a2c8-c7be-449a-aa6e-0cbcc6de3b78/picture/tinified-ad1322a8c75d1501d1693d7dadd948e4.png',
  'https://assets.sorare.com/cardsamplepicture/f4759056-29a2-4dc2-8063-dde2eb95b550/picture/tinified-aeb1769e2fb0d994139a217203bbb5cd.png',
  'https://assets.sorare.com/cardsamplepicture/47dbbb58-e92a-48b6-a193-2a90dd93d010/picture/tinified-3ff19e9dec7017185c9e569600ad530e.png',
  'https://assets.sorare.com/cardsamplepicture/39789c6d-cbdb-449a-acec-5a1517dcc925/picture/tinified-ac6abc8aeab7a1da902b43d369eff59d.png',
  'https://assets.sorare.com/cardsamplepicture/29494977-73ff-4e88-9fb0-cb55ee682ef4/picture/tinified-fdee02311b50d026d3cb92700728fc58.png',
  'https://assets.sorare.com/cardsamplepicture/c4a6d273-5e0e-4c3f-b222-d8675c1ae2ce/picture/tinified-6e48e6ea5f4cd52ad4d4912af6e9d195.png',
  'https://assets.sorare.com/cardsamplepicture/9b486d33-5447-4618-b935-61d0720efac4/picture/tinified-38b242a2e2bdd54528a5953e9848fb60.png',
  'https://assets.sorare.com/cardsamplepicture/067785d7-3dea-4bce-92ad-cab1e45359ef/picture/tinified-eba3c95a8d2ca8f2242117841b240f00.png',
  'https://assets.sorare.com/cardsamplepicture/170f1c74-664b-491a-a19e-24dddeff6c18/picture/tinified-f28ec0d0bcdbfb571e3e29143fe862f8.png',
  'https://assets.sorare.com/cardsamplepicture/6f4c5e38-29d2-43a3-8c63-23a792d2863b/picture/tinified-ea5ed4a3b9f269690504052d9d22a701.png',
  'https://assets.sorare.com/cardsamplepicture/95e2723d-16d5-4131-a703-90c5ecf5985a/picture/tinified-d334174fcb7101e76e9527c8dabc8b6e.png',
  'https://assets.sorare.com/cardsamplepicture/c19dae12-2859-43aa-b1be-165434d641fa/picture/tinified-66a3aa034b6f10e37a47b72e68b5edb4.png',
  'https://assets.sorare.com/cardsamplepicture/771e321f-c198-45c3-8f7b-8620c6789fca/picture/tinified-5e7a6c2bbdc1936cef09967853970276.png',
  'https://assets.sorare.com/cardsamplepicture/ae2b7784-2a66-4c64-9a30-b9bfe4abf7b2/picture/tinified-d011120337a248a71b8bd5c16399374e.png',
  'https://assets.sorare.com/cardsamplepicture/7ecdcdc8-21fb-419d-b0ec-9cd3287f13c8/picture/tinified-bb36e1150c65eeab2ca7b067e09173c5.png',
  'https://assets.sorare.com/cardsamplepicture/62cd59bb-6ca7-4c99-a7f3-8191559a5a28/picture/tinified-ca7a9ac17e2467f2adc192ce1d578c57.png',
  'https://assets.sorare.com/cardsamplepicture/a4725220-2da4-470e-afa2-fc5b3f2932e6/picture/tinified-99dd61441b112249f00b002ff3eaf3db.png',
  'https://assets.sorare.com/cardsamplepicture/c2df9678-0c29-42b7-93b0-5be696b7603d/picture/tinified-08aefed2b910270cf9f491b499fcb0fd.png',
];
const nbaCards = shuffle(nbaUrls);

export default nbaCards;
