function clearFileName(params = "") {
  return params.split("/").pop();
}

export type LoadImgRes = { name: string; uri: HTMLImageElement };
export const loadImg = (imgList: string[]): Promise<LoadImgRes[]> => {
  const loadTask: Promise<LoadImgRes>[] = [];

  for (const url of imgList) {
    loadTask.push(
      new Promise((res) => {
        const img = new Image();
        img.src = url;
        img.onload = function () {
          res({
            name: clearFileName(url)!,
            uri: img,
          });
        };
      })
    );
  }

  return Promise.all(loadTask);
};
