import {
    ContactModel,
    Pager,
    sortContacts,
    filterContacts,
} from "@jworkman-fs/asl";

export const getContacts = (req, res, next) => {
    try {
        let contacts = ContactModel.index();

        const filterBy = req.get("X-Filter-By");
        const filterOp = req.get("X-Filter-Operator");
        const filterVal = req.get("X-Filter-Value");

        if (filterBy && filterOp && filterVal) {
            // simplified - should work
            // contacts = filterContacts(filterBy, filterOp, filterVal, contacts); OLD VERSION
            contacts = filterContacts(contacts, filterBy, filterOp, filterVal); // NEW VERSION - hopefully pasts test this time
        }

        const sortBy = req.query.sort;
        const direction = req.query.direction;

        if (sortBy) {
            contacts = sortContacts(contacts, sortBy, "asc");
        }

        if (sortBy && direction) {
            contacts = sortContacts(contacts, sortBy, direction);
        }

        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        const pager = new Pager(contacts, page, limit);
        res.set("X-Page-Total", pager.total);
        res.set("X-Page-Next", pager.next());
        res.set("X-Page-Prev", pager.prev());

        return res.status(200).json(pager.results());
    } catch (err) {
        return next(err);
    }
};

export const createContact = (req, res, next) => {
    try {
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message:
                    "Please send your request again with your contact's info.",
                success: false,
            });
        }

        const newContact = ContactModel.create(data);

        return res.status(201).json(newContact);
    } catch (err) {
        return next(err);
    }
};

export const getContactById = (req, res, next) => {
    const { id } = req.params;
    try {
        const foundContact = ContactModel.show(id);

        return res.status(200).json(foundContact);
    } catch (err) {
        return next(err);
    }
};

export const updateContact = (req, res, next) => {
    const { id } = req.params;
    try {
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message:
                    "Please send your request again with your contact's info.",
                success: false,
            });
        }

        const updatedContact = ContactModel.update(id, data);

        return res.status(200).json(updatedContact);
    } catch (err) {
        return next(err);
    }
};

export const deleteContact = (req, res, next) => {
    const { id } = req.params;
    try {
        ContactModel.remove(id);

        return res.status(200).json({
            message: "Contact has been successfuly deleted",
            success: true,
        });
    } catch (err) {
        return next(err);
    }
};
