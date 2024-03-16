import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDownAZ, ArrowUpZA } from 'lucide-react';

import { TextColumn } from './TextColumn';
import { DateColumn } from './DateColumn';
import { LinkAction } from './LinkAction';
import { DeleteAction } from './DeleteAction';
import { EmptyContent } from './EmptyContent';
import { TableProps, TableColumn, SortItem , Action} from '../../types';
import { Loader } from './Loader';
import { Pagination } from './Pagination';

export const Table: React.FC<TableProps> = ({ endpoint, per_page, columns, has_row_buttons, has_multiselect }) => {

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
            return { ...item, dir: direction };
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

  const onChangePerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value);
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className='space-y-4 lg:space-y-8'>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <input
                className="flex rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 w-[150px] lg:w-[250px]"
                placeholder="search..."
                onChange={(event) => onSearch(event)} value={search}
              />
            </div>
            <button
              className="items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs ml-auto hidden h-8 lg:flex"
              type="button"
              id="radix-:r3v:"
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
                className="mr-2 h-4 w-4"
              >
                <path
                  d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              View
            </button>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className='w-full caption-bottom text-sm'>
                <thead className='[&_tr]:border-b'>
                  <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>

                    {has_multiselect &&
                      <th
                        className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                        colSpan={1}
                      >
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground translate-y-[2px]"
                          aria-label="Select all"
                        />
                      </th>
                    }

                    {columns.map((column, key) => (
                      column.visible == true && (
                        <th key={key} className='h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]' colSpan={1}>
                          <div className='flex items-center space-x-2'>
                            <button
                              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs -ml-3 h-8 data-[state=open]:bg-accent"
                              type="button"
                              onClick={() => onClickSort(column, key, sort.find(item => item.column === key)?.dir !== 'asc' ? 'asc' : 'desc')}
                            >
                              <span>{column.label}</span>
                              {sort.find(item => item.column === key) && (
                                sort.find(item => item.column === key)?.dir === 'asc' ? <ArrowUpZA className='className="w-3 h-3 ml-2 -mr-1' /> : <ArrowDownAZ className='className="w-3 h-3 ml-2 -mr-1' />
                              )}
                            </button>
                          </div>
                        </th>
                      )
                    ))}
                    {has_row_buttons &&
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
                    }
                  </tr>
                </thead>
                <tbody className='[&_tr:last-child]:border-0'>
                  {loading && (
                    <Loader />
                  )}
                  {data && (data as any[]).map((item, key) => (
                    <tr key={key} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      {has_multiselect &&
                        <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked="false"
                            data-state="unchecked"
                            value="on"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground translate-y-[2px]"
                            aria-label="Select row"
                          />
                        </td>
                      }
                      {columns.map((column) => (
                        column.visible && (
                          <td key={column.name} className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                            {column.type === 'text' && <TextColumn data={item[column.name]} />}
                            {column.type === 'date' && <DateColumn data={item[column.name]} />}
                          </td>
                        )
                      ))}
                      {item?.actions &&
                        <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                         {item.actions.map((action: Action, index: React.Key | null | undefined) => (
                            <span key={index} className='px-1'>
                              {action.type === 'link' && <LinkAction name={action.label} link=''/>}
                              {action.type === 'delete' && <DeleteAction name={action.label} link=''/>}
                            </span>
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
            </div>
          </div>
           <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onChangePerPage={onChangePerPage} 
            handlePageChange={handlePageChange}           
           />
        </div>
      </div>
    </div>
  )
}