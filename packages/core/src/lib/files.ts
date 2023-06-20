export const imgExtension = ['.jpg', '.jpeg', '.gif', '.png'];

export const readFile = async (file: File) =>
  new Promise<{ file: File; dataURL: string }>(resolve => {
    const reader = new FileReader();

    // Read the image via FileReader API and save image result in state.
    reader.onload = e => {
      // Add the file name to the data URL
      let dataURL = e.target!.result!;
      dataURL = dataURL
        .toString()
        .replace(';base64', `;name=${file.name};base64`);
      resolve({ file, dataURL });
    };

    reader.readAsDataURL(file);
  });

export const hasValidExtension = (fileName: string, extensions: string[]) => {
  const pattern = `(${extensions.join('|').replace(/\./g, '\\.')})$`;
  return new RegExp(pattern, 'i').test(fileName);
};

export const extractFileType = (url: string) =>
  new URL(url).pathname.split('.').pop();

export const fetchFile = async (url: string, fileName: string) => {
  const fileType = extractFileType(url);
  const data = await fetch(url);
  const blob = await data.blob();
  const type = [
    imgExtension.includes(`.${fileType}`) ? 'image' : 'text',
    fileType,
  ].join('/');
  return new File([blob], `${fileName}.${fileType}`, { type });
};
