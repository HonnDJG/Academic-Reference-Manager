const dateMakers = require('./helpers/dateMakers');

module.exports = (context) => {
    const db = context('db')(context);

    return {
        getAllUsers: async (query, cb, errorCb) => {
            const date = new Date(query.loanDate);
            if (query.loanDate && query.loanDuration) {
                try {
                    const now = new Date();
                    const date = new Date(query.loanDate);
                    const datePlusDuration = dateMakers.addDuration(date, query.loanDuration);
                    // TODO: fix for newly borrowed
                    const users = await db.User.find(
                        {
                            publications: {
                                $elemMatch: {
                                    borrow_date: date,
                                    $or: [
                                        { return_date: { $gte: datePlusDuration } },
                                        { return_date: null }
                                    ]
                                }
                            }
                        }
                    );
                    return cb(users);
                } catch (e) {
                    return errorCb(500, e);
                }
            } else if (query.loanDate) {
                try {
                    const users = await db.User.getAllUsersWithLoanOnDate(date);
                    return cb(users);
                } catch (e) {
                    return errorCb(500, e);
                }
            } else if (query.loanDuration) {
                try {
                    const today = new Date();
                    const borrow_date = dateMakers.subtractDuration(today, query.loanDuration);
                    const return_date = dateMakers.addDuration(today, query.loanDuration);
                    const users = db.Users.getAllUsersWithLoansLongerThanDuration(borrow_date, return_date);
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