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

export const Table: React.FC<TableProps> = ({ endpoint, per_page, columns, has_row_buttons}) => {

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
            {has_row_buttons &&
             <th  className='px-6 py-3'>
              <div className="flex items-center justify-start">
                Manage
              </div>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          {loading && (
            <Loader />
          )}
          {data && (data as any[]).map((item, key) => (
            <tr key={key} className="bg-white border-b">
              {columns.map((column) => (
                column.visible && (
                  <td key={column.name} className="px-6 py-4">
                    {column.type === 'text' && <TextColumn data={item[column.name]} />}
                    {column.type === 'date' && <DateColumn data={item[column.name]} />}
                  </td>
                )
              ))}
              {item?.actions &&
                <td className="px-6 py-4">
                  {item.actions.map((action: { label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => ( 
                    <span key={index}>{action.label}</span> 
                  ))}
                </td>
              }
            </tr>
          ))}
          {data.length == 0 && !loading &&
            <EmptyContent error={error} />
          }
        </tbody>
      </table>


      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
              colSpan={1}
            >
              <div className="">Task</div>
            </th>
            <th
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
              colSpan={1}
            >
              <div className="flex items-center space-x-2">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs -ml-3 h-8 data-[state=open]:bg-accent"
                  type="button"
                  id="radix-:r41:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                >
                  <span>Title</span>
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                  >
                    <path
                      d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </th>
            <th
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
              colSpan={1}
            >
              <div className="flex items-center space-x-2">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs -ml-3 h-8 data-[state=open]:bg-accent"
                  type="button"
                  id="radix-:r43:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                >
                  <span>Status</span>
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                  >
                    <path
                      d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </th>
            <th
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
              colSpan={1}
            >
              <div className="flex items-center space-x-2">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs -ml-3 h-8 data-[state=open]:bg-accent"
                  type="button"
                  id="radix-:r45:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                >
                  <span>Priority</span>
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                  >
                    <path
                      d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </th>
            <th
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
              colSpan={1}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs -ml-3 h-8 data-[state=open]:bg-accent"
                >
                  <span>Manage</span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          <tr
            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            data-state="false"
          >
    
            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
              <div className="w-[80px]">TASK-8782</div>
            </td>
            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
             <div className="flex w-[100px] items-center">
                <span>Title</span>
              </div>
            </td>
            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
              <div className="flex w-[100px] items-center">
                <span>In Progress</span>
              </div>
            </td>
            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
              <div className="flex items-center">
                <span>Medium</span>
              </div>
            </td>
            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
              <button
                className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                type="button"
                id="radix-:r5l:"
                aria-haspopup="menu"
                aria-expanded="false"
                data-state="closed"
              >
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Open menu</span>
              </button>
            </td>
          </tr>
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