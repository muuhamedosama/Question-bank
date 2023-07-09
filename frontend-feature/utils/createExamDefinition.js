import axios from "axios";

export const createExamDefinition = async (name, questions, token, setErrorMessage) => {
  try {
    const { data } = await axios.post('http://localhost:3000/api/exam/',
      JSON.stringify({
        name,
        questions
      }),
      {
        headers:{
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}` 
        }
      }
    );
    alert(data.message);
  } catch (err) {
    setErrorMessage(err.response?.data?.message);
  }
};