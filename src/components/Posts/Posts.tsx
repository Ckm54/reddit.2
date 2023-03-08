import { Community } from "@/atoms/communityAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React from "react";

type Props = {
  communityData: Community;
};

const Posts = ({ communityData }: Props) => {
  // get auth state
  const [loading, setLoading] = React.useState(false);

  const getPosts = async () => {
    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => console.log(doc));

      console.log("posts", postDocs)
    } catch (error: any) {
      console.log("Get posts error: ", error.message);
    }
  };

  React.useEffect(() => {
    getPosts();
  }, []);

  return <div>PoPostsst</div>;
};

export default Posts;
