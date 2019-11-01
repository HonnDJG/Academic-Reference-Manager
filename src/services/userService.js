const dateMakers = require('./helpers/dateMakers');

module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');
    const overlapChecker = context('overlapChecker');

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

        createUser: async (user) => {
            try{
                const result = await db.User.createUser(user);
                return result;
            }catch(e){
                throw boom.badImplementation();
            }
        },

        getUserById: async (id) => {
            try {
                const user = await db.User.getUserWithId(id);
                return user;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        deleteUser: async (id) => {
            try {
                await db.User.deleteUser(id);
                return "User removed successfully";
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        updateUser: async (id, body) => {
            try {
                const user = await db.User.updateUser(id, body);
                return user;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        getPublicationByUserId: async (id) => {
            try {
                const user = await db.User.getPublicationByUserId(id).populate("publications.publication");
                return user.publications;
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        loanPublication: async (uid, pid, body) => {
            try {
                const bbd = overlapChecker.createDate(body.borrow_date);
                let brd = overlapChecker.createDate(body.return_date);
                if (body.return_date == null) {
                    brd = null;
                }
                const users = await db.User.getUserswithPublication(pid);
                let noOverlap = true
                users.forEach(u => {
                    u.publications.forEach(p => {
                        const ubd = p.borrow_date;
                        const urd = p.return_date;
                        if (p.publication == pid){
                            if (!overlapChecker.checkOverlap(bbd, brd, ubd, urd)) {
                                noOverlap = false;
                            }
                        }
                    })
                })
                if (noOverlap) {
                    loan = {
                        "publication": pid, 
                        "borrow_date": bbd,
                        "return_date": brd
                    };
                    returnLoan = await db.User.loanPublication(loan, uid);
                    return returnLoan;
                }
                return "This publication can't be loaned at these dates";
            } catch (e) {
                throw boom.badImplementation();
            }
        },

        updateLoan: async (uid, pid, body) => {
            try {
                const bbd = overlapChecker.createDate(body.borrow_date);
                let brd = overlapChecker.createDate(body.return_date);
                if (body.return_date == null) {
                    brd = null;
                }
                const users = await db.User.getUserswithPublication(pid);
                let noOverlap = true
                users.forEach(u => {
                    u.publications.forEach(p => {
                        const ubd = p.borrow_date;
                        const urd = p.return_date;
                        const p_id = p._id;
                        if (p.publication == pid && p_id != body._id){
                            if (!overlapChecker.checkOverlap(bbd, brd, ubd, urd)) {
                                console.log(p_id);
                                console.log(body._id);
                                noOverlap = false;
                            }
                        }
                    })
                })
                if (noOverlap) {
                    loan = {
                        "_id": body._id,
                        "publication": pid, 
                        "borrow_date": bbd,
                        "return_date": brd
                    };
                    returnLoan = await db.User.updateLoan(loan, uid, body._id);
                    return returnLoan;
                }
                return "This publication can't be loaned at these dates";
            } catch (e) {
                console.log(e);
                throw boom.badImplementation();
            }
        },
    }

}