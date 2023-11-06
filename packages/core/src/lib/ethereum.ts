import { keccak_256 } from 'js-sha3';

export const formatEthereumAddress = (ethereumAddress: string) =>
  `${ethereumAddress.slice(0, 6)}...${ethereumAddress.slice(-6, -1)}`;

export const ethNetworkName = (networkId: number | string) => {
  switch (networkId?.toString()) {
    case '1':
      return 'Mainnet';
    case '2':
      return 'Morden';
    case '3':
      return 'Ropsten';
    case '4':
      return 'Rinkeby';
    case '42':
      return 'Kovan';
    default:
      return `Private (${networkId})`;
  }
};

export const nullAddress = '0x0000000000000000000000000000000000000000';

// https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2317
const isChecksumAddress = (prefixedAddress: string) => {
  // Check each case
  const address = prefixedAddress.replace('0x', '');
  const addressHash = keccak_256(address.toLowerCase());
  for (let i = 0; i < 40; i += 1) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};

// https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2295
export const isAddress = (address: string) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  }
  if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  // Otherwise check each case
  return isChecksumAddress(address);
};
