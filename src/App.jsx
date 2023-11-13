import * as React from 'react';

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

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
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter((story) =>
        action.payload.objectID !== story.objectID);
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

  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() =>
  {

    setIsLoading(true);

    getAsyncStories()
      .then((result) =>
      {
        dispatchStories(
        {
          type: 'SET_STORIES',
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
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

      {isError && <p>Something went wrong ...</p>}

      {
        isLoading ?
          (<p>Loading...</p>) :
          (<List list={searchedStories} onRemoveItem={handleRemoveStory}/>)
      }
    </>
  )
}

export default App
