import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";

interface RootState {
  courses: any;
}

function useCourse(courseId: string) {
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");
  const [countFollowers, setCountFollowers] = useState<number>();
  const [followingCourseIndex, setFollowingCourseIndex] = useState<number>(-1);
  const [isFollowed, setIsFollowed] = useState<boolean>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { followingCourses } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    async function getInfo() {
      let ref = database.collection("courses").doc(courseId);
      let doc: any = await ref.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setName(doc.data().name);
        setAuthor(doc.data().author);
        setAuthorId(doc.data().author_id);
        setCountFollowers(doc.data().followed_by.length);

        var courseIndex = followingCourses
          .map((course: any) => {
            return course.id;
          })
          .indexOf(courseId);
        if (courseIndex !== -1) {
          setFollowingCourseIndex(courseIndex);
          setIsFollowed(true);
        }
      }

      setIsLoaded(true)
    }

    getInfo();
  }, [followingCourses, courseId]);

  return {
    name,
    author,
    authorId,
    countFollowers,
    followingCourseIndex,
    isFollowed,
    isLoaded,
    setName,
    setAuthor,
    setAuthorId,
    setCountFollowers,
    setFollowingCourseIndex,
    setIsFollowed,
    setIsLoaded
  }
}

export default useCourse;
