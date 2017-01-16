// function to parse fragment and return access token
const getParams = (redir) => {
  if (redir === null || !redir) {
    return;
  }
  var queries = redir.split("&");
  var params = {}
  for (var i = 0; i < queries.length; i++) {
    const pair = queries[i].split('=');
    params[pair[0]] = pair[1];
  }
  return params;
};

export default {
  getParams
};
