import { equalTo, get, orderByValue, push, query, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const createTeam = async (name) => {
    const team = { name };
    const result = await push(ref(db, 'teams'), team);
    const id = result.key;
    console.log('created team', id);

    // await update(ref(db), {
    //   [`teams/${id}/id`]: id,
    // });
    return id;
};

export const teamUserOwner = async (teamId, username, ownership) => {
    const teamUserOwnership = { teamId, username, ownership };
    await push(ref(db, 'teams_users_ownerships'), teamUserOwnership)
};

export const createOwnerships = async (owner) => {
   const result = await getOwnership(owner);
   console.log(result);
   
   if (!result){
    const id = await push(ref(db, 'ownerships'), owner);
    console.log(id.key);
    
    return id.key;
   }
   
   return  Object.keys(result)[0];
};

export const getOwnership = async (ownership) => {
    const snapshot = await get(query(ref(db, 'ownerships'), orderByValue(),equalTo(ownership)));
    console.log(snapshot.val());
    
    return snapshot.val();
  };
