const parseTimestamp = (timestamp) => {
  // Create a new Date object from the timestamp string
  return new Date(timestamp);
};

export const sortDocumentsByTimestampDesc = (documents) => {
  return documents.sort((a, b) => {
    const dateA = parseTimestamp(a.createdAt);
    const dateB = parseTimestamp(b.createdAt);
    return dateB - dateA; // Sort in descending order
  });
};
