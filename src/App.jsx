import * as React from 'react';
import axios from 'axios';

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() =>
      resolve({ data: { stories: initialStories } }),
      2000
    )
  );

const initialStories = 
[
  {
    title:'React',
    url:'https://reactjs.org/',
    author:'Jordan Walke',
    num_comments:3,
    points:4,
    objectID:0,
  },
  {
    title:'Redux',
    url:'https://reduxjs.org/',
    author:'Dan Abramov, Andrew Clark',
    num_comments:2,
    points:5,
    objectID:1,
  },
];

const Item = ({item, onRemoveItem}) => (
  <li key={item.objectID}>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

const InputWithLabel = ({id, value, type='text', onInputChange, isFocused, children}) =>
{
  const inputRef = React.useRef();

  React.useEffect(() =>
  {
    if (isFocused && inputRef.current)
    {
      inputRef.current.focus();
    }
  },
  [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input ref={inputRef} id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange}/>
    </>
  );
}

const List = ({list, onRemoveItem}) =>
{
  return(
    <ul>
        {
          list.map((item) =>
          (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
          ))
        }
      </ul>
  );
}

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) =>
{
  return (
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>
  
      <button type="submit" disabled={!searchTerm}>
        Submit
      </button>

      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </form>
  );
}

const storiesReducer = (state, action) =>
{
  switch (action.type)
  {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,};
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,};
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,};
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter((story) => 
          action.payload.objectID !== story.objectID),};
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) =>
{
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() =>
  {
    localStorage.setItem(key, value);
  },
  [value, key]);

  return [value, setValue];
};

const App = () =>
{
  const title = 'React';

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {
      data: [],
      isLoading: false,
      isError: false
    });

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () =>
  {

    dispatchStories(
    {
      type: 'STORIES_FETCH_INIT'
    });

    try
    {
      const result = await axios.get(url)
      dispatchStories(
      {
        type: 'SET_STORIES',
        payload: result.data.hits,
      });
    }
    catch
    {
      dispatchStories(
      {
        type: 'STORIES_FETCH_FAILURE'
      });
    }
  },
  [url]);

  React.useEffect(() =>
  {
    handleFetchStories();
  },
  [handleFetchStories]);

  const handleRemoveStory = (item) =>
  {
    dispatchStories(
    {
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = (event) =>
  {

    //synthetic event
    console.log(event);

    //value of target (here: input HTML element)
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  }

  const handleSearchSubmit = () =>
  {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  }

  return (
    <>
      <div>
        <h1>{title}</h1>
        <h1>My Hacker Stories</h1>
        <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>
      </div>

      <hr/>

      {stories.isError && <p>Something went wrong ...</p>}

      {
        stories.isLoading ?
          (<p>Loading...</p>) :
          (<List list={stories.data} onRemoveItem={handleRemoveStory}/>)
      }
    </>
  );
}

export default App
