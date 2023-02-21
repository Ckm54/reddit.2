import { Flex, Icon } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import TabItemTitle from './TabItem';

type NewPostFormProps = {}

export interface TabItem {
  title: string;
  icon: typeof Icon.arguments
}

const formTabs: TabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline
  },
  {
    title: 'Link',
    icon: BsLink45Deg
  },
  {
    title: 'Poll',
    icon: BiPoll
  },
  {
    title: 'Talk',
    icon: BsMic
  }
]

const NewPostForm = (props: NewPostFormProps) => {
  const[selectedTab, setSelectedTab] = React.useState(formTabs[0].title)
  return (
    <Flex direction={'column'}borderRadius={4} mt={2} bg='white'>
      <Flex width={'100%'}>
        {
          formTabs.map((item: TabItem, index: number) => (
            <TabItemTitle key={index} item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab}/>
          ))
        }
      </Flex>
    </Flex>
  )
}

export default NewPostForm