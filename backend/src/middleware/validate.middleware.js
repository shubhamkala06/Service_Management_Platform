// function validate(schema) {
//   return (req, res, next) => {
//     const result = schema.safeParse(req.body);

//     if (!result.success) {
//       sendResponse(res, 400, false, "Validation failed.", errors);
//     }

//     req.body = result.data;

//     next();
//   };
// }

// module.exports = validate;

// const sendResponse = require("../../core/utils/response");

const sendResponse = require("../core/utils/response");

function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return sendResponse(
        res,
        400,
        false,
        "Validation failed",
        result.error.flatten(),
      );
    }

    req[source] = result.data;

    next();
  };
}

module.exports = validate;
