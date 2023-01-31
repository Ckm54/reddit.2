import { Input } from '@chakra-ui/react';
import React from 'react'

type Props = {}

const Login = (props: Props) => {

  const [loginFormValues, setLoginFormValues] = React.useState({
    email: '',
    password: '',
  });

  return (
    <form>
      <Input />
      <Input />
    </form>
  )
}

export default Login