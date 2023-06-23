import React from 'react'
import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {
  const [article, setArticle] = useState({url: '', summary: '',})
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const handleSubmit  = async (event) => {
    event.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url })
    if(data?.summary) {
      const newArticle = { ...article, summary: data.summary }

      setArticle(newArticle);

      console.log(newArticle);
    }
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gp-2'>
        <form className='relative flex justify-center items-center'
          onSubmit={handleSubmit}>
          <img
            className='absolute left-0 my-2 ml-3 w-5'
            src={linkIcon}
            alt='link_icon'
          />
          <input 
            className='url_input peer'
            type='url'
            placeholder='Enter a URL'
            value={article.url}
            onChange={(event) => {setArticle({...article, url: event.target.value})}}
            required
          />
          <button
            className='submit_btn
             peer-focus:border-gray-700
             peer-focus:text-gray-700'
            type='submit'
          >
            ↵
          </button>
        </form>
        {/* Browse URL History */}
      </div>
      {/* Display Results */}
    </section>
  )
}

export default Demo 