import { useState, useEffect } from 'react';

function DataTableComponent() {
    const [data, setData] = useState<[]>([]);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<string>('asc');
    const [filterValue, setFilterValue] = useState<string>('');
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

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