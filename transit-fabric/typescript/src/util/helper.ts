
/**********************************************
 * Sends response to the Client
 * @param {*} this  HTTP Response object (will be set to calling object)
 * @param {*} code HTTP Response Code
 * @param {*} data HTTP Response Data
 * @param {*} status HTTP/CUSTOM Response Code
 ***********************************************/
function sendResponse(data: any, code: number = 200, status: boolean = true) {
  if (typeof code === "boolean") {
    status = code;
    code = 200;
  }
  this.status(code)
    .json({ status, data, code })
    .end();
}

/***********************************
 * This method creates custom error
 * @param {*} error object
 ***********************************/
function customError(error: any) {
  const err = new Error();
  err.message = error.message;
  (<any>err).code = error.code;
  return err;
}

export {
  sendResponse,
  customError,
};
