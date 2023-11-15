import * as React from 'react';

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

  React.useEffect(() =>
  {

    dispatchStories(
    {
      type: 'STORIES_FETCH_INIT'
    });

    fetch(`${API_ENDPOINT}react`)
      .then((response) =>
        response.json())
      .then((result) =>
      {
        dispatchStories(
        {
          type: 'SET_STORIES',
          payload: result.hits,
        });
      })
      .catch(() =>
        dispatchStories(
        {
          type: 'STORIES_FETCH_FAILURE'
        }));
  },
  []);

  const handleRemoveStory = (item) =>
  {
    dispatchStories(
    {
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = (event) =>
  {

    //synthetic event
    console.log(event);

    //value of target (here: input HTML element)
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  }

  const searchedStories = stories.filter(function(story)
  {
    return story.title.toLowerCase().includes(searchTerm);
  });

  return (
    <>
      <div>
        <h1>My Hacker Stories</h1>

        <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}>
          <strong>Search:</strong>
        </InputWithLabel>

        <p>
          Searching for <strong>{searchTerm}</strong>
        </p>
      </div>

      <hr/>

      {stories.isError && <p>Something went wrong ...</p>}

      {
        stories.isLoading ?
          (<p>Loading...</p>) :
          (<List list={searchedStories} onRemoveItem={handleRemoveStory}/>)
      }
    </>
  )
}

export default App
