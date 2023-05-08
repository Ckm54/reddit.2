import { Community } from '@/atoms/communityAtom';
import { firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import {
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Icon,
  Box,
  Button,
} from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { FaReddit } from 'react-icons/fa';

const Recommendations = () => {
  const [communities, setCommunities] = React.useState<Community[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      // get top 5 communities ordered by number of members
      const communityQuery = query(
        collection(firestore, 'communities'),
        orderBy('numberOfMembers', 'desc'),
        limit(5)
      );

      const communityDocs = await getDocs(communityQuery);

      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCommunities(communities as Community[]);
    } catch (error) {
      console.error('GetCommunityRecommendations error', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex
      direction={'column'}
      background="white"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align={'flex-end'}
        color="white"
        p={'6px 10px'}
        h="70px"
        borderRadius={'4px 4px 0px 0px'}
        fontWeight={700}
        // backgroundImage="url(/images/recCommsArt.png)"
        bgGradient={
          'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.75)), url(/images/recCommsArt.png)'
        }
        backgroundSize={'cover'}
      >
        Top Communities
      </Flex>
      <Flex direction={'column'}>
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify={'space-between'} align="center">
              <SkeletonCircle size={'10'} />
              <Skeleton height={'10px'} width={'70%'} />
            </Flex>
            <Flex justify={'space-between'} align="center">
              <SkeletonCircle size={'10'} />
              <Skeleton height={'10px'} width={'70%'} />
            </Flex>
            <Flex justify={'space-between'} align="center">
              <SkeletonCircle size={'10'} />
              <Skeleton height={'10px'} width={'70%'} />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((community, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === community.id
              );
              return (
                <Flex
                  key={community.id}
                  align="center"
                  position={'relative'}
                  fontSize={'10pt'}
                  borderBottom="1px solid"
                  borderColor={'gray.200'}
                  p="10px 12px"
                >
                  <Box width={'100%'}>
                    <Link href={`/r/${community.id}`}>
                      <Flex flex={1} align="center">
                        <Flex width="15%">
                          <Text>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="100%">
                          {community.imageURL ? (
                            <Image
                              boxSize={'28px'}
                              src={community.imageURL}
                              borderRadius="full"
                              mr={2}
                              alt={`${community.id} image`}
                            />
                          ) : (
                            <Icon
                              as={FaReddit}
                              fontSize={30}
                              color="brand.100"
                              mr={2}
                            />
                          )}

                          <span
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {`r/${community.id}`}
                          </span>
                        </Flex>
                      </Flex>
                    </Link>
                  </Box>
                  <Box position={'absolute'} right="10px">
                    <Button
                      height={'22px'}
                      fontSize="8pt"
                      variant={isJoined ? 'outline' : 'solid'}
                      onClick={() => {
                        onJoinOrLeaveCommunity(community, isJoined);
                      }}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </Button>
                  </Box>
                </Flex>
              );
            })}

            <Box p="10px 20px">
              <Button height={'30px'} width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Recommendations;
