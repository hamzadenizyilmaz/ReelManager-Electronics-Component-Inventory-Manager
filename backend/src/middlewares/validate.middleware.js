const { fail } = require("../utils/api-response");
function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) return fail(res, "Validation error", error.details.map((d) => d.message), 422);
    req[source] = value;
    next();
  };
}
module.exports = validate;
