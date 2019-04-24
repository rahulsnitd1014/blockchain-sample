/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { asn } from './asn';
import { AdvanceShipNotice } from './asn';

export class Transit extends Contract {
    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const cars: any[] = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
            // {
            //     color: 'red',
            //     make: 'Ford',
            //     model: 'Mustang',
            //     owner: 'Brad',
            // },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async createASN(ctx: Context, poNumber: string, asnXML: string, asnJson: string) {
        console.info('============= START : Create ASN ===========');
        const advanceShipNotice : AdvanceShipNotice = JSON.parse(asnJson);
        const asn: asn = {
            poNumber, 
            asnXML,
            asnJson,
            advanceShipNotice,
            docType: 'asn'          
        };

        await ctx.stub.putState(poNumber, Buffer.from(JSON.stringify(asn)));
        console.info('============= END : Create ASN ===========');
    }

    public async queryASN(ctx: Context, poNumber: string): Promise<string> {
        const asnAsBytes = await ctx.stub.getState(poNumber); // get the asn from chaincode state
        if (!asnAsBytes || asnAsBytes.length === 0) {
            throw new Error(`${poNumber} does not exist`);
        }
        console.log(asnAsBytes.toString());
        return asnAsBytes.toString();
    }

    public async createPO(ctx: Context, poNumber: string, poJson: string): Promise<string> {
        console.info('============= START : Create PO ===========');
        await ctx.stub.putState(poNumber, Buffer.from(JSON.stringify(poJson)));
        console.info('============= END : Create PO ===========');
        return poJson;
    }

    public async createLocation(ctx: Context, locationId: string, locationJson: string): Promise<string> {
        console.info('============= START : Create Location ===========');
        await ctx.stub.putState(locationId, Buffer.from(JSON.stringify(locationJson)));
        console.info('============= END : Create Location ===========');
        return locationJson;
    }

    public async createProduct(ctx: Context, productId: string, productJson: string): Promise<string> {
        console.info('============= START : Create Product ===========');
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(productJson)));
        console.info('============= END : Create Product ===========');
        return productJson;
    }

}
