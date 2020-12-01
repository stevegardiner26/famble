/* eslint-disable camelcase */
import axios from 'axios';
// eslint-disable-next-line
export default {
  getAll: async () => {
    const res = await axios.get('/api/get_bets');
    return res.data || [];
  },

  getBetsByGameId: async (game_id) => {
    const res = await axios.get(`/api/bets/${game_id}`);
    return res.data.bets || [];
  },

  getBetsByUserId: async (user_id) => {
    const res = await axios.get(`/api/bets/users/${user_id}`);
    return res.data || [];
  },

  createBet: async (user_id, game_id, team_id, amount, name, type) => {
    const res = await axios.post('/api/bets', {
      user_id,
      game_id,
      team_id,
      amount,
      name,
      type,
    });
    return res.data || [];
  },
};
