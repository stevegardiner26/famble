import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';

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
      <Button color="secondary" onClick={handleLogout}>Logout</Button>
    </>
  );
}
export default Logout;
