import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../state/app.context';
import { Navigate, useLocation } from 'react-router-dom';
import '../index.css'

/**
 * Authenticated component checks if the user is authenticated. 
 * If the user is not authenticated, it redirects to the login page.
 * If the authentication status is loading, it displays a loading indicator.
 * Otherwise, it renders the child components.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to render when authenticated.
 * @returns {React.ReactNode} The rendered component.
 */
export default function Authenticated({ children }) {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (user === null) {
    return <div className="loading-container">
      <span className="loading loading-dots loading-lg"></span>
    </div>
      ;
  }
  if (!user) {
    return <Navigate replace to="/login" state={{ from: location }} />
  }

  return (
    <>
      {children}
    </>
  )
}

Authenticated.propTypes = {
  /**
  * The child components that will be rendered when the user is authenticated.
  */
  children: PropTypes.any,
};
