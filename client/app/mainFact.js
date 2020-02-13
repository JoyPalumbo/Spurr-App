angular.module('Spurr-Fact', []).factory('SpurrFact', function() {
  /**
   * Console log truthy input, or error message followed by input
   * @param {Any} input
   */
  const tester = input => {
    if (input) {
      console.warn(input);
    } else {
      console.warn('Error, input is', input);
    }
  };

  /**
   * Returns res with escaped quotation marks
   * @param {String} str
   * @return {String} res
   */
  const escapeText = str => {
    let res;
    res = str.replace(/"/g, '\\"');
    res = str.replace(/'/g, "\\'");
    return res;
  };

  return {
    test: tester,
    esc: escapeText,
  };
});
