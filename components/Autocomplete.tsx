import React from "react";
import { createElement, Fragment, useEffect, useRef, useState } from "react";
import { render } from "react-dom";

import { usePagination, useSearchBox } from "react-instantsearch-hooks";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import { BaseItem } from "@algolia/autocomplete-core";

import "@algolia/autocomplete-theme-classic";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { searchClient } from "../utils/searchClient";
import { INSTANT_SEARCH_QUERY_SUGGESTIONS } from "../constants";
import { useRouter } from "next/router";

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
  className?: string;
};

type SetInstantSearchUiStateOptions = {
  query: string;
};

export function Autocomplete({ className, ...autocompleteProps }: AutocompleteProps) {
  // nextjs
  const router = useRouter();

  // algolia
  const autocompleteContainer = useRef<HTMLDivElement>(null);

  const { query, refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();

  const [instantSearchUiState, setInstantSearchUiState] = useState<
    SetInstantSearchUiStateOptions
  >({ query });

  const recentSearches = createLocalStorageRecentSearchesPlugin(
    {
      key: "instantsearch",
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.label
            });
          }
        };
      }
    }
  );

  const querySuggestions = createQuerySuggestionsPlugin(
    {
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        return recentSearches.data!.getAlgoliaSearchParams(
          {
            hitsPerPage: 6
          }
        );
      }
      // transformSource({ source }) {
      //   return {
      //     ...source,
      //     sourceId: "querySuggestionsPlugin",
      //     onSelect({ item }) {
      //       setInstantSearchUiState({ query: item.query });
      //     },
      //     getItems(params) {
      //       if (!params.state.query) {
      //         return [];
      //       }
      //       return source.getItems(params);
      //     },
      //   };
      // }
    }
  );

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setPage(0);
  }, [instantSearchUiState]);

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: autocompleteContainer.current,
      initialState: { query },
      onReset() {
        setInstantSearchUiState({ query: "" });
      },
      onSubmit({ state }) {
        console.log('state', state);
        router.push(`/search?query=${encodeURIComponent(state.query)}`);

        setInstantSearchUiState({ query: state.query });
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          setInstantSearchUiState({
            query: state.query
          });
        }
      },
      renderer: { createElement, Fragment, render },
      plugins: [querySuggestions]
    });

    return () => autocompleteInstance.destroy();
  }, []);

  return <div className={className} ref={autocompleteContainer} />;
}
