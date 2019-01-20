import {Gen} from "../../../helpers/gen";

export const validate_filters = values => {

    const errors = {};

    const requiredFields = [
    ];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });

    if(values['fromRating']){
        let value = values['fromRating'];
        if(!Gen.isValidRating(value)) {
            errors.fromRating = "Enter a valid from Rating";
        }
    }

    if(values['toRating']){
        let value = values['toRating'];
        if(!Gen.isValidRating(value)) {
            errors.toRating = "Enter a valid to Rating";
        }
    }
    return errors;
};

export const validate_review = values => {

    const errors = {};

    const requiredFields = [
        'rating',
        'date',
    ];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });

    if(values.rating) {
        if(!Gen.isValidRating(values.rating)) {
            errors.rating = "Enter a valid rating";
        }
    }

    return errors;
};


export const validate_restaurant = values => {

    const errors = {};

    const requiredFields = [
        'name',
        'address',
    ];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    if(values.name && (values.name.length < 3 || values.name.length > 50))
        errors.name = "name must be between 3 and 50 length";

    if(values.address && (values.address.length < 3 || values.address.length > 50))
        errors.address = "address must be between 3 and 50 length";

    return errors;
};

export const validate_registerForm = values => {

    const errors = {}

    const requiredFields = [
        'name',
        'email',
        'password',
        'sex',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }

    if (
        values.email && values.email.length < 6
    ) {
        errors.password = 'Invalid password'
    }

    return errors;
}

export const validate_loginForm = values => {

    const errors = {}

    const requiredFields = [
        'email'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }
    return errors;
}

export const validate_resetForm = values => {

    const errors = {}

    const requiredFields = [
        'token',
        'password',
        'confirmPassword'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.password !== values.confirmPassword
    ) {
        errors.confirmPassword = 'Passwords do not match'
    }
    return errors;
}
