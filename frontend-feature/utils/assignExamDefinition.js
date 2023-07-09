import axios from "axios";

export const assignExamDefinition = async (exam, students, scheduledTimeFrom, scheduledTimeTo, token, setErrorMessage) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/api/exam/assignexam/${exam.id}`,
      JSON.stringify({
        students,
        scheduledTimeFrom,
        scheduledTimeTo
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