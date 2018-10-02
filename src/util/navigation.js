export const getUrl = (app, query, details) => {
  return `${query}^${app}${details ? '/' + details : ''}`;
};
