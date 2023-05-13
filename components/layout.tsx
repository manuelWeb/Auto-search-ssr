import Link from "next/link";
import { InstantSearch, SearchBox, useSearchBox } from "react-instantsearch-hooks-web";
import { searchClient } from "../utils/searchClient";
import { PRODUCTS_INDEX } from "../constants";
import { useRouter } from 'next/router';
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import { Autocomplete } from "./Autocomplete";

function CustomSearchBox(props) {
  const router = useRouter();
  // console.log('props', props);

  // const { query, refine, clear, isSearchStalled } = useSearchBox(props);
  const { query, refine, } = useSearchBox(props);

  const handleSearch = (event) => {
    console.log('event query', props.query.asPath);

    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(query)}&from=${props.query.asPath}`);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={(e) => refine(e.target.value)} />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default function Layout({ children, ...props }) {
  const router = useRouter();

  /* const handleSearch = (event) => {
    (event) => refine(event.target.value)
    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(query)}`);
  }; */
  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName={PRODUCTS_INDEX}
      // routing
      /* routing={{
        router: history({
          getLocation: () =>
            typeof window === 'undefined' ? location : window.location,
        }),
      }} */
      // resultsState={resultsState}
      >

        <header className='header'>
          Menu
          {/* <SearchBox searchAsYouType={false}
            // onSubmit={handleSearch}
            onSubmit={event => {
              event.preventDefault();
              console.log(event.currentTarget);
              router.push('search')
            }}
          /> */}
          {/* <CustomSearchBox
            searchClient={searchClient}
            indexName={PRODUCTS_INDEX}
            searchAsYouType={false}
            query={router}
            routing={{
              stateMapping: singleIndex(PRODUCTS_INDEX),
              router: createInstantSearchRouterNext({
                singletonRouter,
                serverUrl,
              }),
            }}
          /> */}

          <Autocomplete
            openOnFocus
            placeholder="auto"

            detachedMediaQuery="none"
            searchClient={searchClient}
          />

        </header>
        {children}
        <footer className='d-flex footer'>
          <Link href='/'>Home</Link>
          <Link href='/faq'>FAQ</Link>
          <Link href='/cgv'>CGV</Link>
        </footer>
      </InstantSearch>
    </div>
  );
}