import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

const OauthButtons = () => {

  const [ signInWithGoogle, user, loading, error ] = useSignInWithGoogle(auth);

  return (
    <Flex direction={'column'} width='100%'>
      <Button mb={4} variant='oauth' isLoading={loading} onClick={() => signInWithGoogle()}>
        <Image src='/images/googlelogo.png' height={'20px'} alt='google login' mr={4} />
        Continue with Google
      </Button>
      {error && <Text textAlign={"center"} color="red" fontSize={"10pt"}>{error.message}</Text>}
    </Flex>
  )
}

export default OauthButtons