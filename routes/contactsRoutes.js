import { Router } from "express";
import {
    createContact,
    deleteContact,
    getContactById,
    getContacts,
    updateContact,
} from "../controllers/contactsControllers.js";
const router = Router();

/* -------------------------------------------------------------------------- */
/*           GET /api/v1/ → list contacts & supports filtering/params          */
/* -------------------------------------------------------------------------- */
router.get("/", getContacts);

/* -------------------------------------------------------------------------- */
/*                   POST api/v1/contacts → create a contact                  */
/* -------------------------------------------------------------------------- */
router.post("/", createContact);

/* -------------------------------------------------------------------------- */
/*       GET /contacts/:id → get one contact & supports filtering/params      */
/* -------------------------------------------------------------------------- */
router.get("/:id", getContactById);

/* -------------------------------------------------------------------------- */
/*                    PUT /contacts/:id → update a contact                    */
/* -------------------------------------------------------------------------- */
router.put("/:id", updateContact);

/* -------------------------------------------------------------------------- */
/*                   DELETE /contacts/:id → delete a contact                  */
/* -------------------------------------------------------------------------- */
router.delete("/:id", deleteContact);

export default router;
