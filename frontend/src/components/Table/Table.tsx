import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextColumn } from './TextColumn';
import { DateColumn } from './DateColumn';
import { EmptyContent } from './EmptyContent';
import { TableProps, TableColumn, SortItem } from '../../types';
import { Loader } from './Loader';

const SortAscIcon = () => (
  <svg className="w-4 h-4 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"></path>
  </svg>
);

const SortDescIcon = () => (
  <svg className="w-4 h-4 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
  </svg>
);

export const Table: React.FC<TableProps> = ({ endpoint, per_page, columns }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(per_page);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortItem[]>([]);

  const fetchData = async (page = currentPage, limit = itemsPerPage, order: SortItem[] = [], keyword = '') => {
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <input type="text" placeholder='search...' onChange={(event) => onSearch(event)} value={search} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />

      <br />

      <table className='w-full text-sm text-left text-black'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            {columns.map((column, key) => (
              column.visible == true && (
                <th key={key} className='px-6 py-3'>
                  <div className="flex items-center justify-start cursor-pointer" onClick={() => onClickSort(column, key, sort.find(item => item.column === key)?.dir !== 'asc' ? 'asc' : 'desc')}>
                    {column.label}
                    {sort.find(item => item.column === key) && (
                      sort.find(item => item.column === key)?.dir === 'asc' ? <SortAscIcon /> : <SortDescIcon />
                    )}
                  </div>
                </th>
              )
            ))}
          </tr>
        </thead>
        <tbody>

          {loading && (
            <Loader />
          )}

          {data && data.map((item, key) => (
            <tr key={key} className="bg-white border-b">
              {columns.map((column) => (
                column.visible && (
                  <td key={column.name} className='class="px-6 py-4"'>
                    {column.type === 'text' && <TextColumn data={item[column.name]} />}
                    {column.type === 'date' && <DateColumn data={item[column.name]} />}
                  </td>
                )
              ))}
            </tr>
          ))}

          {data.length == 0 && !loading &&
            <EmptyContent error={error} />
          }

        </tbody>
      </table>
      <div>
        <div className="flex flex-row items-center justify-center space-x-1 mt-4">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white"
            >
              Prev
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page}
              className={`px-4 py-2 rounded-md ${currentPage === page ? 'text-white bg-blue-500' : 'text-gray-700 bg-white hover:bg-blue-500 hover:text-white'}`}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-gray-700 bg-white rounded-md hover:bg-blue-500 hover:text-white"
            >
              Next
            </button>
          )}
          <span className="ml-4">Page {currentPage} of {totalPages}</span>
          {/* Page {currentPage} of {totalItems} */}
        </div>
      </div>
    </div>
  )
}