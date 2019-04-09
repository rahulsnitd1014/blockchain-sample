import { FileSystemWallet, Gateway } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

import {AdvanceShipNotice, } from './util/interfaces';


const ccpPath = path.resolve(__dirname, '..', '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function submitASN(poNumber:string, asnXML:string) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.ts application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('transit');

        let advanceShipNotice: AdvanceShipNotice;
        xml2js.parseString(asnXML, async function (err, result) {
            advanceShipNotice = result;
            console.log(JSON.stringify(advanceShipNotice));
            console.log(`ASN Transaction has been submitted`);
        });
        await contract.submitTransaction('createASN', poNumber, asnXML, JSON.stringify(advanceShipNotice));


        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        //process.exit(1);
    }
}


export {
    submitASN,
};
