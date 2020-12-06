/* eslint-disable camelcase */
import axios from 'axios';
// eslint-disable-next-line
export default {
  getTweet: async (search_term) => {
    const res = await axios.get(`/api/twitter/${search_term}`);
    return res.data || [];
  },

};
