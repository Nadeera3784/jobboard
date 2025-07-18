import React, { useState, useEffect } from 'react';
import { ArrowDownAZ, ArrowUpZA, ChevronDownIcon } from 'lucide-react';

import { TextColumn } from './TextColumn';
import { DateColumn } from './DateColumn';
import { LabelColumn } from './LabelColumn';
import { LinkAction } from './LinkAction';
import { DeleteAction } from './DeleteAction';
import { DownloadAction } from './DownloadAction';
import { EmptyContent } from './EmptyContent';
import { ViewAction } from './ViewAction';
import {
  TableProps,
  ColumnProps,
  SortItemProps,
  ActionProps,
} from '../../types';
import { Loader } from './Loader';
import { Pagination } from './Pagination';
import { Checkbox } from '../Form/Checkbox';
import { Input } from '../Form/Input';
import { SingleSelectStaticFilter } from './SingleSelectStaticFilter';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../Dialog/DropdownMenu';
import { Button } from '../Form/Button';
import { DeleteDialog } from './DeleteDialog';
import { httpClient } from '../../utils';

export const Table: React.FC<TableProps> = ({
  endpoint,
  per_page,
  columns,
  has_row_buttons,
  has_multiselect,
  filters = [],
  refresh,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(per_page);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortItemProps[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<{
    [key: string]: boolean;
  }>(Object.fromEntries(columns.map(column => [column.name, true])));
  const [open, setOpen] = useState(false);
  const [modelTitle, setModelTitle] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionProps>();
  const [selectedFilters, setSelectedFilters] = useState({});

  const fetchData = async (
    page = currentPage,
    limit = itemsPerPage,
    order: SortItemProps[] = [],
    keyword = '',
  ) => {
    setLoading(true);
    try {
      const response = await httpClient.post(endpoint, {
        order: order,
        columns: columns.filter(column => columnVisibility[column.name]),
        filters: selectedFilters,
        search: keyword,
        start: (page - 1) * limit,
        limit: limit,
      });
      setData(response.data.data.data);
      setTotalItems(response.data.data.recordsTotal);
    } catch (error) {
      setError('An error occurred while fetching the data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, columnVisibility, selectedFilters, refresh]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.target.value);

    if (event.target.value.length > 0) {
      fetchData(1, itemsPerPage, sort, search);
    } else {
      fetchData(1, itemsPerPage, sort);
    }
  };

  const onClickSort = (column: ColumnProps, key: number, direction: string) => {
    setSort((prevArray: SortItemProps[]) => {
      const existingIndex = prevArray.findIndex(item => item.column === key);
      if (existingIndex > -1) {
        return prevArray.map((item, index) => {
          if (index === existingIndex) {
            return { ...item, dir: direction };
          }
          return item;
        });
      } else {
        return [
          ...prevArray,
          { column: key, dir: direction, name: column.name },
        ];
      }
    });
    fetchData(currentPage, itemsPerPage, sort);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onChangePerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value);
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleCheckAll = () => {
    const allIds = data.map((item: any) => item._id);
    if (selectAllChecked) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIds);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const handleCheckboxChange = (id: string) => {
    const updatedSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(updatedSelectedRows);
    if (updatedSelectedRows.length === data.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  };

  const toggleColumnVisibility = (columnName: string) => {
    setColumnVisibility(prevVisibility => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };

  const onClickDialog = (action: ActionProps) => {
    setOpen(true);
    setModelTitle(action?.confirm_message || 'Are you sure?');
    setSelectedAction(action);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onFilterChange = (value: any) => {
    setSelectedFilters(value);
  };

  const onDownloadComplete = () => {
    fetchData(); // Refresh table after download to update status
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between overflow-auto">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            className="h-8 w-[150px] lg:w-[250px]"
            placeholder="search..."
            onChange={event => onSearch(event)}
            value={search}
          />
          {filters.map((filter, key) => (
            <div key={key}>
              {filter.type === 'singleSelectStatic' && (
                <SingleSelectStaticFilter
                  data={filter}
                  onFilterChange={onFilterChange}
                />
              )}
            </div>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map(
              (column, key) =>
                column.visible && (
                  <DropdownMenuCheckboxItem
                    key={key}
                    className="capitalize"
                    checked={columnVisibility[column.name]}
                    onCheckedChange={() => toggleColumnVisibility(column.name)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 text-slate-700">
                {has_multiselect && (
                  <th
                    className="h-10 px-2 text-left align-middle font-medium text-slate-700"
                    colSpan={1}
                  >
                    <Checkbox
                      checked={selectAllChecked}
                      onCheckedChange={handleCheckAll}
                    />
                  </th>
                )}
                {columns.map(
                  (column, key) =>
                    column.visible &&
                    columnVisibility[column.name] && (
                      <th
                        key={key}
                        className="h-10 px-2 text-left align-middle font-medium text-slate-700"
                        colSpan={1}
                      >
                        <span className="flex items-center space-x-2">
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-md px-3 text-xs -ml-3 h-8"
                            type="button"
                            onClick={() =>
                              onClickSort(
                                column,
                                key,
                                sort.find(item => item.column === key)?.dir !==
                                  'asc'
                                  ? 'asc'
                                  : 'desc',
                              )
                            }
                          >
                            <span>{column.label}</span>
                            {sort.find(item => item.column === key) &&
                              (sort.find(item => item.column === key)?.dir ===
                              'asc' ? (
                                <ArrowUpZA className='className="w-3 h-3 ml-2 -mr-1' />
                              ) : (
                                <ArrowDownAZ className='className="w-3 h-3 ml-2 -mr-1' />
                              ))}
                          </button>
                        </span>
                      </th>
                    ),
                )}
                {has_row_buttons && (
                  <th
                    className="h-10 px-2 text-left align-middle font-medium text-slate-700"
                    colSpan={1}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs -ml-3 h-8 data-[state=open]:bg-accent">
                        <span>Manage</span>
                      </div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading && <Loader />}
              {data &&
                (data as any[]).map((item, key) => (
                  <tr
                    key={key}
                    className="border-b transition-colors hover:bg-gray-100 bg-white"
                  >
                    {has_multiselect && (
                      <td className="p-2 align-middle">
                        <Checkbox
                          value={item._id}
                          checked={selectedRows.includes(item._id)}
                          onCheckedChange={() => handleCheckboxChange(item._id)}
                        />
                      </td>
                    )}
                    {columns.map(
                      column =>
                        column.visible &&
                        columnVisibility[column.name] && (
                          <td key={column.name} className="p-2 align-middle">
                            {column.type === 'text' && (
                              <TextColumn
                                text={item[column.name]}
                                width={column?.width || ''}
                              />
                            )}
                            {column.type === 'date' && (
                              <DateColumn data={item[column.name]} />
                            )}
                            {column.type === 'label' && (
                              <LabelColumn text={item[column.name]} />
                            )}
                          </td>
                        ),
                    )}
                    {item?.actions && (
                      <td className="p-2 align-middle">
                        {item.actions.map(
                          (
                            action: ActionProps,
                            index: React.Key | null | undefined,
                          ) => (
                            <span key={index} className="px-1">
                              {action.type === 'link' && (
                                <LinkAction data={action} />
                              )}
                              {action.type === 'view' && (
                                <ViewAction data={action} />
                              )}
                              {action.type === 'delete' && (
                                <DeleteAction
                                  data={action}
                                  onClickOpenDialog={() =>
                                    onClickDialog(action)
                                  }
                                />
                              )}
                              {action.type === 'download' && (
                                <DownloadAction
                                  data={action}
                                  onDownloadComplete={onDownloadComplete}
                                />
                              )}
                            </span>
                          ),
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              {data.length == 0 && !loading && <EmptyContent error={error} />}
            </tbody>
          </table>

          <DeleteDialog
            open={open}
            modelTitle={modelTitle}
            onClose={handleClose}
            action={selectedAction}
            loading={loading}
            refresh={fetchData}
          />
        </div>
      </div>
      <Pagination
        current_page={currentPage}
        total_pages={totalPages}
        selected_row_count={selectedRows.length}
        total_row_count={data.length}
        onChangePerPage={onChangePerPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
