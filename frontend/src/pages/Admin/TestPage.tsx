import { Table } from '../../components/Table/Table';

export const TestPage = () => {
    return (
        <div>
        <Table
         endpoint='http://127.0.0.1:3000/api/v1/categories/datatable'
         per_page={10}
         has_row_buttons={true}
         columns={[
          {
            name : '_id',
            label: 'ID',
            type: 'text',
            orderable: false,
            visible: false,
         },
         {
           name : 'name',
           label: 'Name',
           type: 'text',
           orderable: true,
           visible: true,
        },
         {
           name : 'created_at',
           label: 'Created',
           type: 'date',
           orderable: true,
           visible: true,
         },
         {
           name : 'status',
           label: 'Status',
           type: 'text',
           orderable: true,
           visible: true,
         }
         ]}
        />
        </div>
    )
}