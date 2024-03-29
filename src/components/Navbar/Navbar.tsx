import { auth } from '@/firebase/clientApp';
import useDirectory from '@/hooks/useDirectory';
import { Flex, Image } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TiHome } from 'react-icons/ti';
import Directory from './Directory/Directory';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  return (
    <Flex
      bg={'white'}
      height="44px"
      padding={'6px 12px'}
      justifyContent={{ md: 'space-between' }}
    >
      <Flex
        align={'center'}
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: '0', md: '2' }}
        onClick={() =>
          onSelectMenuItem({
            displayText: 'Home',
            link: '/',
            icon: TiHome,
            iconColor: 'black',
          })
        }
        cursor="pointer"
      >
        <Image src="/images/redditFace.svg" alt="logo image" height={'30px'} />
        <Image
          src="/images/redditText.svg"
          alt="logo image"
          height={'46px'}
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
