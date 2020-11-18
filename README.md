courses: {
  _id: {
    title,
    lessons: {
      _id: {
        title,
        cards: {
          _id: {
            word,
            meaning
          }
        }
      }
    }
  }
}

users: {
  _id: {
    email,
    name,
    phone,
    profile_url,
    goal,
    enrollments: {
      _id: {
        courses_id,
        progress,
      }
    }
    role
  }
}

tests: {
  _id: {
    title,
    level,
    time,
    question_sheet: {
      _id: {
        question,
        answer: {
          1,
          2,
          3,
          4,
          correct_answer
        }
      }
    }
  }
}

questions_bank: {
  _id: {
    level,
    type,
    question,
    answer: {
      1,
      2,
      3,
      4,
      correct_answer
    }
  }
}

posts: {
  _id: {
    author,
    content,
    created_at,
    updated_at,
    comments: {
      _id: {
        author,
        content,
        created_at,
        updated_at,
      }
    }
  }
}