import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import OauthButtons from "./OauthButtons";
import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  React.useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={modalState.open}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction={"column"}
              align="center"
              justify={"center"}
              width="70%"
            >
              {modalState.view === "login" || modalState.view === "signup" ? (
                <React.Fragment>
                  <OauthButtons />
                  <Text color={"gray.400"} fontWeight={700}>
                    OR
                  </Text>
                  <AuthInputs />
                </React.Fragment>
              ) : (
                <ResetPassword />
              )}

              {/* <ResetPassword /> */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
