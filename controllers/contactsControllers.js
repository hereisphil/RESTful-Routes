/* 
    ‼️ I learned via Justin's examples/code on the official NPMJS Pages & SWAGGER:
    ‼️ https://www.npmjs.com/package/@jworkman-fs/asl
    ‼️ https://www.npmjs.com/package/@jworkman-fs/wdv-cli
    ‼️ https://wdv442-http-docs.jworkman.dev/
*/

/* -------------------------------------------------------------------------- */
/*                  LOAD ALL CONTACTS & FUNCTIONS VIA PACKAGE                 */
/* -------------------------------------------------------------------------- */
import {
    ContactModel,
    Pager,
    sortContacts,
    filterContacts,
} from "@jworkman-fs/asl";

/* -------------------------------------------------------------------------- */
/*                              GET: All Contacts                              */
/* -------------------------------------------------------------------------- */
/* NOTES:
    To integrate filtering logic into your API endpoint, utilize methods from the @jworkman-fs/asl npm package. 
    Filtering logic should precede other logic in the order of Filtering -> Sorting -> Pagination. 
    Notably, filtering at this endpoint is performed through headers, not query parameters. 
    This practice, although technically unconventional, is designed to enhance HTTP protocol skills.
*/
export const getContacts = (req, res, next) => {
    try {
        // 1️⃣: GET ALL OF THE CONTACTS
        let contacts = ContactModel.index();

        /* -------------------------------------------------------------------------- */
        /*                                  FILTERING                                 */
        /* -------------------------------------------------------------------------- */
        /*
            EXAMPLE CURL REQUESTS:
            curl -X GET -H "X-Filter-By:VALUE-GOES-HERE" http://localhost:8080/v1/contacts
            curl -X GET -H "X-Filter-Operator:VALUE-GOES-HERE" http://localhost:8080/v1/contacts
            curl -X GET -H "X-Filter-Value:VALUE-GOES-HERE" http://localhost:8080/v1/contacts
            a single curl request can have one, none, any combo, or all of the above headers
            ‼️ curl -X GET -H "X-Filter-By: birthday" -H "X-Filter-Operator: gte" -H "X-Filter-Value: 1980-01-01" http://localhost:8080/v1/contacts?page=2&sort=lname&direction=desc&size=5
        */

        // 2️⃣: DEFINE & GET THE HEADERS
        const filterBy = req.get("X-Filter-By");
        const filterOp = req.get("X-Filter-Operator");
        const filterVal = req.get("X-Filter-Value");

        // 3️⃣: UPDATE CONTACTS IF HEADERS ARE PRESENT
        if (filterBy && filterOp && filterVal) {
            // contacts = filterContacts(filterBy, filterOp, filterVal, contacts); OLD VERSION
            contacts = filterContacts(contacts, filterBy, filterOp, filterVal); // NEW VERSION

            /*
                ⚠️ TESTING MANUALLY VIA CURL IN TERMINAL:
                curl -X GET -H "X-Filter-By: birthday" -H "X-Filter-Operator: gte" -H "X-Filter-Value: 1997-04-06" http://localhost:8080/v1/contacts
                { op: 'gte', by: 'birthday', value: '1997-04-06', expect: { first: 67, last: 251 } }, ✅

                curl -X GET -H "X-Filter-By: birthday" -H "X-Filter-Operator: gt" -H "X-Filter-Value: 1997-04-06" http://localhost:8080/v1/contacts
                { op: 'gt', by: 'birthday', value: '1997-04-06', expect: { first: 251, last: 251 } }, ✅

                curl -X GET -H "X-Filter-By: birthday" -H "X-Filter-Operator: eq" -H "X-Filter-Value: 1982-04-17" http://localhost:8080/v1/contacts
                { op: 'eq', by: 'birthday', value: '1982-04-17', expect: { first: 243, last: 243 } }, ✅

                curl -X GET -H "X-Filter-By: birthday" -H "X-Filter-Operator: lte" -H "X-Filter-Value: 1997-04-06" http://localhost:8080/v1/contacts
                { op: 'lte', by: 'birthday', value: '1997-04-06', expect: { first: 3, last: 75 } }, ✅ (only works AFTER implementing pagination)

                curl -X GET -H "X-Filter-By: birthday" -H "X-Filter-Operator: lt" -H "X-Filter-Value: 1997-04-06" http://localhost:8080/v1/contacts
                { op: 'lt', by: 'birthday', value: '1997-04-06', expect: { first: 3, last: 83 } } ✅ (only works AFTER implementing pagination)
             */
        }

        /* -------------------------------------------------------------------------- */
        /*                                   SORTING                                  */
        /* -------------------------------------------------------------------------- */
        // ‼️ DEFAULT FUNCTION: function sortContacts(data = [], by = 'id', direction = 'asc')
        /*
            ⚠️ TESTING MANUALLY VIA CURL IN TERMINAL:
            Sorting works with "lname" both ascending and decending (default and non default directions),
            const { data: lnameDesc } = await axios.get('http://localhost:8080/v1/contacts?sort=lname&direction=desc')
            expect(lnameDesc[0].id).toBe(35) ✅
            expect(lnameDesc[1].id).toBe(227) ✅
            const { data: lnameAsc } = await axios.get('http://localhost:8080/v1/contacts?sort=lname&direction=asc')
            expect(lnameAsc[0].id).toBe(219) ✅
            expect(lnameAsc[1].id).toBe(275) ✅
            const { data: fnameAsc } = await axios.get('http://localhost:8080/v1/contacts?sort=fname&direction=asc')
            expect(fnameAsc[0].id).toBe(51) ✅
            expect(fnameAsc[1].id).toBe(179) ✅
        */

        // 1️⃣ GRAB QUERY PARAMETERS
        const sortBy = req.query.sort;
        const direction = req.query.direction;

        // 2️⃣ UPDATE CONTACTS
        if (sortBy) {
            // default sorting without user query
            contacts = sortContacts(contacts, sortBy, "asc");
        }

        if (sortBy && direction) {
            // sorting with both 'by' and 'direction'
            contacts = sortContacts(contacts, sortBy, direction);
        }

        /* -------------------------------------------------------------------------- */
        /*                                 PAGINATION                                 */
        /* -------------------------------------------------------------------------- */
        // ‼️ default function Pager(data, page = 1, limit = 10)
        /*  EXAMPLE:
            const pager = new Pager( contacts, req.query.page, req.query.size )
            res.set("X-Page-Total", pager.total())
            res.set("X-Page-Next", pager.next())
            res.set("X-Page-Prev", pager.prev())
            res.json(pager.results())
        */
        // ‼️ DEFAULT Pagination should only return 10
        /*
            ⚠️ TESTING MANUALLY VIA CURL IN TERMINAL:
            const { data: dataOne } = await axios.get(`http://localhost:8080/v1/contacts?page=4&limit=5`)
            expect(dataOne.length).toBe(5)
            const { data: dataTwo } = await axios.get(`http://localhost:8080/v1/contacts?page=2&limit=7`)
            expect(dataTwo.length).toBe(7)
        */

        // 1️⃣ GRAB REQUEST QUERIES AND/OR ASSIGN DEFAULT VALUES
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        // 2️⃣ Now create a new pager, and since this takes in the contacts it'll
        // be the default return for ALL API Requests
        const pager = new Pager(contacts, page, limit);
        res.set("X-Page-Total", pager.total);
        res.set("X-Page-Next", pager.next());
        res.set("X-Page-Prev", pager.prev());

        return res.status(200).json(pager.results());
    } catch (err) {
        return next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                              POST: New Contact                              */
/* -------------------------------------------------------------------------- */
export const createContact = (req, res, next) => {
    try {
        // Check that a request body was sent
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message:
                    "Please send your request again with your contact's info.",
                success: false,
            });
        }

        const newContact = ContactModel.create(data);
        /*
        EXAMPLE
        ContactModel.create({
            fname: "Shae",
            lname: "Marquise",
            phone: "555-555-5555",
            birthday: "1968-01-24",
            email: "smarquise@gmail.com"
        })
        */
        return res.status(201).json(newContact);
    } catch (err) {
        return next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                              GET: Contact By Id                             */
/* -------------------------------------------------------------------------- */
export const getContactById = (req, res, next) => {
    // grab user's query
    const { id } = req.params;
    try {
        const foundContact = ContactModel.show(id);

        return res.status(200).json(foundContact);
    } catch (err) {
        return next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                            PUT: Update a Contact                           */
/* -------------------------------------------------------------------------- */
export const updateContact = (req, res, next) => {
    const { id } = req.params;
    try {
        // check for request body BEFORE attempting fetch
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message:
                    "Please send your request again with your contact's info.",
                success: false,
            });
        }

        // update contact example: ContactModel.update(11, { fname: 'Shae' })
        const updatedContact = ContactModel.update(id, data);

        return res.status(200).json(updatedContact);
    } catch (err) {
        return next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                          DELETE: Remove a Contact                          */
/* -------------------------------------------------------------------------- */
export const deleteContact = (req, res, next) => {
    const { id } = req.params;
    try {
        // delete contact
        ContactModel.remove(id);

        // send results as 200 because I want to send a messsage
        return res.status(200).json({
            message: "Contact has been successfuly deleted",
            success: true,
        });
    } catch (err) {
        return next(err);
    }
};
