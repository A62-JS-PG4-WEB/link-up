import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../../state/app.context";
import { acceptInvitation, getInvitations, rejectInvitation } from "../../services/invitations.service";
import { addUserTeam } from '../../services/users.service';
import { addTeamMember } from '../../services/teams.service';
import SideNav from '../../components/SideNav/SideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AllNotifications() {
    const { userData } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [acceptedInvitations, setAcceptedInvitations] = useState([]);
    const [rejectedInvitations, setRejectedInvitations] = useState([]);

    useEffect(() => {


        const loadNotifications = async () => {
            try {
                if (!userData || !userData.email) {
                    return;
                }

                const allNotifications = await getInvitations(userData.email);
                const pendingNotifications = allNotifications.filter(n => n.status === 'pending');
                const accepted = allNotifications.filter(n => n.status === 'accepted');
                const rejected = allNotifications.filter(n => n.status === 'rejected');

                setNotifications(pendingNotifications);
                setAcceptedInvitations(accepted);
                setRejectedInvitations(rejected);

            } catch (error) {
                toast.error(`Failed to fetch Notifications: ${error}`);
            }
        }

        loadNotifications()
    }, [userData, setNotifications])

    const handleAccept = async (id) => {
        try {
            const teamId = await acceptInvitation(id, userData.username);

            await addUserTeam(teamId, userData.username);
            await addTeamMember(teamId, userData.username);
            setNotifications(prevNotifications =>
                prevNotifications.filter(n => n.id !== id)
            );

            setAcceptedInvitations(prevAccepted => [
                ...prevAccepted,
                { id, status: 'accepted' }
            ]);

            toast.success('Invitation accepted');
        } catch (error) {
            toast.error(`Failed to accept invitation ${error}`);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectInvitation(id, userData.username);
            setNotifications(prevNotifications =>
                prevNotifications.filter(n => n.id !== id)
            );

            setRejectedInvitations(prevRejected => [
                ...prevRejected,
                { id, status: 'rejected' }
            ]);

            toast.warn('Invitation rejected');
        } catch (error) {
            toast.error(`Failed to reject invitation: ${error}`);
        }
    };

    return (
        <div className='home'>
            <SideNav />
            <div className="flex h-screen content">
                <div className="flex-1 flex flex-col p-8 bg-gray-900 text-white space-y-6">
                    {/* Pending Invitations */}
                    <div className="w-full">
                        <h3 className="text-xl font-bold mb-4">Pending Invitations</h3>
                        {notifications.length > 0 ? (<ul className="space-y-4">
                            {notifications?.map((n) => (
                                <li
                                    key={n.id}
                                    className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-lg font-semibold">
                                            {n.message}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            from {n.senderUsername} on{" "}
                                            {new Date(n.createdOn).toDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="btn btn-success btn-sm"
                                            onClick={() => handleAccept(n.id)}>
                                            Accept
                                        </button>
                                        <button className="btn btn-error btn-sm"
                                            onClick={() => handleReject(n.id)}>
                                            Reject
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        ) : (
                            <p>No pending invitations</p>
                        )}
                    </div>

                    {/* Accepted and Rejected Invitations */}
                    <div className="flex space-x-8">
                        {/* Accepted Invitations */}
                        <div className="w-1/2">
                            <h3 className="text-xl font-bold mb-4">Accepted Invitations</h3>
                            <ul className="space-y-4">
                                {acceptedInvitations?.map((n) => (
                                    <li
                                        key={n.id}
                                        className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-lg font-semibold">
                                                Invitation for {n.type} {n.teamName}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                from {n.senderUsername} on{" "}
                                                {n.updatedOn}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Rejected Invitations */}
                        <div className="w-1/2">
                            <h3 className="text-xl font-bold mb-4">Rejected Invitations</h3>
                            <ul className="space-y-4">
                                {rejectedInvitations?.map((n) => (
                                    <li
                                        key={n.id}
                                        className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-lg font-semibold">
                                                Invitation for {n.type} {n.teamName}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                from {n.senderUsername} on{" "}
                                                {n.updatedOn}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}