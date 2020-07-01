import React from "react";
import { render } from "react-dom";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";

import { allStitchedSchemas } from "./allStitchedSchemas";

const initApollo = async () => {
  const schema = await allStitchedSchemas([
    "https://swapi.graph.cool/",
    "https://48p1r2roz4.sse.codesandbox.io",
  ]);

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return client;
};

class App extends React.Component {
  state = {
    client: null,
  };

  async UNSAFE_componentWillMount() {
    const client = await initApollo();
    this.setState({ client });
  }

  render() {
    if (!this.state.client) {
      return <div>10...9...8...7...6...5...4...3...2...1</div>;
    }
    return (
      <ApolloProvider client={this.state.client}>
        <h2>🚀🚀 Schema stitched client side 🚀🚀</h2>
        <p>Stitch graphql enpoints with no server</p>
        <Blastoff />
      </ApolloProvider>
    );
  }
}

const Blastoff = () => {
  const { data, loading, error } = useQuery(gql`
    query {
      allFilms {
        title
      }
      rates(currency: "GBP") {
        currency
        rate
      }
    }
  `);

  if (error) console.error(error);
  if (loading) return <div>Blast OFF!!!</div>;

  if (data) {
    return (
      <div>
        <h2>Star Wars flims</h2>
        {data.allFilms?.map(({ title }) => (
          <div key={title}>{title}</div>
        ))}
        <h5>new ones? their is none?</h5>
        <h2>Currency rates agaist GBP</h2>
        {data.rates?.map(({ currency, rate }) => (
          <div key={currency}>
            {currency}: {rate}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

render(<App />, document.getElementById("root"));
