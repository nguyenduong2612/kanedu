import { create, all } from "mathjs";
// var stringSimilarity = require("string-similarity");
var distance = require("jaro-winkler");

const calcLengthProduct = (
  sourceVector: Array<number>,
  desVector: Array<number>
): number => {
  const getLength = (vector: Array<number>) => {
    let length = 0;

    for (let i in vector) {
      length += vector[i] * vector[i];
    }

    return Math.sqrt(length);
  };

  const lengthProduct = getLength(sourceVector) * getLength(desVector);

  return lengthProduct;
};

const calcDotProduct = (
  sourceVector: Array<number>,
  desVector: Array<number>
): number => {
  let mathConfig = {};
  const math = create(all, mathConfig);

  const dotProduct = math.dot && math.dot(sourceVector, desVector);

  if (!dotProduct) return 0;
  return dotProduct;
};

const calcCosSimilarity = (source: any, des: any): number => {
  const weight: any = {
    title: 0.3,
    description: 0.1,
    level: 0.2,
    skill: 0.2,
    category: 0.2,
  };
  let cosSimilarity = 0;

  for (const prop of Object.keys(source)) {
    if (prop === "description" || prop === "title") continue;
    let propSim =
      calcDotProduct(source[prop], des[prop]) /
      calcLengthProduct(source[prop], des[prop]);

    cosSimilarity += propSim * weight[prop];
  }

  let descriptionSim = distance(source["description"], des["description"]);
  let titleSim = distance(source["title"], des["title"]);

  cosSimilarity += descriptionSim * weight["description"];
  cosSimilarity += titleSim * weight["title"];

  return cosSimilarity;
};

export function recommendCourses(source: any, courses: Array<any>) {
  let recommendList = courses.map((course: any) => {
    return {
      ...course,
      score: calcCosSimilarity(source.vector, course.vector),
    };
  });

  // Sort by score
  recommendList.sort((a, b) => b.score - a.score);

  //console.log(recommendList.slice(1, 4))
  return recommendList.slice(1, 4);
}

export function createVector(courseData: any) {
  let level = [
    courseData.level === "N5" ? 1 : 0,
    courseData.level === "N4" ? 1 : 0,
    courseData.level === "N3" ? 1 : 0,
    courseData.level === "N2" ? 1 : 0,
    courseData.level === "N1" ? 1 : 0,
  ];

  let skill = [
    courseData.skill === "Từ vựng" ? 1 : 0,
    courseData.skill === "Hán tự" ? 1 : 0,
    courseData.skill === "Ngữ pháp" ? 1 : 0,
    courseData.skill === "Khác" ? 1 : 0,
  ];

  let category = [
    courseData.category === "Luyện thi" ? 1 : 0,
    courseData.category === "Tổng hợp" ? 1 : 0,
    courseData.category === "Kỹ thuật" ? 1 : 0,
    courseData.category === "Kinh tế" ? 1 : 0,
    courseData.category === "Kinh doanh" ? 1 : 0,
    courseData.category === "Khác" ? 1 : 0,
  ];

  let description = courseData.description;
  let title = courseData.name;

  return { level, skill, category, description, title };
}
