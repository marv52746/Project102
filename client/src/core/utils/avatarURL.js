export const getAvatarUrl = (fileId) => {
  if (!fileId)
    return `${process.env.PUBLIC_URL}/assets/images/default-male.jpg`;
  return `${
    process.env.REACT_APP_BASE_URL
  }/file/${fileId}?t=${new Date().getTime()}`;
};
