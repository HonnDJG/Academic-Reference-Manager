module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');
    const throwCreator = context('throwCreator')(context);
    const moment = context('moment');

    return {
        getAllPublications: async () => {
            try {
                const publications = await db.Publication.getAllPublications();
                return publications;
            } catch (e) {
                throwCreator.createThrow(e);
            }

        },
        getPublicationsOnLoanByDate: async (userType, query) => {
            const { loanDate } = query
            try {
                const publications = await db.Loan.getPublicationsOnLoanByDates(loanDate, loanDate);
                if (userType == "admin") {
                    const publicationsWithUsers = await Promise.all(await publications.map(async x => ({
                        ...x,
                        loaned_to: await db.Loan.getUsersOnLoanByDatesAndPublicationId(x._id, loanDate, loanDate)
                    })));
                    return publicationsWithUsers;
                }
                return publications;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        getPublicationsOnLoanByUserId: async (u_id) => {
            const today = moment().startOf('day').toDate();
            try {
                await db.User.checkExistence(u_id);
                const publications = await db.Loan.getPublicationsOnLoanByDatesAndUserId(u_id, today, today);
                return publications;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        getPublicationsOnLoanByDuration: async (query) => {
            const { loanDuration } = query
            const borrow_date = moment().startOf('day').subtract(loanDuration, 'days').toDate();
            const return_date = moment().startOf('day').toDate();

            try {
                const publications = await db.Loan.getPublicationsOnLoanByDates(borrow_date, return_date);
                const publicationsWithUsers = await Promise.all(await publications.map(async x => ({
                    ...x,
                    loaned_to: await db.Loan.getUsersOnLoanByDatesAndPublicationId(x._id, borrow_date, return_date)
                })));
                return publicationsWithUsers;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        getPublicationsOnLoanByDateAndDuration: async (query) => {
            const { loanDuration, loanDate } = query
            const borrow_date = moment(loanDate).subtract(loanDuration, 'days').toDate();
            const return_date = moment(loanDate).toDate();

            try {
                const publications = await db.Loan.getPublicationsOnLoanByDates(borrow_date, return_date);
                const publicationsWithUsers = await Promise.all(await publications.map(async x => ({
                    ...x,
                    loaned_to: await db.Loan.getUsersOnLoanByDatesAndPublicationId(x._id, borrow_date, return_date)
                })));
                return publicationsWithUsers;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        createPublication: async (publication) => {
            try {
                const result = await db.Publication.createPublication(publication);
                return result;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        getPublicationById: async (id) => {
            try {
                const publication = await db.Publication.getPublicationById(id);
                if (!publication) { throw boom.notFound(`Publication of ID: ${id} was not found or has been deleted`) }
                const borrow_history = await db.Loan.getLoansByPublicationId(id);
                const retVal = { ...publication.toObject(), borrow_history }
                return retVal;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        removePublicationById: async (id) => {
            try {
                await db.Publication.checkExistence(id);
                const deleted = await db.Publication.removePublicationById(id);
                return "Publication removed successfully";
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        updatePublicationById: async (id, body) => {
            try {
                await db.Publication.checkExistence(id);
                const result = await db.Publication.updatePublicationById(id, body);
                return result;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        getPublicationByUserId: async (id) => {
            try {
                await db.User.checkExistence(id);
                const user = await db.User.getPublicationByUserId(id).populate("publications.publication");
                return user.publications;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        loanPublication: async (uid, pid, body) => {
            try {
                await db.User.checkExistence(uid);
                await db.Publication.checkExistence(pid);

                if (body.borrow_date && body.return_date) {
                    const borrow_date = moment(body.borrow_date, "YYYY-MM-DD", true);
                    const return_date = moment(body.return_date, "YYYY-MM-DD", true);

                    if (!borrow_date.isValid() || !return_date.isValid()) {
                        throw boom.preconditionFailed('Invalid Date Input');
                    };

                    const existingLoan = await db.Loan.getLoanByPublicationAndUserId(pid, uid);
                    if (existingLoan) { throw boom.conflict("User has already taken this publication out for loan!"); }

                    const publicationOnLoan = await db.Loan.getIfPublicationOnLoanByDates(pid, body.borrow_date, body.return_date)
                    if (publicationOnLoan.length != 0) { throw boom.conflict("This publication is already being loaned to someone!"); }

                    const loanBody = { user: uid, publication: pid, borrow_date: borrow_date.toDate(), return_date: return_date.toDate() }
                    const loan = await db.Loan.createLoan(loanBody);
                    return loan;
                }
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        updateLoan: async (uid, pid, body) => {
            try {
                await db.User.checkExistence(uid);
                await db.Publication.checkExistence(pid);

                if (body.borrow_date && body.return_date) {
                    const borrow_date = moment(body.borrow_date, "YYYY-MM-DD", true);
                    const return_date = moment(body.return_date, "YYYY-MM-DD", true);

                    if (!borrow_date.isValid() || !return_date.isValid()) {
                        throw boom.preconditionFailed('Invalid Date Input');
                    };

                    if (!(borrow_date <= return_date)) { throw boom.preconditionFailed('`return_date` must be later than `borrow_date`'); }

                    const existingLoan = await db.Loan.getLoanByPublicationAndUserId(pid, uid);
                    if (!existingLoan) { throw boom.conflict("User has not taken this publication out for loan!"); }

                    const loanBody = { user: uid, publication: pid, borrow_date: borrow_date.toDate(), return_date: return_date.toDate() }
                    const loan = await db.Loan.updateLoan(loanBody);
                    return loan;
                }

            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        returnPublication: async (uid, pid) => {
            try {
                await db.User.checkExistence(uid);
                await db.Publication.checkExistence(pid);

                const loan = await db.Loan.getLoanByPublicationAndUserId(pid, uid);
                const today = moment().startOf('day').toDate();

                if (today < loan.borrow_date) { throw boom.conflict("The user has not taken this book yet"); }

                const result = await db.Loan.returnLoan(uid, pid, today);
                return result;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
    }
}