/* eslint-disable no-undef */
import axios from 'axios';
// eslint-disable-next-line
export default {
  getTeamById: async (id) => {
    const res = await axios.get(`/api/teams/${id}`);
    return res.data || [];
  },
};
