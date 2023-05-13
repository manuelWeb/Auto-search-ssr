import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { renderToString } from 'react-dom/server';
import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from 'instantsearch.js';
import { DynamicWidgets, InstantSearch, Hits, Highlight, RefinementList, SearchBox, InstantSearchServerState, InstantSearchSSRProvider, } from 'react-instantsearch-hooks-web';
import { getServerState } from 'react-instantsearch-hooks-server';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import { Panel } from '../components/Panel';
import { APP_ID, PRODUCTS_INDEX, SEARCH_API_KEY } from '../constants';
import Layout from '../components/layout';

const client = algoliasearch(APP_ID, SEARCH_API_KEY);

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

type HomePageProps = {};

export default function HomePage(props: HomePageProps) {
  return (
    <>

      <Head>
        <title>React InstantSearch Hooks - Next.js</title>
      </Head>

      {/* <InstantSearch
        searchClient={client}
        indexName={PRODUCTS_INDEX}
        routing={{
          router: history({
            getLocation() {
              if (typeof window === 'undefined') {
                return new URL(url!) as unknown as Location;
              }

              return window.location;
            },
          }),
        }}
      > */}
      <Layout>
        I'm homepage
        {/* <header className='header'>
            Menu
            <SearchBox searchAsYouType={false} />
          </header> */}

        {/* <div className="Container">
            <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
            </div>
            <div>
            <Hits hitComponent={Hit} />
            </div>
          </div> */}

      </Layout>

      {/* </InstantSearch> */}

      {/* </InstantSearchSSRProvider> */}

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
