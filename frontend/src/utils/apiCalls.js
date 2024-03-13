import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import { constructQueryString } from '@/utils/helpers';

export const fetchMovies = ({ queryKey }) => {
  const [_, page, size, filters] = queryKey;
  const queryString = constructQueryString({ page, size, ...filters });
  const url = `${BASE_API_URL}${queryString}`;
  return axios.get(url).then(res => res.data);
};

export const fetchYearsWithMultipleWinners = () => {
  return axios
    .get(`${BASE_API_URL}/?projection=years-with-multiple-winners`)
    .then((res) => res.data?.years)
};

export const fetchTopThreeStudiosWithWinners = () => {
  return axios
    .get(`${BASE_API_URL}/?projection=studios-with-win-count`)
    .then(res => res.data?.studios?.slice(0, 3))
};