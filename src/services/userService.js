const dateMakers = require('./helpers/dateMakers');

module.exports = (context) => {
    const db = context('db')(context);

    return {
        getAllUsers: async (query, cb, errorCb) => {
            const query_date = new Date(query.LoanDate);
            if (query.LoanDate && query.LoanDuration) {
                try {
                    const borrow_date = dateMakers.subtractDuration(query_date, query.LoanDuration);
                    const users = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, query_date);
                    return cb(users);
                } catch (e) {
                    console.log(e);
                    return errorCb(500, e);
                }
            } else if (query.LoanDate) {
                try {
                    const users = await db.User.getAllUsersWithOnGoingLoanOnDate(query_date);
                    return cb(users);
                } catch (e) {
                    return errorCb(500, e);
                }
            } else if (query.LoanDuration) {
                try {
                    const today = new Date();
                    const borrow_date = dateMakers.subtractDuration(today, query.LoanDuration);
                    const return_date = dateMakers.addDuration(today, query.LoanDuration);
                    const users = await db.User.getAllUsersWithLoansLongerThanDuration(borrow_date, return_date);
                    return cb(users);
                } catch (e) {
                    return errorCb(500, e);
                }
            }

            try {
                const users = await db.User.getAllUsers().select('-publications');
                return cb(users);
            } catch (e) {
                console.log(e);
                errorCb(500, "Interal Server Error!");
            }
        },

        getUserById: async (id, cb, errorCb) => {
            try {
                return cb("hello");
            } catch (e) {
                console.log(e);
                errorCb(500, "Internal Server Error!");
            }
        }
    }

}