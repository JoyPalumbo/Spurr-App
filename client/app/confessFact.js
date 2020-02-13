angular.module('Confess-Fact', [])
.factory('confessFact', function ($http, $window) {
  const images = {
    none: '../assets/no-back.png',
    paper: '../assets/paper-back.png',
    letter: '../assets/letter-back.png',
    dot: '../assets/dot-back.png',
    wild: '../assets/crazy-back.png',
    dark: '../assets/cross-back.png',
    love: '../assets/heart-back.png',
  };

  /**
   * Sends secret to the spurrs database
   * Redirects to receive view
   * @param {Object} secret
   * @returns {Secret} Promise from post request
   */
  const postSpurr = secret =>
    $http({
      method: 'POST',
      url: '/api/spurrs',
      data: secret,
    }).then(() => {
      $window.location.href = '#!/receive';
    });

    //queries for message backgrounds
  const queryImage = query =>
    $http({
      method: 'GET',
      url: '/api/imagequery',
      params: {
        data: query,
      },
    }).then(imagesUrls => imagesUrls);

    //send secret SMS function
    const texter = (num, secret) => {
    $http({
      method: 'POST',
      url: '/api/text',
      data: {
        "to": num,
        "body": secret.message
      }
    }).then(() => {
      console.log(secret.message)
      $window.location.href = '#!/receive';
    })
  }

  return {
    images,
    post: postSpurr,
    query: queryImage,
    texter: texter
  };
});
