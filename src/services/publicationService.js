module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');
    const throwCreator = context('throwCreator')(context);
    const overlapChecker = context('overlapChecker');
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
        getPublicationsOnLoanByDate: async (query) => {
            const { loanDate } = query
            try {
                const publications = await db.Loan.getPublicationsOnLoanByDates(loanDate, loanDate);
                return publications;
            } catch (e) {
                console.log(e);
                throwCreator.createThrow(e);
            }
        },
        getPublicationsOnLoanByUserId: async (u_id) => {
            const today = moment().startOf('day').toDate();

            try {
                await db.User.checkExistence(u_id);
                const publications = await db.Loan.getPublicationsOnLoanByDateAndUserId(u_id, today);
                return publications;
            } catch (e) {
                console.log(e);
                throwCreator.createThrow(e);
            }
        },
        getPublicationsOnLoanByDuration: async (query) => {
            const { loanDuration } = query
            const borrow_date = moment().startOf('day').subtract(loanDuration, 'days').toDate();
            const return_date = moment().startOf('day').toDate();

            try {
                const publications = await db.Loan.getPublicationsOnLoanByDates(borrow_date, return_date);
                return publications;
            } catch (e) {
                console.log(e);
                throwCreator.createThrow(e);
            }
        },
        getPublicationsOnLoanByDateAndDuration: async (query) => {
            const { loanDuration, loanDate } = query
            const borrow_date = moment(loanDate).subtract(loanDuration, 'days').toDate();
            const return_date = moment(loanDate).toDate();

            try {
                const publications = await db.Loan.getPublicationsOnLoanByDates(borrow_date, return_date);
                return publications;
            } catch (e) {
                console.log(e);
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
                if (!publication) { throw boom.notFound(`Publication of ID: ${id} was not found`) }
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
                if (!body.borrow_date) { throw boom.preconditionFailed("'borrow_date' must not be null") };
                const bbd = overlapChecker.createDate(body.borrow_date);
                const brd = body.return_date ? overlapChecker.createDate(body.return_date) : null;
                // const users = await db.User.getUserswithPublication(pid);
                // let noOverlap = true
                // users.forEach(u => {
                //     u.publications.forEach(p => {
                //         const ubd = p.borrow_date;
                //         const urd = p.return_date;
                //         if (p.publication == pid) {
                //             if (!overlapChecker.checkOverlap(bbd, brd, ubd, urd)) {
                //                 noOverlap = false;
                //             }
                //         }
                //     })
                // })
                // if (noOverlap) {
                //     console.log("XD");
                const loan = {
                    "publication": pid,
                    "borrow_date": bbd,
                    "return_date": brd
                };
                //     const returnLoan = await db.User.loanPublication(loan, uid);
                //     return returnLoan;
                // }
                // return "This publication can't be loaned at these dates";
                const onLoan = await db.User.getOnGoingLoansOfPublicationByUserId(pid, bbd);

                if (onLoan.length) {
                    throw boom.conflict("This publication is already on loan at this date or already borrowed ahead of time for indefinite time");
                } else {
                    await db.User.loanPublicationForUser(uid, loan);
                }
            } catch (e) {
                console.log(e);
                throwCreator.createThrow(e);
            }
        },

        updateLoan: async (uid, pid, body) => {
            try {
                await db.User.checkExistence(uid);
                await db.Publication.checkExistence(pid);
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
                        if (p.publication == pid && p_id != body._id) {
                            if (!overlapChecker.checkOverlap(bbd, brd, ubd, urd)) {
                                console.log(p_id);
                                console.log(body._id);
                                noOverlap = false;
                            }
                        }
                    })
                })
                if (noOverlap) {
                    const loan = {
                        "_id": body._id,
                        "publication": pid,
                        "borrow_date": bbd
                    };
                    const returnLoan = await db.User.updateLoan(loan, uid, body._id);
                    return returnLoan;
                }
                return "This publication is already on loan on these days";
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
    }
}