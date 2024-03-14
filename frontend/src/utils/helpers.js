import { message } from 'antd';
export const constructQueryString = (params) => {
  return '?' + Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

export const onError = (error) => {
  message.error('Failed to load data')
  console.error(error);
};