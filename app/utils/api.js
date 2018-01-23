const axios = require('axios');

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const params = "?client_id=" + id + "&client_secret=" + sec;

getProfile (username) => {
  axios.get('https://api.github.com/users/' + username + params)
    .then((user) => {
      user.data;
    });
}

getRepos (username) => {
  axios.get('https://api.github.com/users/' + username + '/repos' + params + '&per_page=100');
}

getStarCount (repos) => {
  repos.data.reduce((count, repo) => {
    count + repo.stargazers_count
  }, 0);
}

calculateScore (profile, repos) => {
  followers = profile.followers;
  totalStars = getStarCount(repos);

  (followers * 3) + totalStars;
}

handleError (error) => {
  console.warn(error);
  null;
}

getUserData (player) => {
  axios.all([
    getProfile(player),
    getRepos(player)
  ]).then((data) => {
    profile = data[0];
    repos = data[1];

    {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  });
}

sortPlayers (players) => {
  players.sort((a, b) =>{
    b.score - a.score;
  });
}

module.exports = {
  battle: (players) => {
    axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },
  fetchPopularRepos: (language) => {
    encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+ language + '&sort=stars&order=desc&type=Repositories');

    axios.get(encodedURI)
      .then((response) => {
        response.data.items;
      });
  }
};
