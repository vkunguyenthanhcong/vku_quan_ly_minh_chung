// src/components/MainContent.js
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import './MainContent.css'
import { getKdclData , getCtdtData} from '../apiServices'

const MainContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'STT',
        accessor: (_, index) => index + 1 // Row index
      },
      {
        Header: 'Tên Chuẩn đánh giá',
        accessor: 'tenKdcl'
      },
      {
        Header: 'Năm áp dụng',
        accessor: 'namBanHanh'
      },
      {
        Header: 'Tên CTĐT',
        accessor: 'tenCtdt',
        Cell: ({ value }) => (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {value.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <button onClick={() => alert(`Button clicked for ${item}`)} className='btn-color btn'>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )
      }
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API services
        const [kdclResponse, ctdtResponse] = await Promise.all([
          getKdclData(),
          getCtdtData(),
        ]);

        const kdclData = kdclResponse;
        const ctdtData = ctdtResponse;

        // Ensure ctdtData is an object with arrays
        if (typeof ctdtData !== 'object') {
          throw new Error('Invalid ctdtData format');
        }

        // Combine the data
        const combinedData = kdclData.map(item => ({
          ...item,
          tenCtdt: (ctdtData[item.maKdcl] || []).map(ctdt => ctdt.tenCtdt || 'No Data') 
        }));

        setData(combinedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const Table = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      columns,
      data
    });

    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
                    {cell.column.id === 'ten' ? (
                      <ul>
                        {cell.value.map((item, index) => (
                          <li key={index}><a href={`/chuongtrinhdaotao?ctdt=${index}`} className='btn-color btn'>{item}</a></li>
                        ))}
                      </ul>
                    ) : (
                      cell.render('Cell')
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };


  return (
    <div className="content" style={{ background: "white", margin: '20px' }}>
      <p style={{ fontSize: '20px' }}>DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
      <hr />
      <Table columns={columns} data={data} />
    </div>
  );
};

export default MainContent;
