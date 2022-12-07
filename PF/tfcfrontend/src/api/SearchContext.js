import React, {createContext, useState} from 'react'

const SearchContext = createContext({});

export default SearchContext;

export const SearchProvider = ({children}) => {
    const [searchString, setSearchString] = useState(null)

    let context = {
        searchString: searchString,
        setSearchString: setSearchString
    }

    return(
        <SearchContext.Provider value={context} >
            {children}
        </SearchContext.Provider>
    )
}