import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../state/app.context';
import { Navigate, useLocation } from 'react-router-dom';

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
  children: PropTypes.any,
};
