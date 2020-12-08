/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import betService from '../../services/betService';
import { selectUser, updateShreddits } from '../../store/slices/userSlice';
import styles from '../BetModal.module.css';

function BetForm({
  homeTeamID, awayTeamID, homeTeamName, awayTeamName, balance, gameID, prev,
  teamID, valid, type,
}) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userID = user._id;
  const [betAmount, setBetAmount] = useState(null);
  const validationSchema = Yup.object().shape({
    betAmount: Yup.number()
      .min(1, 'Bets must be at least 1 shredit')
      .max(balance, "Bets can't be placed larger than your current balance")
      .required('Bet is required'),
    team: Yup.string().notRequired('You must select a team to bet on'),
  });

  useEffect(() => {
    betService.getCurrBet(userID, gameID, type).then((response) => {
      if (response === []) {
        setBetAmount(response.amount);
      }
    });
  }, [userID, gameID]);

  return (

  // Sets initial values for form inputs
    <Formik
      initialValues={{
        betAmount: '', team: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        // Simulate submitting to database, shows us values submitted, resets form
        setTimeout(() => {
          if (prev) {
            values.team = teamID;
          }
          const setBet = async () => {
            const res = await betService.createBet(userID, gameID, values.team,
              values.betAmount, user.name, type);
            if (res === []) {
              alert('Could not place bet at this time. Try again later.');
            } else {
              if (betAmount) {
                dispatch(updateShreddits(values.betAmount - betAmount));
              } else {
                dispatch(updateShreddits(values.betAmount));
              }
              valid(true);
            }
          };
          setBet();
          resetForm();
          setSubmitting(false);
        }, 500);
      }}
    >
      {/* Callback function containing Formik state and helpers that handle common form actions */}
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <Form className={styles.bet_form}>
          <FormGroup row>
            <Label for="betAmount" sm={3}>Bet Amount:</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="betAmount"
                id="betAmount"
                value={values.betAmount}
                onChange={handleChange}
                placeholder="Enter Bet Amount"
              />
            </Col>
            {errors.betAmount && touched.betAmount && (
              <div className="error-message">{errors.betAmount}</div>
            )}
          </FormGroup>
          <FormGroup id="selectTeam" tag="fieldset" row>
            <Label sm={4}>Select a Team:</Label>
            <FormGroup check>
              <Col sm={2}>
                <Label check>
                  <Input
                    type="radio"
                    value={homeTeamID}
                    checked={values.team === `${homeTeamID}`}
                    disabled={prev}
                    onClick={() => setFieldValue('team', `${homeTeamID}`)}
                    name="team"
                  />
                  {homeTeamName}
                </Label>
              </Col>
              <Col sm={2}>
                <Label check>
                  <Input
                    type="radio"
                    value={awayTeamID}
                    checked={values.team === `${awayTeamID}`}
                    disabled={prev}
                    onClick={() => setFieldValue('team', `${awayTeamID}`)}
                    name="team"
                  />
                  {awayTeamName}
                </Label>
              </Col>
              {errors.team && touched.team(
                <div align="center" className="error-message">{errors.team}</div>,
              )}
            </FormGroup>

          </FormGroup>

          <Button
            color="primary"
            style={{ margin: '10px' }}
            onClick={handleSubmit}
          >
            Submit Bet

          </Button>
        </Form>
      )}
    </Formik>
  );
}
export default BetForm;
