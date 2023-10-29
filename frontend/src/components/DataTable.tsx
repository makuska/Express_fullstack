import {useState, useEffect} from 'react';

function DataTableComponent() {
    const [data, setData] = useState<[]>([]);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<string>('asc');
    const [filterValue, setFilterValue] = useState<string>('');
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [isWebsocketButtonDisabled, setIsWebsocketButtonDisabled] = useState<boolean>(false)

    function handleWebsocket() {
        setIsWebsocketButtonDisabled(true)

        const websocket = new WebSocket('ws://localhost:8001')
        websocket.addEventListener('open', (event: Event) => {
            console.log('WebSocket connection established:', event)
            websocket.send("Requesting web scraper data")
        })

         websocket.addEventListener('message', async (event: MessageEvent<any>) => {
            console.log(event.data);
            // TODO this should close only if the server fails to, so timeout maybe?
            // websocket.close(1000, "Work complete, connection closed")
        })

        websocket.addEventListener('close', (event: CloseEvent) => {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                console.log("Connection event: ", event)
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console.log('[close] Connection died, event:', event);
            }
            setIsWebsocketButtonDisabled(false)
        })

        websocket.addEventListener('error', (event: Event) => {
            console.error('WebSocket error:', event);
            setIsWebsocketButtonDisabled(false)
        })
    }

    useEffect(() => {
        async function fetchData(): Promise<void> {
            const response: Response = await fetch('https://dummyjson.com/users?limit=29');
            const json = await response.json();
            setData(json);
            setIsDataLoaded(!isDataLoaded)
        }

        fetchData()
    }, []);

    const sortData = (column: any) => {
        const direction: "asc"|"desc" = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        const sortedData = [...data].sort((a, b) => {
            if (a[column] < b[column]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        // @ts-ignore
        setData(sortedData);
        setSortColumn(column);
        setSortDirection(direction);
    };

    const filterData = (value: any) => {
        // @ts-ignore
        const filteredData = data.users.filter((item) => {
            return (
                item.column1.toLowerCase().includes(value.toLowerCase()) ||
                item.column2.toLowerCase().includes(value.toLowerCase()) ||
                item.column3.toLowerCase().includes(value.toLowerCase())
            );
        });
        setData(filteredData);
        setFilterValue(value);
    };


    return (
        <div className="data-table">
            <button
                disabled={isWebsocketButtonDisabled}
                onClick={handleWebsocket}
                className="input-button"
            >Test Websocket</button>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filterValue}
                    onChange={(e) => filterData(e.target.value)}
                />
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th onClick={() => sortData('column1')}>ID</th>
                        <th onClick={() => sortData('column2')}>FIRST NAME</th>
                        <th onClick={() => sortData('column3')}>LAST NAME</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*@ts-ignore*/}
                    {isDataLoaded && data.users.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default DataTableComponent;