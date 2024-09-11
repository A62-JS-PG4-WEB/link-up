import { equalTo, get, orderByChild, push, query, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

const invitationsRef = ref(db, 'invitations');

/**
 * Creates a Firebase query to find invitations by email.
 * 
 * @param {string} email - The email address to search invitations for.
 * @returns {Object} A Firebase query object to retrieve invitations filtered by email.
 */
export const invitationsQuery = (email) => {
    return query(ref(db, 'invitations'), orderByChild('email'), equalTo(email));
};

/**
 * Creates a new invitation and stores it in Firebase.
 * 
 * @async
 * @param {Object} invitation - The invitation object containing details such as email, teamID, etc.
 * @returns {Promise<string>} A promise that resolves to the invitation ID.
 * @throws Will throw an error if the invitation cannot be created.
 */
export const createInvitation = async (invitation) => {
    const result = push(invitationsRef, invitation);
    const id = result.key;
    await update(ref(db), {
        [`invitations/${id}/id`]: id,
    });
    return id;
};

/**
 * Retrieves all invitations for a specific email address.
 * 
 * @async
 * @param {string} email - The email address to retrieve invitations for.
 * @returns {Promise<Object[]>} A promise that resolves to an array of invitation objects.
 * @throws Will throw an error if the invitations cannot be retrieved.
 */
export const getInvitations = async (email) => {
    const snapshot = await get(invitationsQuery(email))
    const data = snapshot.val();
    return data ? Object.values(data) : [];
};

/**
 * Accepts an invitation by updating its status to 'accepted' in Firebase.
 * 
 * @async
 * @param {string} id - The ID of the invitation to accept.
 * @param {string} receiverUsername - The username of the user accepting the invitation.
 * @returns {Promise<string>} A promise that resolves to the team ID associated with the invitation.
 * @throws Will throw an error if the invitation cannot be accepted.
 */
export const acceptInvitation = async (id, receiverUsername) => {
    await update(ref(db), {
        [`invitations/${id}/status`]: 'accepted',
        [`invitations/${id}/receiverUsername`]: receiverUsername,
        [`invitations/${id}/updatedOn`]: new Date().toDateString(),
    });
    const snapshot = await get(ref(db, `invitations/${id}`))
    return snapshot.val().teamID;
};

/**
 * Rejects an invitation by updating its status to 'rejected' in Firebase.
 * 
 * @async
 * @param {string} id - The ID of the invitation to reject.
 * @param {string} receiverUsername - The username of the user rejecting the invitation.
 * @returns {Promise<void>} A promise that resolves once the invitation is rejected.
 * @throws Will throw an error if the invitation cannot be rejected.
 */
export const rejectInvitation = async (id, receiverUsername) => {
    await update(ref(db), {
        [`invitations/${id}/status`]: 'rejected',
        [`invitations/${id}/receiverUsername`]: receiverUsername,
        [`invitations/${id}/updatedOn`]: new Date().toDateString(),
    });
};