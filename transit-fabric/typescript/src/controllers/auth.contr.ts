"use strict";
import { HttpResponse, HttpRequest, Login, ASN, } from "../util/interfaces";
import logger from "../util/logger";
import {submitASN} from "../invokeASN";
import {queryASN} from "../queryASN";
import HttpStatus from 'http-status-codes';

async function login(req: HttpRequest, res: HttpResponse) {
  const body: Login = req.body;
  const { username, password } = body;

  return res.sendResponse({ username, password });

}

async function logout(req: HttpRequest, res: HttpResponse) {
  return res.sendResponse({ logout: true });
}


async function invokeTrans(req: HttpRequest, res: HttpResponse) {
    const body: ASN = req.body;
    const { poNumber, asnXML } = body;
    submitASN(poNumber, asnXML);
    logger.debug(JSON.stringify(body));
    return res.sendResponse(body);
}

async function searchTrans(req: HttpRequest, res: HttpResponse) {
    const poNumber: string = req.query.poNumber;
    try {
        const result = await queryASN(poNumber);
        const asn: ASN = JSON.parse(result);

        logger.debug(JSON.stringify(asn));
        return res.sendResponse(asn.advanceShipNotice, HttpStatus.OK);
    } catch (error) {
        logger.error(`${error}`);
        return res.sendResponse(`${error}`, HttpStatus.NO_CONTENT, false);
    }
}


export { login, logout, invokeTrans, searchTrans };

