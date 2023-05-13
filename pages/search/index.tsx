import { Hit as AlgoliaHit } from 'instantsearch.js';
import { InstantSearch, InstantSearchSSRProvider, RefinementList, DynamicWidgets, Hits, Highlight, useSearchBox, Configure, InstantSearchServerState, SearchBox } from 'react-instantsearch-hooks-web';
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import { getServerState } from 'react-instantsearch-hooks-server';
import { renderToString } from 'react-dom/server';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import singletonRouter from 'next/router';
import { PRODUCTS_INDEX } from '../../constants'
import { searchClient } from '../../utils/searchClient'
import { Panel } from '../../components/Panel';
import Head from 'next/head';
import Layout from '../../components/layout';
import Link from 'next/link';

type SearchPageProps = {
  serverState?: InstantSearchServerState;
  serverUrl: string; // URL
};


export default function SearchPage({ serverState, serverUrl }: SearchPageProps) {

  // console.log('serverState from brows', serverUrl, 'serverState', serverState);

  return (
    <>
      <Head>
        <title>React InstantSearch Hooks - Next.js</title>
      </Head>


      <InstantSearchSSRProvider {...serverState}>


        <Link href="/">Go home</Link>
        {/* your search is {JSON.stringify(serverState.initialResults.prod_TempsL_TLFR.results)} */}
        your search is {JSON.stringify(serverUrl)}

        <InstantSearch
          searchClient={searchClient}
          indexName={PRODUCTS_INDEX}
          /* routing={{
            stateMapping: {
              stateToRoute: function (uiState) {
                return {
                  q: uiState['test_TELETRABAJOS'].query,
                };
              },
              routeToState: function (routeState) {
                return {
                  test_TELETRABAJOS: {
                    query: routeState.q,
                  },
                };
              },
            },
          }} */

          // stateMapping: singleIndex(PRODUCTS_INDEX),
          routing={{
            router: createInstantSearchRouterNext({ singletonRouter, serverUrl }),
          }}
        >

          <SearchBox searchAsYouType={false} />
          {/*
          <Configure hitsPerPage={2} /> 
          */}
          {/* add Configure here */}

          {/* <Layout> */}

          <VirtualSearchBox />

          <div className="Container">
            <div>
              Here the facettes Nothing for now
              <DynamicWidgets fallbackComponent={FallbackComponent} />
            </div>
            <div>
              <Hits hitComponent={Hit} />
              <Configure hitsPerPage={2} />
            </div>
          </div>

          {/* </Layout> */}
          {/* Widgets */}

        </InstantSearch>
      </InstantSearchSSRProvider >
    </>
  );
}

function VirtualSearchBox() {
  useSearchBox();
  return null;
}

type HitProps = {
  hit: AlgoliaHit<{
    'fiche.nom': string;
    prix: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="fiche.nom" className="Hit-label" />
      <span className="Hit-price">${hit.prix}</span>
    </>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}

export async function getServerSideProps({ req }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;
  const serverState = await getServerState(
    <SearchPage serverUrl={serverUrl} />,
    { renderToString }
  );

  return {
    props: {
      serverState,
      serverUrl,
    },
  };
}