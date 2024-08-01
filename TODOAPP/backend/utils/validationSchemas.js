const createUserValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: "email cannot be empty",
        },
        isString: {
            errorMessage: "email must be a string",
        },
    },
    password: {
        notEmpty: true,
    },
};

module.exports = { createUserValidationSchema };
