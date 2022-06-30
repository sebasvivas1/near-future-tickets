import type { NextApiRequest, NextApiResponse } from 'next'
import * as nearAPI from 'near-api-js';
import { Account, Near, keyStores } from 'near-api-js';
import { getConfig } from '../../config';
const { networkId, nodeUrl, walletUrl, helperUrl, contractName } = getConfig(process.env.NODE_ENV || 'testnet');

const likelyUrl = (user: string) => {
    return `https://api.kitwallet.app/account/${user}/likelyNFTs`
};

const near = new Near({
    networkId,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
})

async function nearAccountCaller(): Promise<Account> {
    const nearAccountCaller = await near.account(contractName[0]);
    console.log('nearAccountCallerMainnet', await nearAccountCaller.getAccountBalance());
    return await nearAccountCaller;
}

const getNearContract = (
    account: nearAPI.Account,
     contractForInteraction: string,
      method: string,
      ): nearAPI.Contract => {
        const contract = new nearAPI.Contract(
            account,
            //"x.paras.near",
            contractForInteraction,
                {
                    viewMethods: [method],
                    changeMethods: []
                }
            );
            return contract;
}

const checkIfUserHasNfts = async (user: string) => {
    try {
        const res = await fetch(likelyUrl(user), {
            "headers": {
                "accept": "*/*",
                "accept-language": "es-US,es-419;q=0.9,es;q=0.8",
                "content-type": "application/json; charset=utf-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "sec-gpc": "1"
              }, 
        });
        const data: string[] = await res.json();
        console.log('data', data);
        if (data.includes(contractName[0])) {
            return true;
        }
    } catch (error) {
        console.log('error', error);
        return false;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
const user = req.query.user || 'near';
console.log('user', user);
const network = req.query.network || 'testnet';
console.log('network', network);
//const contract: nearAPI.Contract = getNearContract(await nearAccountCaller(), contractName[0], 'nft_tokens');
const respond = await checkIfUserHasNfts(user.toString());
res.json(respond);
}