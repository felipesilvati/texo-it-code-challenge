import { message } from 'antd';
export const constructQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  return '?' + Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

export const onError = (error) => {
  message.error('Failed to load data')
  if (process.env.NODE_ENV !== 'test') {
    console.error(error);
  }
};