import React from 'react'
import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {
  const [article, setArticle] = useState({url: '', summary: '',});
  const [history, setHistory] = useState([]);
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [copied, setCopied] = useState('')

  useEffect(( ) => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )
    if(articlesFromLocalStorage) {
      setHistory(articlesFromLocalStorage)
    }
  }, []);

  const handleSubmit  = async (event) => {
    event.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url })
    if(data?.summary) {
      const newArticle = { ...article, summary: data.summary }
      const updatedHistory = [newArticle, ...history]

      setArticle(newArticle);
      setHistory(updatedHistory);
      localStorage.setItem('articles', JSON.stringify(updatedHistory))
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(() => setCopied(false), 3000)
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
            id='search_field'
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
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {history.map((item, index) => (
            <div 
            className='link_card'
            key={`link-${index}`}
            onClick={() => {setArticle(item)}}
            >
              <div className='copy_btn' onClick={() => {handleCopy(item.url)}}>
                <img
                  className='w-[40%] h-[40%] object-contain'
                  src={copied === item.url ? tick : copy}
                  alt='copy_icon'
                />
                <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                  {item.url}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Display Results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
          {isFetching ? (
            <img src={loader} alt='loading' className='w-10 h-10' />
          ) : error ? (
            <p className='font-inter font-bold font-center text-black'>
              Sorry, an error occured...
              <br />
              <span className='font-satoshi font-normal text-grey-700'>
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && (
              <div className='flex flex-col gap-3'>
                <h2 className='font-satoshi -font-bold font-grey-600 text-xl'>
                  Article <span className='blue_gradient'>Summary</span>
                </h2>
                <div className='summary_box'>
                  <p className='font-inter font-medium text-sm text-gray-700'>{article.summary}</p>
                </div>
              </div>
            )
          )}
      </div>
    </section>
  )
}

export default Demo 