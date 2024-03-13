import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import { constructQueryString } from '@/utils/helpers';
import { message } from 'antd';

export const fetchMovies = ({ queryKey }) => {
  const [_, page, size, filters] = queryKey;
  const queryString = constructQueryString({ page, size, ...filters });
  const url = `${BASE_API_URL}${queryString}`;
  return axios.get(url).then(res => res.data)
    .catch(() => {
      message.error('Failed to load movies');
    });
};