import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Item = (props) => (
  <li key={props.item.objectID}>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>{props.item.author}</span>
    <span>{props.item.num_comments}</span>
    <span>{props.item.points}</span>
  </li>
);

const List = (props) =>
{
  return(
    <ul>
        {
          props.list.map((item) => (
            <li key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
            </li>
          ))
        }
      </ul>
  );
}

const Search = (props) =>
{

  const [searchTerm, setSearchTerm] = React.useState('');
  const handleChange = (event) =>
  {

    //synthetic event
    console.log(event);

    //value of target (here: input HTML element)
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  };

  props.onSearch(event);

  return (
    <div>
      <label htmlFor='search'>Search:</label>
      <input id='search' type='text' onChange={handleChange}/>

      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
}

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

  const handleSearch = (event) =>
  {
    console.log(event.target.value);
  }

  return (
    <>
      <div>
        <h1>My Hacker Stories</h1>

        <Search onSearch={handleSearch}/>
      </div>

      <hr/>

      <List list={stories}/>
    </>
  )
}

export default App
