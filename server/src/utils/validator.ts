export const isImgUrl = (imgUrl: string): boolean => {
  return /^https:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/.test(imgUrl);
};
