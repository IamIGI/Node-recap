import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';
import './App.css';

function App() {
  const fetcher = createGraphiQLFetcher({
    url: 'http://localhost:8080/graphql',
  });

  return <GraphiQL fetcher={fetcher} />;
}

export default App;
