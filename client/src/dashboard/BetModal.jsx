/* eslint-disable eqeqeq */
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
import betService from '../services/betService';

function BetModal(props) {
  const user = useSelector(selectUser);
  const [modal, setModal] = useState(false);
  const [valid, setValid] = useState(false);
  const [previousBet, setPrev] = useState(false);
  const [teamID, setTeamID] = useState(null);
  const userID = user._id;

  const {
    gameID, team1, team2, type, finishedBettingHandler,
  } = props;
  const team1Name = team1.name;
  const team1ID = team1.id;
  const team2Name = team2.name;
  const team2ID = team2.id;

  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (valid) {
      const setBet = async () => {
        setValid(false);
        finishedBettingHandler();
        setModal(!modal);
      };

      setBet();
    }
  }, [valid]);

  useEffect(() => {
    betService.getCurrBet(userID, gameID, 'bot').then((response) => {
      if (response) {
        setPrev(true);
        setTeamID(response.team_id);
      } else {
        setPrev(false);
      }
    });
  }, [userID, gameID]);
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
            prev={previousBet}
            balance={user.shreddit_balance}
            teamID={teamID}
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
