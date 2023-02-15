// HOW DATA IS MODELLED IN DATABASE

const USER = {
  id: 'userId',
  /**
   * 
   */
  // subcollection
  communitySnippets: [
    {
      communityId: 'commId1',
      photoUrl: 'photourl'
      // other few needed data
    },
    {
      communityId: 'commId2',
      photoUrl: 'photourl'
      // other few needed data
    },
    {
      communityId: 'commId3',
      photoUrl: 'photourl'
      // other few needed data
    },
  ]
}

const COMMUNITY = {
  id: 'commId1',
  numOfMembers: '2000000202'
}