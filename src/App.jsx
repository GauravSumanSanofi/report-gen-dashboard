import React, { useState, useEffect } from "react";

function App() {
  const [appDetailsList, setAppDetailsList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [env, setEnv] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [appData, setAppData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const appDateTimeListApi =
    "https://c761dacbe41623daaa4901e8f5-integration.eu-west-1.cloud.tibcoapps.com:443/2gsbpxfiio6ixlntfl2vsavgtid6g4y6/Resource/getReportList";
  const appDetailsApi = `https://c761dacbe41623daaa4901e8f5-integration.eu-west-1.cloud.tibcoapps.com:443/2gsbpxfiio6ixlntfl2vsavgtid6g4y6/Resource/getReport?report_type=${env}&timestamp=${dateTime}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(appDateTimeListApi);
        const data = await response.json();
        setAppDetailsList(data.ReportList.Report);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchAppDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(appDetailsApi);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const htmlData = await response.text();
      setAppData(htmlData);
    } catch (err) {
      setError(err.message);
    }
     finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fetchAppDetails();
  };

  return (
    <div>
      <div className="justify-center flex inline-block mt-5 p-5">
        <div>
          <label className="font-bold mr-1">Select Report:</label>
          <select
            className="border-solid border-2 border-gray-400 rounded-lg px-2"
            onChange={(e) => {
              setEnv(e.target.value);
              const filteredList = appDetailsList.filter(
                (obj) => obj.Report_Type === e.target.value
              );
              setFilterData(filteredList);
            }}
          >
            <option>Select</option>
            <option value="TCI">TCI</option>
            <option value="TCM">TCM</option>
            <option value="S3">S3</option>
            <option value="TCI-UTLIZATION">TCI-UTLIZATION</option>
          </select>
        </div>
        {
          <div className="ml-3">
            <label className="font-bold mr-1">Select TimeStamp:</label>
            <select
              className="border-solid border-2 border-gray-400 rounded-lg px-2"
              id="app-details"
              onChange={(e) => setDateTime(e.target.value)}
            >
              <option value="">-- Select --</option>
              {filterData.map((option) => (
                <option key={option.TimeStamp} value={option.TimeStamp}>
                  {option.TimeStamp}
                </option>
              ))}
            </select>
          </div>
        }
        <div className="btn">
          <button
            className="rounded-full px-4 py-1 bg-gradient-to-r from-gray-500 via-grey-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium  text-sm   text-center ml-2 text-white"
            onClick={handleClick}
          >
            submit
          </button>
        </div>
      </div>

      {console.log(appDetailsApi)}
      <div class="flex min-h-screen justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          {isLoading && (
            <div class="w-10 h-10 border-b-2 border-blue-600 rounded-full animate-spin mx-auto mb-5"></div>
          )}
          {error && <p class="text-center text-red-500">Error: {error}</p>}
          {appData && <div dangerouslySetInnerHTML={{ __html: appData }} />}
        </div>
      </div>
    </div>
  );
}

export default App;
