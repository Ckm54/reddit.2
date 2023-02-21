import PageContent from '@/components/Layout/PageContent'
import NewPostForm from '@/components/Posts/NewPostForm'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

const submit = (props: Props) => {
  return (
    <PageContent>
      <>
      <Box padding='14px 0' borderBottom={'1px solid'} borderColor='#fff'>
        <Text>Create a post</Text>
      </Box>
      <NewPostForm />
      </>
      <>
        right
      </>
    </PageContent>
  )
}

export default submit