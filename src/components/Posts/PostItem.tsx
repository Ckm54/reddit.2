import { Post } from '@/atoms/PostAtom';
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    _event: React.MouseEvent<SVGElement, MouseEvent>,
    _post: Post,
    _vote: number,
    _communityId: string
  ) => void;
  onDeletePost: (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    _post: Post
  ) => Promise<boolean>;
  onSelectPost?: (_post: Post) => void;
  homePage?: boolean;
};

const PostItem = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}: PostItemProps) => {
  const [loadingImage, setLoadingImage] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [deletingPost, setDeletingPost] = React.useState(false);
  const router = useRouter();
  const singlePostPage = !onSelectPost;

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDeletingPost(true);
    try {
      const success = await onDeletePost(event, post);
      if (!success) {
        throw new Error('Failed to delete post.');
      }

      console.log('Post successfully deleted.');
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setDeletingPost(false);
  };

  return (
    <Flex
      border={'1px solid'}
      bg="white"
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
      _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction={'column'}
        align="center"
        bg={singlePostPage ? 'none' : 'gray.100'}
        padding={2}
        width="40px"
        borderRadius={singlePostPage ? '0' : '3px 0 0 3px'}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          onClick={(event) => onVote(event, post, 1, post.communityId)}
          cursor="pointer"
        />
        <Text fontSize={'9pt'}>{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          onClick={(event) => onVote(event, post, -1, post.communityId)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction={'column'} width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mt={2}>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack
            direction={'row'}
            spacing={0.6}
            align="center"
            fontSize={'9pt'}
          >
            {/* Homepage check */}
            {homePage && (
              <>
                {post.communityImageUrl ? (
                  <Image
                    src={post.communityImageUrl}
                    borderRadius="full"
                    boxSize={'18px'}
                    mr={2}
                    alt={`${post.communityId} img`}
                  />
                ) : (
                  <Icon
                    as={FaReddit}
                    fontSize="18pt"
                    mr={1}
                    color={'blue.500'}
                  />
                )}
                <Link href={`r/${post.communityId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: 'underline' }}
                    onClick={(event) => event.stopPropagation()}
                  >{`r/${post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}

            <Text>
              Posted by u/{post.creatorDisplayName}{' '}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>

          <Text fontSize={'12pt'} fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize={'10pt'}>{post.body}</Text>
          {post.imageURL && (
            <Flex justify={'center'} align="center" p={2}>
              {loadingImage && (
                <Skeleton height={'200px'} width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight={'460px'}
                alt={`${post.title} image`}
                display={loadingImage ? 'none' : 'unset'}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align={'center'}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize={'9pt'}>{post.numberOfComments}</Text>
          </Flex>

          <Flex
            align={'center'}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize={'9pt'}>Share</Text>
          </Flex>

          <Flex
            align={'center'}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize={'9pt'}>Save</Text>
          </Flex>

          {userIsCreator && (
            <Flex
              align={'center'}
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: 'gray.200', color: 'red' }}
              cursor="pointer"
              onClick={(event) => handleDelete(event)}
            >
              {deletingPost ? (
                <Spinner size={'sm'} />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize={'9pt'}>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
