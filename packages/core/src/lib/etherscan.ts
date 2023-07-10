import { ETHERSCAN_URL } from '../config';

export const txLink = (txHash: string) => `${ETHERSCAN_URL}/tx/${txHash}`;

export const tokenLink = (contractAddress: string, tokenId: string) =>
  `${ETHERSCAN_URL}/token/${contractAddress}?a=${tokenId}`;

export const tokenHolderLink = (
  contractAddress: string,
  holderAddress: string
) => `${ETHERSCAN_URL}/token/${contractAddress}?a=${holderAddress}`;
