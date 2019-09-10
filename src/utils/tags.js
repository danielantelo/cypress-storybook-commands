exports.hasSkipTag = function(str) {
  return str.includes('#vrs')
}

exports.hasWaitTag = function(str) {
  if(!str.includes('#vrw')) {
    return false;
  } else {
    return 2000; //@TODO extract time from tag #vrw5 = 5000
  }
}
