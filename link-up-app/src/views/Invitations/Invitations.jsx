import React, { useContext, useEffect, useState } from 'react';
import { onValue } from 'firebase/database';
import { AppContext } from '../../state/app.context';
import { invitationsQuery } from '../../services/invitations.service';
import { useNavigate } from 'react-router-dom';

export default function Invitations() {
    // const [invitations, setInvitations] = useState([]);
    const { userData, setInvitations, invitations } = useContext(AppContext);
    const navigate = useNavigate();
    const [notifiedInvitations, setNotifiedInvitations] = useState(new Set());

    useEffect(() => {
        if (!userData || !userData.email) {
            return;
        }
        const unsubscribe = onValue(invitationsQuery(userData.email), (snapshot) => {
            const data = snapshot.val();
            const invitesList = data ? Object.values(data) : [];
            const filteredInvites = invitesList.filter(invite => invite.status === 'pending');
            setInvitations(filteredInvites);

            const newInvites = filteredInvites.filter(invite => !notifiedInvitations.has(invite.id));

            newInvites.forEach(invite => {
                notifyUser(invite);
                notifiedInvitations.add(invite.id);
            });

            setNotifiedInvitations(new Set(notifiedInvitations));

        }, {
            onlyOnce: false,
        });


        return () => unsubscribe();
    }, [userData, setInvitations, setNotifiedInvitations]);

    const handleNotifications = () => {
        navigate('/notifications');
    }

    const notifyUser = (invite) => {

        alert(`You have a new invite from ${invite.senderUsername}.`);
    };

    return (
        <>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                className={`bi bi-bell  ${invitations.length > 0 ? 'text-red-500' : 'text-white'}`} viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 1.985-1.75h-3.97A2 2 0 0 0 8 16zm.104-14.247a.5.5 0 0 1 .633.057A5.022 5.022 0 0 1 13 6c0 .628.134 1.197.359 1.75.228.561.539 1.098.875 1.591.18.27.366.545.535.841.172.301.327.623.45.987.124.366.18.768.18 1.248H0c0-.48.056-.882.18-1.248.123-.364.278-.686.45-.987.169-.296.355-.571.535-.84.336-.494.647-1.03.875-1.592A5.978 5.978 0 0 0 3 6c0-1.512.572-2.904 1.614-3.966a.5.5 0 0 1 .633-.057c.682.483 1.55.773 2.527.773s1.845-.29 2.527-.773z" />
            </svg> */}
            <div className="ml-4">
                <button
                    onClick={handleNotifications}>
                    <h2> Notifications </h2>
                </button>
            </div>

        </>

    );
};
