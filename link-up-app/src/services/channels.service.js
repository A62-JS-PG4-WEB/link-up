import { equalTo, get, orderByChild, orderByValue, push, query, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const createChannel = async (name, owner, member) => {

    const channel = { name, owner, createdOn: new Date().toString() };
    const result = await push(ref(db, 'channels'), channel);
    const id = result.key;
   
    await update(ref(db), {
        [`channels/${id}/members/${member}`]: new Date().getTime(),
        [`channels/${id}/id`]: id,
    });
    return id;
};
