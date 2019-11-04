
/**
 * User service
 */
module.exports = (context) => {
    const db = context('db')(context),
        boom = context('boom'),
        throwCreator = context('throwCreator')(context),
        moment = context('moment');

    return {
        getAllUsers: async () => {
            try {
                const users = await db.User.getAllUsers();
                return users;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        // gets values from query and gets users and the list of users publications they have on loan
        getUsersByDateAndDuration: async (query) => {
            const { loanDate, loanDuration } = query;
            try {
                const borrow_date = moment(loanDate).subtract(loanDuration, 'days').toDate();

                const users = await db.Loan.getUsersOnLoanByDates(borrow_date, loanDate);
                const usersWithLoan = await Promise.all(users.map(async x => {
                    return {
                        ...x,
                        publications_on_loan: await db.Loan.getPublicationsOnLoanByDatesAndUserId(x._id, borrow_date, loanDate)
                    }
                }));

                return usersWithLoan;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        // gets loanDate value from query and returns the list of users and publications they have on loan
        getUsersOnLoanByDate: async (query) => {
            const { loanDate } = query
            try {
                const users = await db.Loan.getUsersOnLoanByDates(loanDate, loanDate);
                const usersWithLoan = await Promise.all(users.map(async x => {
                    return {
                        ...x,
                        publications_on_loan: await db.Loan.getPublicationsOnLoanByDatesAndUserId(x._id, loanDate, loanDate)
                    }
                }));

                return usersWithLoan;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        // gets loanDuration value from query and returns list of users and publications they have on loan
        getUsersByDuration: async (query) => {
            const { loanDuration } = query
            const borrow_date = moment().startOf('day').subtract(loanDuration, 'days').toDate();
            const return_date = moment().startOf('day').toDate();

            try {
                const users = await db.Loan.getUsersOnLoanByDates(borrow_date, return_date);
                const usersWithLoan = await Promise.all(users.map(async x => {
                    return {
                        ...x,
                        publications_on_loan: await db.Loan.getPublicationsOnLoanByDatesAndUserId(x._id, borrow_date, return_date)
                    }
                }));

                return usersWithLoan;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        createUser: async (user) => {
            try {
                const result = await db.User.createUser(user);
                return result;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        getUserById: async (id) => {
            try {
                const user = await db.User.getUserById(id);
                if (!user) { throw boom.notFound(`User of ID: ${id} was not found or has been deleted`) }

                const loansByUser = await db.Loan.getLoansByUserId(id);

                const retVal = { ...user.toObject(), borrow_history: loansByUser }

                return retVal;

            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        deleteUser: async (id) => {
            try {
                const deleted = await db.User.deleteUser(id);
                if (!deleted) { throw boom.notFound(`User of ID: ${id} was not found or has been deleted`) }
                return "User removed successfully";
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        updateUser: async (id, body) => {
            try {
                const user = await db.User.updateUser(id, body);
                if (!user) { throw boom.notFound(`User of ID: ${id} was not found or has been deleted`) }
                return user;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
    }

}