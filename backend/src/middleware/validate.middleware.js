function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      sendResponse(res, 400, false, "Validation failed.", errors);
    }

    req.body = result.data;

    next();
  };
}

module.exports = validate;
