export const isImgUrl = (imgUrl: string) => {
  return !imgUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/);
};
