import { equalTo, get, orderByChild, push, query, ref } from "firebase/database";
import { db } from "../config/firebase-config";

const invitationsRef = ref(db, 'invitations');

export const invitationsQuery = (email) => {
    return query(ref(db, 'invitations'), orderByChild('email'), equalTo(email));
  
};

export const createInvitation = async (invitation) => {
    await push(invitationsRef, invitation);
};

export const getInvitations = async (email) => {

    return await get(invitationsQuery(email)).val();
};
