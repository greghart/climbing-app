import * as React from 'react';
import filter = require('lodash/filter');

import Crag from '../../../models/Crag';
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';
import getSearchableEntitiesForCrag from './getSearchableEntitiesForCrag';

const _labelMatchesSearch = (label, search = '') => {
  const _label = label.toLowerCase().trim();
  const _search = search.toLowerCase().trim();
  console.log({
    _label,
    _search,
    test: _label.indexOf(_search) !== -1
  })
  return _label.indexOf(_search) !== -1;
};

interface Props {
  search: string;
  crag: Crag;
}
const SearchResults = (props) => {
  const results = filter(
    getSearchableEntitiesForCrag(props.crag),
    (thisEntity: Area | Boulder | Route) => {
      return _labelMatchesSearch(
        thisEntity.name,
        props.search
      )
    }
  )
  console.warn({ 
    props,
    results
  }, 'SearchResults');
  return (
    <ul className="list-group">
      {results.map((thisResult) => {
        return (
          <li className="list-group-item list-group-item-action">
            {thisResult.name}
          </li>
        );
      })}
    </ul>
  )
}

export default SearchResults;
