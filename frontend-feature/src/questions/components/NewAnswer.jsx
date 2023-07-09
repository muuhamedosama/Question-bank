import React from 'react'

const NewAnswer = ({ answer, index, handleAnswersChange }) => {
  return (
    <>
      <input 
        onChange={(event) => handleAnswersChange(index, event)} 
        name='name' 
        value={answer.name}
        type="text" 
        required 
        placeholder="answer"
      />
      <input 
        onChange={(event) => handleAnswersChange(index, event)} 
        name='description' 
        value={answer.description}
        type="text" 
        placeholder="description (optional)"
      />
      <input 
        onChange={(event) => handleAnswersChange(index, event)} 
        name='isCorrect' 
        value={answer.isCorrect}
        type="checkbox" 
      />
    </>
  )
}

export default NewAnswer;