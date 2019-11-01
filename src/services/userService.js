const dateMakers = require('./helpers/dateMakers');

module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');

    return {
        getAllUsers: async (query) => {
            try {
                const users = await db.User.getAllUsers().select('-publications');
                return users;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        getUsersByDateAndDuration: async (query) => {
            const { loanDate, loanDuration } = query;
            try {
                const borrow_date = dateMakers.subtractDuration(loanDate, loanDuration);
                const users = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, loanDate);
                return users;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        getUsersByDate: async (query) => {
            const { loanDate } = query
            try {
                const users = await db.User.getAllUsersWithOnGoingLoanOnDate(loanDate);
                return users;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        getUsersByDuration: async (query) => {
            const { loanDuration } = query
            const today = new Date();
            const borrow_date = dateMakers.subtractDuration(today, loanDuration);
            const return_date = new Date(today);
            return_date.setHours(0, 0, 0, 0);

            try {
                const users = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
                return users;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        getUserById: async (id, cb, errorCb) => {
            try {
                return cb("hello");
            } catch (e) {
                errorCb(500, "Internal Server Error!");
            }
        }
    }

}