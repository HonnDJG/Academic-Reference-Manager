module.exports = (context) => {

    const boom = context('boom');

    return {
        createThrow: function (e) {
            if (e.isBoom) { throw e }
            if (e.name == "ValidationError") {
                const error = boom.preconditionFailed();
                error.output.payload.message = this.extractValidatorErrorMessages(e);
                throw error;
            } else if ((e.name == "CastError" && e.kind == "ObjectId") || e == 'badId') {
                const error = boom.badRequest('Invalid ID format entered');
                throw error;
            }
            throw boom.badImplementation();
        },

        extractValidatorErrorMessages: (e) => {
            const array = [];
            Object.values(e.errors).forEach(value => {
                array.push(value.message);
            });

            return array;
        }
    }
}