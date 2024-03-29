import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const OauthButtons = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
    };
    await setDoc(userDocRef, newUser);
  };

  React.useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <Flex direction={'column'} width="100%">
      <Button
        mb={4}
        variant="oauth"
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src="/images/googlelogo.png"
          height={'20px'}
          alt="google login"
          mr={4}
        />
        Continue with Google
      </Button>
      {error && (
        <Text textAlign={'center'} color="red" fontSize={'10pt'}>
          {error.message}
        </Text>
      )}
    </Flex>
  );
};

export default OauthButtons;
