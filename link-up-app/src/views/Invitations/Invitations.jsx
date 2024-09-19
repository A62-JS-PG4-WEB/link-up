import { useContext, useEffect } from 'react';
import { onValue } from 'firebase/database';
import { AppContext } from '../../state/app.context';
import { invitationsQuery } from '../../services/invitations.service';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

/**
 * Component to display and handle user invitations.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Invitations() {
    // const [invitations, setInvitations] = useState([]);
    const { userData, setInvitations } = useContext(AppContext);
    const navigate = useNavigate();

    /**
     * Navigates to the notifications page.
     */
    useEffect(() => {
        if (!userData || !userData.email) {
            return;
        }
        const unsubscribe = onValue(invitationsQuery(userData.email), (snapshot) => {
            const data = snapshot.val();
            const invitesList = data ? Object.values(data) : [];
            const filteredInvites = invitesList.filter(invite => invite.status === 'pending');
            setInvitations(filteredInvites);
        }, {
            onlyOnce: false,
        });


        return () => unsubscribe();
    }, [userData, setInvitations]);

    const handleNotifications = () => {
        navigate('/notifications');
    }

    return (
        <>
            <div className="ml-4">
                <button
                    onClick={handleNotifications}>
                    <h2> Notifications </h2>
                </button>
            </div>

        </>

    );
};
Invitations.propTypes = {
    userData: PropTypes.shape({
        email: PropTypes.string,
    }),
    setInvitations: PropTypes.func.isRequired,
};