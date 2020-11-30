import axios from 'axios';

export default {
  getTeamStats: async (teamID) => {
    const res = await axios.get(`/api/stats/teams/${teamID}`);
    return res.data || [];
  },
};
