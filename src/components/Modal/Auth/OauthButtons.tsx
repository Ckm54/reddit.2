import { Button, Flex, Image } from '@chakra-ui/react'
import React from 'react'

const OauthButtons = () => {
  return (
    <Flex direction={'column'} width='100%'>
      <Button mb={4} variant='oauth'>
        <Image src='/images/googlelogo.png' height={'20px'} alt='google login' mr={4} />
        Continue with Google
      </Button>
    </Flex>
  )
}

export default OauthButtons