import React, { useState } from "react"
import useSWR, { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json());

const App = () => {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, fetcher }}>
      <Crimes />
    </SWRConfig>
  );
}

function Crimes() {
  const url = 'https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10';
  const { data, error } = useSWR(url)
  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  return <DisplayCrimes crimes={data} categories={[...new Set(data.map(crime => crime.category))]} />
}

function DisplayCrimes({crimes, categories}) {

  const [filterCategory, setFilerCategory] = useState(null);

  const filteredCrimes = filterCategory ? crimes.filter(crime => crime.category === filterCategory) : crimes

  return (
    <>
      {categories.map(category => (
        <button
          onClick={() => setFilerCategory(category)}
          key={category}
        >
          {category}
        </button>
      ))}

      {filterCategory && <button onClick={() => setFilerCategory(null)}>Reset</button>}

      <pre>{JSON.stringify(filteredCrimes, null, 2)}</pre>
    </>
  )
}

export default App;