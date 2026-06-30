/**
 * Send API Response
 *
 * @param {Object} res
 * @param {Number} statusCode
 * @param {Boolean} success
 * @param {String} message
 * @param {*} data
 */
function sendResponse(res, statusCode, success, message, data = null) {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

module.exports = sendResponse;
