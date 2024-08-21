import { equalTo, get, orderByChild, orderByValue, push, query, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const createTeam = async (name, owner, member) => {

    const team = { name, owner, createdOn: new Date().toString() };
    const result = await push(ref(db, 'teams'), team);
    const id = result.key;

    await update(ref(db), {
        [`teams/${id}/members/${member}`]: new Date().getTime(),
    });
    return id;
};

export const getTeams = async (name) => {

    const snapshot = await get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
    return snapshot.val();
};

export const getUserTeams = async (username) => {
    const snapshot = await get(ref(db, `users/${username}/teams`));
    console.log(snapshot.val());

    return snapshot.val();
}