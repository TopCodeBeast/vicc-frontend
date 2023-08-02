import { IconDefinition, faFilePdf } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text14, Text16 } from '@core/atoms/typography';
import UploadFile from '@core/components/form/UploadFile';
import { FileWithDataURL } from '@core/components/form/UploadFile/useUploadFile';

type Props = {
  icon: IconDefinition;
  file: FileWithDataURL | undefined;
  name: string;
  setFile: (file: FileWithDataURL) => void;
  documentName: string;
};

const UploadFilePlaceholderRoot = styled.div<{ preview?: boolean }>`
  width: 100%;
  border: 2px solid var(--c-neutral-600);
  border-radius: var(--double-unit);
  gap: var(--unit);
  color: var(--c-neutral-1000);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 220px;

  ${({ preview }) =>
    preview
      ? 'background-color: var(--c-neutral-100);'
      : 'border-style: dashed;  padding: var(--double-unit) 0;'}

  > img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const maxFileSize = 7;
const Reupload = styled(Text14)`
  text-decoration: underline;
  color: var(--c-neutral-800);
  align-self: flex-start;
`;

const fileIsImageFn = (file: File | undefined) => {
  if (!file) return false;
  return file && file.type.split('/')[0] === 'image';
};

const UploadFilePlaceholder = ({
  icon,
  file,
  title,
}: {
  icon: ReactNode;
  title: ReactNode;
  file: FileWithDataURL | undefined;
}) => {
  const fileIsImage = fileIsImageFn(file?.file);
  if (file?.dataURL && fileIsImage) {
    return (
      <UploadFilePlaceholderRoot preview>
        <img alt="preview" src={file.dataURL} />
      </UploadFilePlaceholderRoot>
    );
  }
  if (file && !fileIsImage) {
    return (
      <UploadFilePlaceholderRoot preview>
        <FontAwesomeIcon size="2xl" icon={faFilePdf} />
        <Text14>{file.file.name}</Text14>
      </UploadFilePlaceholderRoot>
    );
  }
  return (
    <UploadFilePlaceholderRoot>
      {icon}
      <Text16 bold>{title}</Text16>
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage
          id="UploadFilePlaceholder.jpegOrPng"
          defaultMessage="JPEG, PNG or PDF only"
        />
      </Text14>
      <Caption color="var(--c-neutral-600)">
        <FormattedMessage
          id="UploadFilePlaceholder.maxFileSize"
          defaultMessage="(Max file size: {value}MB)"
          values={{
            value: maxFileSize,
          }}
        />
      </Caption>
    </UploadFilePlaceholderRoot>
  );
};

const validExtensions = ['jpg', 'png', 'jpeg', 'pdf'];

export const UploadInput = ({
  name,
  file,
  setFile,
  icon,
  documentName,
}: Props) => {
  return (
    <UploadFile
      name={name}
      currentFileUrl=""
      validExtensions={validExtensions}
      onChange={fileData => {
        setFile(fileData);
      }}
      type="image/png, image/jpeg, application/pdf"
      maxFileSizeMb={maxFileSize}
    >
      <UploadFilePlaceholder
        icon={<FontAwesomeIcon size="2xl" icon={icon} />}
        file={file}
        title={
          <FormattedMessage
            id="UploadFile.title"
            defaultMessage="Upload {documentName}"
            values={{ documentName }}
          />
        }
      />
      {file && (
        <Reupload>
          <FormattedMessage
            id="UploadInput.reUpload"
            defaultMessage="Re-upload {documentName}"
            values={{ documentName }}
          />
        </Reupload>
      )}
    </UploadFile>
  );
};

export default UploadInput;
