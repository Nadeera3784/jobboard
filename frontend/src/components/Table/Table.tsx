import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextColumn } from './TextColumn';
import { DateColumn } from './DateColumn';
import { EmptyContent } from './EmptyContent';
import { TableProps, TableColumn, SortItem } from '../../types';


export const Table: React.FC<TableProps> = ({ endpoint, per_page, columns }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(per_page);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortItem[]>([]);

  const fetchData = async (page = currentPage, limit = itemsPerPage, order = [], keyword = '') => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint, {
        order: order,
        columns: columns,
        status: '',
        daterange: '',
        search: { value: keyword },
        start: (page - 1) * limit,
        length: limit,
        draw: currentPage,
      });
      setData(response.data.data.data);
      setTotalItems(response.data.data.recordsTotal);
    } catch (error) {
      setError('An error occurred while fetching the data');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (event: any) => {
    event.preventDefault();
    setSearch(event.target.value);

    if (event.target.value.length > 0) {
      fetchData(1, itemsPerPage, sort, search);
    } else {
      fetchData(1, itemsPerPage, sort);
    }
  };

  const onClickSort = (column: TableColumn, key: number, direction: string) => {
    setSort((prevArray: SortItem[]) => {
      const existingIndex = prevArray.findIndex(item => item.column === key);
      if (existingIndex > -1) {
        return prevArray.map((item, index) => {
          if (index === existingIndex) {
            return { ...item, dir: direction }; // Update only the direction of the existing item
          }
          return item;
        });
      } else {
        return [...prevArray, { column: key, dir: direction, name: column.name }];
      }
    });
    fetchData(currentPage, itemsPerPage, sort);
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };


  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <input type="text" placeholder='search...' onChange={(event) => onSearch(event)} value={search} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />

      <br />

      <table>
        <thead>
          <tr>
            {columns.map((column, key) => (
              column.visible == true && (
                <th key={key}>
                  <div>
                    {column.label}
                    <span onClick={() => onClickSort(column, key, 'asc')}>
                      Up
                    </span>
                    <span onClick={() => onClickSort(column, key, 'desc')}>
                      Down
                    </span>
                  </div>
                </th>
              )
            ))}
          </tr>
        </thead>
        <tbody>

        { loading && (
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

          {data && data.map((item, key) => (
            <tr key={key}>
              {columns.map((column) => (
                column.visible && (
                  <td key={column.name}>
                    {column.type === 'text' && <TextColumn data={item[column.name]} />}
                    {column.type === 'date' && <DateColumn data={item[column.name]} />}
                  </td>
                )
              ))}
            </tr>
           ))}

          { data.length == 0 && !loading && 
            <EmptyContent/>
          }

        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => handlePageChange(page)} disabled={currentPage === page}>
            {page}
          </button>
        ))}
        <br />
        Page {currentPage} of {totalItems}
      </div>
    </div>
  )
}