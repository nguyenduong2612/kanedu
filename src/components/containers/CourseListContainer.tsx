import React from "react";
import CourseContainer from "./CourseContainer";

interface CourseListContainer {
  courses: Array<any>;
}

const CourseListContainer: React.FC<CourseListContainer> = ({
  courses,
}: CourseListContainer) => {
  return (
    <>
      {courses.map((course: any, index: number) => {
        return (
          <CourseContainer
            key={index}
            id={course.id}
            name={course.name}
            author={course.author}
            author_id={course.author_id}
            description={course.description}
            followers={course.followed_by.length}
          />
        );
      })}
    </>
  );
};

export default CourseListContainer;
