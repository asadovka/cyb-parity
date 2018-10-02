import React, { Component } from 'react';
import axios from 'axios';

import {
  Legend,
  SearchForm,
  AppPrefix
} from '../components/SearchBox/SearchBox'

// import { bytesToSize, nFormatter } from '../../utils/format'

class SearchBox extends Component {

  constructor(props) {
      super(props);

      this.state = {
        transactionsCount: 1441341424,
        blockchains: 2,
          tokensCount: 0,
        indexSizeBytes: 547722617454,
      }
    }

    // componentDidMount() {
    //   axios.get('http://api.cybersearch.io/search/stats')
    //   .then(response => {
    //     this.setState({
    //       transactionsCount: response.data.transactionsCount,
    //       blockchains: response.data.blockchains,
    //       indexSizeBytes: response.data.indexSizeBytes
    //     })
    //   })

    //   axios.get('http://api.cybermarkets.io/exchanges/tokens/count')
    //     .then(response => {
    //       this.setState({
    //         tokensCount: response.data
    //       })
    //     })
    // }

  render() {

    const {
      transactionsCount,
      blockchains,
      tokensCount,
      indexSizeBytes
    } = this.state

    const {
      app,
      inputText,
      onSearch,
      inputRef
    } = this.props;

    return (
      <div>
            <div style={{ display: 'flex'}}>

            <SearchForm
              defaultValue={inputText}
              onSubmit={onSearch}
              inputRef={inputRef}
            />
          {/*app && <AppPrefix>{app}</AppPrefix>*/}
            {/*</div>
                  <Legend>
                     Search in <strong>{nFormatter(transactionsCount, 1)}</strong>&nbsp; transactions in <strong>{blockchains}</strong>&nbsp;
                     blockchains with <strong>{tokensCount}</strong> parsed tokens. Database size: <strong>{bytesToSize(indexSizeBytes)}</strong>
                  </Legend>*/}
            </div>
      </div>
      );
  }

}

export default SearchBox;
