import { equalTo, get, orderByChild, orderByValue, push, query, ref, remove, update } from "firebase/database";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Retrieves the names of members in a specific team.
 * 
 * @async
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<Object>} A promise that resolves to an object of team members.
 * @throws Will throw an error if team members cannot be fetched.
 */
export const getTeamMembersNames = async (teamId) => {
    const snapshot = await get(ref(db, `teams/${teamId}/members`));
    return snapshot.val();
};

/**
 * Creates a new team and adds the specified member to it.
 * 
 * @async
 * @param {Object} team - The team object containing the details of the team.
 * @param {string} member - The username of the member to add to the team.
 * @returns {Promise<string>} A promise that resolves to the ID of the newly created team.
 * @throws Will throw an error if the team cannot be created.
 */
export const createTeam = async (team, member) => {
    const result = await push(ref(db, 'teams'), team);
    const id = result.key;

    await update(ref(db), {
        [`teams/${id}/members/${member}`]: new Date().getTime(),
        [`teams/${id}/id`]: id,
    });

    return id;
};

/**
 * Retrieves a team by its name.
 * 
 * @async
 * @param {string} name - The name of the team to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the team object.
 * @throws Will throw an error if the team cannot be fetched.
 */
export const getTeams = async (name) => {

    const snapshot = await get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));

    return snapshot.val();
};

/**
 * Retrieves the list of teams a user is part of.
 * 
 * @async
 * @param {string} username - The username of the user whose teams you want to retrieve.
 * @returns {Promise<string[]>} A promise that resolves to an array of team IDs.
 * @throws Will throw an error if user teams cannot be fetched.
 */
export const getUserTeams = async (username) => {
    const snapshot = await get(ref(db, `users/${username}/teams`));

    return Object.keys(snapshot.val());
};

/**
 * Retrieves detailed information for an array of team IDs.
 * 
 * @async
 * @param {string[]} teams - An array of team IDs.
 * @returns {Promise<Object[]>} A promise that resolves to an array of team objects.
 * @throws Will throw an error if the team information cannot be fetched.
 */
export const getTeamsInfoById = async (teams) => {
    try {
        const promises = teams.map(async (id) => {
            const snapshot = await get(ref(db, `teams/${id}`));
            return snapshot.val();
        });
        const filteredTeams = await Promise.all(promises);

        return filteredTeams;
    } catch (error) {
        toast.error(`Error fetching team information: ${error}`);
        throw error;
    }
};

/**
 * Retrieves detailed information for a specific team by its ID.
 * 
 * @async
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<Object>} A promise that resolves to a team object.
 * @throws Will throw an error if the team information cannot be fetched.
 */
export const getTeamInfoById = async (teamId) => {
    const snapshot = await get(ref(db, `teams/${teamId}`));
    return snapshot.val();
}

/**
 * Adds a channel to a specific team.
 * 
 * @async
 * @param {string} teamID - The ID of the team.
 * @param {string} channelID - The ID of the channel to add to the team.
 * @returns {Promise<void>} A promise that resolves once the channel is added.
 * @throws Will throw an error if the channel cannot be added to the team.
 */
export const addChannelToTeam = async (teamID, channelID) => {
    try {
        await update(ref(db, `teams/${teamID}/channels`), {
            [channelID]: new Date().getTime()
        });

    } catch (error) {
        toast.error(`Error adding channel to team: ${error}`);
    }
};

/**
 * Adds a member to a specific team.
 * 
 * @async
 * @param {string} teamId - The ID of the team.
 * @param {string} member - The username of the member to add.
 * @returns {Promise<void>} A promise that resolves once the member is added.
 * @throws Will throw an error if the member cannot be added to the team.
 */
export const addTeamMember = async (teamId, member) => {
    await update(ref(db), {
        [`teams/${teamId}/members/${member}`]: new Date().getTime(),
    });
};

/**
 * Retrieves all channels associated with a specific team.
 * 
 * @async
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<string[]>} A promise that resolves to an array of channel IDs.
 * @throws Will throw an error if the channels cannot be fetched.
 */
export const getTeamChannels = async (teamId) => {

    const snapshot = await get(ref(db, `teams/${teamId}/channels`));
    return Object.keys(snapshot.val());
};

/**
 * Removes a user from a specific team.
 * 
 * @async
 * @param {string} username - The username of the user to remove.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<void>} A promise that resolves once the user is removed from the team.
 * @throws Will throw an error if the user cannot be removed from the team.
 */
export const removeUserFromTeam = async (username, teamId) => {
    await remove(ref(db, `teams/${teamId}/members/${username}`));
};