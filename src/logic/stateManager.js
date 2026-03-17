const sessions = {};
function getUserState(userId) {
      if (!sessions[userId]) sessions[userId] = { step: 'START', data: {} };
      return sessions[userId];
}
function updateUserState(userId, step, updatedData = {}) {
      if (!sessions[userId]) getUserState(userId);
      sessions[userId].step = step;
      sessions[userId].data = { ...sessions[userId].data, ...updatedData };
}
function clearUserState(userId) { delete sessions[userId]; }
module.exports = { getUserState, updateUserState, clearUserState };
