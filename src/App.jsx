import * as React from 'react';

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

const Item = ({item}) => (
  <li key={item.objectID}>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
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

const List = ({list}) =>
{
  return(
    <ul>
        {
          list.map((item) => (
            <Item key={item.objectID} item={item}/>
          ))
        }
      </ul>
  );
}

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

  const stories = 
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

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

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

      <List list={searchedStories}/>
    </>
  )
}

export default App
