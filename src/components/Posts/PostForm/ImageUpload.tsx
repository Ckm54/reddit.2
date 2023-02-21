import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload = ({
  selectedFile,
  onSelectImage,
  setSelectedTab,
  setSelectedFile,
}: ImageUploadProps) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex justify={"center"} align="center" width="100%">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            maxWidth="400px"
            maxHeight="100px"
            alt="Uploaded image"
          />
          <Stack direction={"row"} mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant={"outline"}
              height="20px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify={"center"}
          align="center"
          p={20}
          border="1px dashed"
          borderColor={"gray.200"}
          width="100%"
          borderRadius={4}
        >
          <Button
            variant={"outline"}
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