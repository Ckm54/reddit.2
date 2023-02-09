import React from "react";
import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { BsDot, BsReddit } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";

const ResetPassword = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };

  return (
    <Flex direction={"column"} alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>

      {success ? (
        <Text mb={4}>Check your email :) </Text>
      ) : (
        <React.Fragment>
          <Text fontSize={"sm"} textAlign="center" mb={2}>
            Enter the email address associated with your account and we will
            send you a reset link.
          </Text>

          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Input
              name="email"
              required
              placeholder="email"
              type={"email"}
              mb={2}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
              fontSize="10pt"
              _placeholder={{ color: "gray.500" }}
              _hover={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              bg="gray.50"
            />
            <Button
              width='100%'
              height={'36px'}
              my={2}
              type='submit'
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </React.Fragment>
      )}

      <Flex
        alignItems={'center'}
        fontSize='9pt'
        color={'blue.500'}
        fontWeight={700}
        cursor='pointer'
      >
        <Text
          onClick={() => setAuthModalState((prev) => ({
            ...prev,
            view: 'login'
          }))}
        >
          LOGIN
        </Text>
        <Icon as={BsDot} />
        <Text
          onClick={() => setAuthModalState((prev) => ({
            ...prev,
            view: 'signup'
          }))}
        >
          SIGN UP
        </Text>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
