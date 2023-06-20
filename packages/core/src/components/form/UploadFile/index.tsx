import { ReactNode, useRef } from 'react';
import styled from 'styled-components';

import ecusson from 'assets/user/ecusson.png';
import Button from '@sorare/core/src/atoms/buttons/Button';

import useUploadFile from './useUploadFile';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const Error = styled.div`
  color: var(--c-red-600);
`;
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;
const Input = styled.input`
  position: absolute;
  opacity: 0;
  z-index: -1;
`;
const Image = styled.img`
  width: calc(12 * var(--unit));
  height: calc(12 * var(--unit));
  object-fit: cover;
  border-radius: 8px;
`;

const onUploadClick = (e: any) => {
  e.target.value = null;
};

type Props = {
  onChange: (file: File) => void;
  currentFileUrl: string | null;
  name: string;
  validExtensions?: string[];
  buttonLabel: ReactNode;
  type: string;
};
export const UploadFile = ({
  onChange,
  currentFileUrl,
  name,
  type,
  validExtensions,
  buttonLabel,
}: Props) => {
  const { onDropFile, fileTypeError, fileSizeError, fileUrl, displayableFile } =
    useUploadFile(onChange, validExtensions);

  const input = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    input.current!.click();
  };

  return (
    <Root>
      {fileTypeError && <Error>{fileTypeError}</Error>}
      {fileSizeError && <Error>{fileSizeError}</Error>}
      <Container>
        <Input
          className="sr-only"
          type="file"
          ref={input}
          name={name}
          onChange={e => {
            onDropFile(e);
          }}
          onClick={onUploadClick}
          accept={type}
        />
        {displayableFile && (
          <Image src={fileUrl || currentFileUrl || ecusson} alt={name} />
        )}
        <Button color="darkGray" small onClick={triggerFileUpload}>
          {buttonLabel}
        </Button>
      </Container>
    </Root>
  );
};

export default UploadFile;
