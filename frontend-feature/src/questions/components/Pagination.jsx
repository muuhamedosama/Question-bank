import React from 'react';

const Pagination = ({ totalPages, currentPage, handleClick}) => {
  const pages = new Array(totalPages).fill(0).map((page, index) => 
    <button 
      key={index}
      className={` page-btn ${currentPage === index+1 && 'current-page'}`}
      style={{backgroundColor: currentPage === index+1 && '#006d77'}}
      onClick={() => handleClick(index + 1)}
    >
      {index + 1}
    </button>
  )

  return (
    <div className='pagination'>
      {pages}
    </div>
  )
};

export default Pagination;