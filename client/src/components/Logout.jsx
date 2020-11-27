import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';
import styles from './Components.module.css';

function Logout() {
  // const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setRedirect(true);
  };

  if (redirect) {
    return (<Redirect to="/" />);
  }

  return (
    <>
      <Button color="secondary" className={styles.LogoutButton} onClick={handleLogout}>Logout</Button>
    </>
  );
}
export default Logout;
