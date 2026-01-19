// Import all of Justin's errors
/*import {
    ContactNotFoundError,DuplicateContactResourceError,InvalidContactError,
    InvalidContactFieldError,InvalidContactSchemaError,InvalidEnumError,
    PagerOutOfRangeError,PagerLimitExceededError,PagerNoResultsError,
} from "@jworkman-fs/asl";

The above is NOT supported. I got this message back:
SyntaxError: Named export 'ContactNotFoundError' not found. The requested module '@jworkman-fs/asl' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@jworkman-fs/asl';
*/

import pkg from "@jworkman-fs/asl";

// Now make an error handler function for all exceptions
// DRY principal, no need to write this for every single controller function
// p.s. we learned about middleware in our previous class with Brandon, albeit I had to do plenty of self-study
export const errorHandler = (error, req, res, _next) => {
    // console.log("ERR:", error);
    // console.log("ERR MSG:", error.message);

    if (!error)
        return res.status(500).json({
            message: "Unknown error",
            success: false,
        });

    // I discovered the DuplicateContactResourceError doesn't seem to work because I always got back:
    // TypeError: DuplicateContactError is not a constructor
    if (error.message == "DuplicateContactError is not a constructor")
        return res.status(409).json({
            message: "Duplicate contact",
            success: false,
        });

    switch (error) {
        case pkg.InvalidContactError:
        case pkg.InvalidContactFieldError:
        case pkg.InvalidContactSchemaError:
        case pkg.InvalidEnumError:
        case pkg.PagerLimitExceededError:
            return res.status(400).json({
                message: error.message,
                success: false,
            });

        case pkg.ContactNotFoundError:
            return res.status(404).json({
                message: error.message,
                success: false,
            });

        case pkg.DuplicateContactResourceError:
            return res.status(409).json({
                message: error.message,
                success: false,
            });

        case pkg.DuplicateContactError:
            return res.status(409).json({
                message: error.message,
                success: false,
            });

        case pkg.PagerOutOfRangeError:
            return res.status(416).json({
                message: error.message,
                success: false,
            });

        case pkg.PagerNoResultsError:
            return res.status(200).json([]);

        default:
            return res.status(error.statusCode ?? 500).json({
                message: error.message ?? "Server error",
                success: false,
            });
    }
};
