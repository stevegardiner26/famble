/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import styles from './BetModal.module.css';
import { selectUser } from '../store/slices/userSlice';
import BetForm from './form/BetForm';

function BetModal(props) {
  const user = useSelector(selectUser);
  const [modal, setModal] = useState(false);
  const [valid, setValid] = useState();

  const {
    gameID, team1, team2, type, betAmount,
  } = props;
  const team1Name = team1.name;
  const team1ID = team1.id;
  const team2Name = team2.name;
  const team2ID = team2.id;

  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (valid) {
      const setBet = async () => {
        alert('Bet placed successfully!');
        setValid(false);
        setModal(!modal);
      };

      setBet();
    }
  }, [valid]);

  // ModalBody is for the stats
  return (
    <div>
      <Button className={styles.modal_button} onClick={toggle}>Place Bet</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${team1Name} vs ${team2Name}`}</ModalHeader>
        <ModalBody />
        <ModalFooter className={styles.modal_footer}>
          <BetForm
            homeTeamID={team1ID}
            awayTeamID={team2ID}
            homeTeamName={team1Name}
            awayTeamName={team2Name}
            gameID={gameID}
            balance={user.shreddit_balance}
            betAmount={betAmount}
            type={type}
            valid={setValid}

          />
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default BetModal;
