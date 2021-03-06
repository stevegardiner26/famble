import axios from 'axios';
// eslint-disable-next-line
export default {
  getAllGames: async () => {
    const res = await axios.get('/api/games');
    return res.data || [];
  },
  getWeeklyGames: async () => {
    const res = await axios.get('/api/current_week');
    return res.data || [];
  },
  getTeam: async (id) => {
    const res = await axios.get(`/api/teams/${id}`);
    return res.data[0].name || [];
  },
  getLogo: async (id) => {
    const res = await axios.get(`/api/teams/${id}`);
    return res.data[0].image_url || [];
  },
  updateScores: async () => {
    const res = await axios.get('/api/fetch_weekly_scores');
    return res.data || [];
  },
  getGameById: async (id) => {
    const res = await axios.get(`/api/games/${id}`);
    return res.data || [];
  },
  getGameOdds: async (id) => {
    const res = await axios.get(`/api/games/odds/${id}`);
    return res.data || {};
  },
};
