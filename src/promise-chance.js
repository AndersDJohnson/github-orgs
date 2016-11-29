export default (chance = 0.5, reason = null) => {
  return function (data) {
    if (Math.random() < chance) {
      return data
    }
    return Promise.reject(reason)
  }
}
