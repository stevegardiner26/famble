/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Link,
} from 'react-router-dom';
import betService from '../../services/betService';
import { selectUser, updateShreddits } from '../../store/slices/userSlice';
import styles from '../BetModal.module.css';

function BetForm({
  homeTeamID, awayTeamID, homeTeamName, awayTeamName, balance, gameID, prev, teamID, valid,
}) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userID = user._id;
  const validationSchema = Yup.object().shape({
    betAmount: Yup.number()
      .min(1, 'Bets must be at least 1 shreddit')
      .max(balance, "Bets can't be placed larger than you're current balance")
      .required('Bet is required'),
  });
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
              values.betAmount, user.name, 'default');
            if (res === []) {
              alert('Could not place bet at this time. Try again later.');
            } else {
              dispatch(updateShreddits(values.betAmount));
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
            {touched.betAmount && errors.betAmount ? (
              <div className="error-message">{errors.betAmount}</div>
            ) : null}
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
            </FormGroup>
          </FormGroup>

          <Button
            color="primary"
            style={{ margin: '10px' }}
            onClick={handleSubmit}
          >
            Submit Bet

          </Button>
          <Link to="/dashboard">
            <Button color="secondary">Cancel</Button>
          </Link>
        </Form>
      )}
    </Formik>
  );
}
export default BetForm;
