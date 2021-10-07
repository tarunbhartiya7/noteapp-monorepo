const generateId = (list) => {
  const maxId = list.length > 0 ? Math.max(...list.map((n) => n.id)) : 0
  return maxId + 1
}

module.exports = {
  generateId,
}
