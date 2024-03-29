import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (_value: string) => void;
  setSelectedFile: (_value: string) => void;
};

const ImageUpload = ({
  selectedFile,
  onSelectImage,
  setSelectedTab,
  setSelectedFile,
}: ImageUploadProps) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex direction={'column'} justify={'center'} align="center" width="100%">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            width="400px"
            height="z00px"
            alt="Uploaded image"
          />
          <Stack direction={'row'} mt={4}>
            <Button height="28px" onClick={() => setSelectedTab('Post')}>
              Back to Post
            </Button>
            <Button
              variant={'outline'}
              height="28px"
              onClick={() => setSelectedFile('')}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify={'center'}
          align="center"
          p={20}
          border="1px dashed"
          borderColor={'gray.200'}
          width="100%"
          borderRadius={4}
        >
          <Button
            variant={'outline'}
            height="28px"
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            type="file"
            ref={selectedFileRef}
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
