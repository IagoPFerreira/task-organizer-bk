/* eslint-disable no-unused-vars */
module.exports = async ({ code, message }, _req, res, _next) => res.status(code).json({ message });
