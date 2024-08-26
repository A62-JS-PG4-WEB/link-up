import { equalTo, get, orderByChild, push, query, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

const invitationsRef = ref(db, 'invitations');

export const invitationsQuery = (email) => {
    return query(ref(db, 'invitations'), orderByChild('email'), equalTo(email));

};

export const createInvitation = async (invitation) => {
    const result = push(invitationsRef, invitation);
    const id = result.key;
    await update(ref(db), {
        [`invitations/${id}/id`]: id,
    });

    return id;
};

export const getInvitations = async (email) => {
    const snapshot = await get(invitationsQuery(email))
    const data = snapshot.val();

    return data ? Object.values(data) : [];
};
