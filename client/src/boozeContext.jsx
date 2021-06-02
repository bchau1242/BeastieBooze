import React, {useState, useEffect} from 'react'
import axios from 'axios'

const BoozeContext = React.createContext();

function BoozeContextProvider({children}) {

  // Here's where we're holding state for the app.
  // aDrink will be the current selected drink we wanna render in DrinkView
  const [drinksFeed, setDrinksFeed] = useState([]);
  const [aDrink, setADrink] = useState({});
  const [customDrinks, setCustomDrinks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  

// gets 10 random drinks from our api
  const random10 = () => {
    axios.get('/routes/feed')
      .then(({data}) => {
        setDrinksFeed(data)
      })
      .catch(err => console.log('couldnt get drinks from server: ', err))
  }

// this function gets passed down to DrinkView. DrinkView uses useParams() to get the drink id passed to it
// and passes said id through this function to grab the corresponding drink object from our drinksFeed
// Will update to this as we have drinks coming from other sources, like our custom drink database
  const renderDrink = (id) => {
    console.log('drinkId in Context: ', id)
    console.log(drinksFeed)
    const displayDrink = drinksFeed.find(drink => drink.idDrink == id)
    setADrink(displayDrink)
  }

  // This receives the user input from the Create component. This is where we'll parse that data and make a post request to
  // to add the new drink to the db
  const makeADrink = (userInput) => {
    console.log("we gotta do something with this drank data: ", userInput);

  }

  //Functions to handle state for Search component

  const searchDrinks = ({search, query}) => {
    
    // get params to pass on to server 
    query = query.split(' ').join('_');
    let searchParam = 'search';
    let tag = 's';

    if (search === 'ingredient') {
      searchParam = 'filter'
      tag = 'i'
    }
 
    axios.get('/routes/search', {params: {searchParam, tag, query}})
    .then(({ data }) => {
      if(!data.length){
        setSearchResults("404")
      } else {
      setSearchResults(data)
      }
    })
    .catch(err => console.log('error fetching data from api in Context: ', err));

  };

 
// anything we want to pass on to other components must go in this value object
  return (
    <BoozeContext.Provider value={{drinksFeed, random10, renderDrink, aDrink, makeADrink, searchDrinks, searchResults}}>
      {children}
    </BoozeContext.Provider>
  )

}

export {BoozeContextProvider, BoozeContext}