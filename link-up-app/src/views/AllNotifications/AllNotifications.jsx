import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../../state/app.context";
import { getInvitations } from "../../services/invitations.service";

export default function AllNotifications() {
    const { userData } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {


        const loadNotifications = async () => {
            try {
                if (!userData || !userData.email) {
                    return;
                }

                const allNotifications = await getInvitations(userData.email)
                setNotifications(allNotifications);
                
            } catch (error) {
                console.error("Failed to fetch Notifications", error);
            }
        }

loadNotifications()
    }, [userData])

    

    return (
        <div className="flex h-screen content">
        <div className="flex-1 flex flex-col p-8 bg-gray-900 text-white">
            <div className="w-full space-y-6">
                <h3 className="text-xl font-bold mb-4">All Notifications</h3>
                <ul className="space-y-4">
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
                                <button className="btn btn-success btn-sm">
                                    Accept
                                </button>
                                <button className="btn btn-error btn-sm">
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    );
}