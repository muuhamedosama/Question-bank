import axios from "axios";

export const submitExam = async (examId, questions, token, setErrorMessage) => {
  try {
    await axios.patch(`http://localhost:3000/api/exam/submitexam/${examId}`,
      JSON.stringify({
        submittedQuestions: questions
      }),
      {
        headers:{
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}` 
        }
      }
    );
  } catch (err) {
    setErrorMessage(err.response?.data?.message);
  }
};