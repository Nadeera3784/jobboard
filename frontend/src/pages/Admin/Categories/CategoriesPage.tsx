import { useState } from 'react';

import { CreateCategoryModal } from './CreateCategoryModal'
import { Table } from '../../../components/Table';
import AppConstants from '../../../constants/AppConstants';

export const CategoriesPage = () => {

    const [refresh, setRefresh] = useState(false);

    const onRefresh = () => {
        setRefresh(!refresh);
    }
    
    return (
        <div className="bg-gray-100">
            <div className="container p-4 lg:p-8">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                        <div className="flex items-center space-x-2">
                            <CreateCategoryModal
                                refresh={onRefresh}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-4 lg:space-y-8">
                    <div className='space-y-4 lg:space-y-8'>
                        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
                            <Table
                                endpoint={`${AppConstants.API_URL}/categories/datatable`}
                                per_page={10}
                                has_row_buttons={true}
                                has_multiselect={false}
                                refresh={refresh}
                                columns={[
                                    {
                                        name: '_id',
                                        label: 'ID',
                                        type: 'text',
                                        orderable: false,
                                        visible: false,
                                    },
                                    {
                                        name: 'name',
                                        label: 'Name',
                                        type: 'text',
                                        orderable: true,
                                        visible: true,
                                    },
                                    {
                                        name: 'created_at',
                                        label: 'Created',
                                        type: 'date',
                                        orderable: true,
                                        visible: true,
                                    },
                                    {
                                        name: 'status',
                                        label: 'Status',
                                        type: 'text',
                                        orderable: true,
                                        visible: true,
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}