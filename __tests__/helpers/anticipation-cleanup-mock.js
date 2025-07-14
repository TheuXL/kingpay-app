const cleanupTestAnticipations = (anticipationIds) => {
  if (!Array.isArray(anticipationIds) || anticipationIds.length === 0) {
    return;
  }
  // No-op in mock environment, just log for debugging
  console.log(`[MOCK] Limpando antecipações de teste: ${anticipationIds.join(', ')}`);
};

module.exports = {
  cleanupTestAnticipations,
}; 