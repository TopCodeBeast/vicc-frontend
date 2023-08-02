import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';

import { sameArrays } from '@core/lib/arrays';
import { hasValidExtension, imgExtension, readFile } from '@core/lib/files';

export type FileWithDataURL = {
  file: File;
  dataURL: string;
};

export const useUploadFile = (
  onChange: (file: FileWithDataURL) => void,
  validExtensions: string[] = imgExtension,
  maxFileSizeMb = 1 // 1 Megabyte
) => {
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { formatMessage } = useIntl();
  const maxFileSizeinBytes = maxFileSizeMb * 10 ** 6;

  const onDropFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files![0];
    const hasFileTypeError = !hasValidExtension(file.name, validExtensions);
    const hasFileSizeError = file.size > maxFileSizeinBytes;

    setFileSizeError(
      hasFileSizeError
        ? formatMessage(
            {
              id: 'UploadFile.notAcceptedFileSize2',
              defaultMessage:
                'File is too big (max {maxFileSizeMb, number} Mb)',
            },
            { maxFileSizeMb }
          )
        : null
    );

    setFileTypeError(
      hasFileTypeError
        ? formatMessage(
            {
              id: 'UploadFile.notAcceptedFileType',
              defaultMessage:
                '{notAcceptedFileType} is not a supported file extension',
            },
            {
              notAcceptedFileType:
                file.type.replace(/(.*)\//g, '') || file.name,
            }
          )
        : null
    );

    if (hasFileSizeError || hasFileTypeError) {
      return;
    }

    const newFileData = await readFile(file);
    setFileUrl(newFileData.dataURL);
    onChange(newFileData);
  };

  return {
    onDropFile,
    fileTypeError,
    fileSizeError,
    fileUrl,
    displayableFile: sameArrays(validExtensions, imgExtension),
  };
};

export default useUploadFile;
