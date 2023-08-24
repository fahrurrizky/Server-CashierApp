const { body, validationResult } = require('express-validator');

const passwordValidatorMiddleware = [
  body('password')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage("Password harus memiliki minimal 6 karakter, minimal 1 huruf besar, minimal 1 simbol, dan minimal 1 angka"),
  body('confirmPassword')
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Konfirmasi password tidak sesuai dengan password');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = passwordValidatorMiddleware;
