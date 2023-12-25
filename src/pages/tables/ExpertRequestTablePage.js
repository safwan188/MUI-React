import React, { useState, useEffect } from 'react';
import { Box, Fab, Tooltip, Badge, IconButton } from '@mui/material';
import Sidebar from '../../components/layout/Sidebar';
import theme from '../../theme';
import BasicDataTable from '../../components/dataTables/BasicDataTable';
import DataToolbar from '../../components/common/DataToolbar';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import ExpertRequestService from '../../api/ExpertRequestService';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Icon from '@mui/material/Icon'; // Import Icon component

const ExpertRequestTablePage = () => {
  const navigate = useNavigate();
  const [expertRequests, setExpertRequests] = useState([]);
  const [queryObject, setQueryObject] = useState({
    startDate: null,
    endDate: null,
    column: '',
    textQuery: '',
  });

  useEffect(() => {
    ExpertRequestService.getAllExpertRequests()
      .then(response => {
        setExpertRequests(response.data.map(request => ({
          ...request,
          date: formatDate(request.date),
          createdAt: formatDate(request.createdAt),
          expertName: request.expert ? request.expert.name : 'אין',
          // Assuming customer name and property city name are nested within the 'report' object
          customerName: request.report?.customer?.name || 'N/A',
          propertyCityName: request.report?.property?.cityName || 'N/A',
          propertyStreetName: request.report?.property?.street || 'N/A',
          propertyHouseNumber: request.report?.property?.propertyNumber || 'N/A',
          reportindex: request.report?.index || 'N/A',
          status: request.status || 'N/A',

        })));
      })
      .catch(error => console.error('Error fetching expert requests:', error));
  }, []);
  
  const handleAddNew = () => {
    navigate('/add-expert-request');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  const handleApprove = (row) => {
    ExpertRequestService.updateExpertRequest(row._id, { status: 'accepted', })
      .then(() => {
       
      })  
      .catch(error => {
        console.error('Error updating expert request:', error);
      } 
      );
  };
  const handleReject = (row) => {
    ExpertRequestService.updateExpertRequest(row._id, { status: 'rejected' })
      .then(() => {

      })
      .catch(error => {
        console.error('Error updating expert request:', error);
      }
      );
  };
  const renderActionButtons = (row) => {
  
      switch (row.status) {
          case 'pending':
            return (
              <>
                <Tooltip title="אשר בקשה">
                  <IconButton onClick={() => handleApprove(row)}>
                  <CheckCircleIcon style={{ color: 'green' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="דחה בקשה">
                  <IconButton onClick={() => handleReject(row)}>
                  <HighlightOffIcon style={{ color: 'red' }} />
                  </IconButton>
                </Tooltip>
              </>
            );
        case 'accepted':
          return (
            <Tooltip title="בקשה אושרה">
              <Fab color="primary" size="small" disabled>
              </Fab>
            </Tooltip>
          );
    
          };
   
  };

  
 
  const getStatusIcon = (status) => {
    const badgeStyle = { padding: '0 10px'};
  
    switch (status) {
      case 'pending':
        return (
          <Tooltip title="ממתין תשובה">
        <Badge badgeContent="" color="warning" ></Badge>;
        </Tooltip>
        );
      case 'accepted':
        return(
           <Tooltip title="בקשה אושרה">
           <Badge badgeContent="" color="success"></Badge>;
            </Tooltip>
        );
      case 'rejected':
        return (
          <Tooltip title="בקשה נדחתה">
          <Badge badgeContent="" color="error"></Badge>;
          </Tooltip>
        );
        
    }
  };

  
  const renderCell = (columnLabel, cellValue, row) => {
    switch (columnLabel) {
      case 'index':
        return row.reportindex;
      case 'שם טכנאי':
        return row.expertName;
        case 'שם לקוח':
        return row.customerName;
      case 'תאריך ביקור':
        return row.date;
case 'כתובת':
        return row.propertyCityName + ', ' + row.propertyStreetName + ', ' + row.propertyHouseNumber;
      case 'תאריך פתיחת בקשה':
        return row.createdAt;
      case 'Status':
        return getStatusIcon(row.status);
      default:
        return cellValue;
    }
  };

   const filteredExpertRequests = expertRequests.filter(request => {
    let isDateInRange = true;
    let doesColumnMatch = true;

    // Date range filtering
    if (queryObject.startDate && queryObject.endDate) {
      const requestDate = new Date(request.date);
      const startDate = new Date(queryObject.startDate);
      const endDate = new Date(queryObject.endDate);
      isDateInRange = requestDate >= startDate && requestDate <= endDate;
    }

    // Column-based text search filtering
    if (queryObject.column && queryObject.textQuery) {
      let cellValue = '';
      switch (queryObject.column) {
        case 'expertName':
          cellValue = request.expertName ? request.expertName.toLowerCase() : '';
          break;
        case 'customerName':
          cellValue = request.customerName ? request.customerName.toLowerCase() : '';
          break;
        case 'status':
          cellValue = request.status ? request.status.toLowerCase() : '';
          break;
        case '_id':
          cellValue = request._id ? request._id.toLowerCase() : '';
          break;
        default:
          cellValue = request[queryObject.column]?.toString().toLowerCase() || '';
          break;
      }
      doesColumnMatch = cellValue.includes(queryObject.textQuery.toLowerCase());
    }

    return isDateInRange && doesColumnMatch;
  });


  return (
    <Box sx={{ display: 'flex', bgcolor: theme.palette.background.default }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DataToolbar
          title="בקשות קבלנים"
          menuItems={[
            { label: 'reportindex', value: 'reportindex' },
            { label: 'שם טכנאי', value: 'expertName' },
            { label: 'שם לקוח', value: 'customerName' },
            { label: 'כתובת', value: 'propertyCityName' + ' ' + 'propertyStreetName' + ' ' + 'propertyHouseNumber'},
            
            { label: 'תאריך ביקור', value: 'date' },
            { label: 'סטטוס', value: 'status' },
          { label: 'תאריך פתיחת בקשה', value: 'createdAt' }
          ]}
          onAddNewClick={handleAddNew}
          selectedColumn={queryObject.column}
          includeDateRange={true}
          onSearchChange={setQueryObject}
          onColumnChange={column => setQueryObject({ ...queryObject, column })}
        />
        <BasicDataTable
          renderActionButtons={renderActionButtons}
          getStatusIcon={getStatusIcon}
          data={filteredExpertRequests}
          columns={[
            { label: 'reportindex', value: 'reportindex' },
            { label: 'שם טכנאי', value: 'expertName' },
            { label: 'שם לקוח', value: 'customerName' },
            { label: 'כתובת', value: 'propertyCityName' + ' ' + 'propertyStreetName' + ' ' + 'propertyHouseNumber'},
            
            { label: 'תאריך ביקור', value: 'date' },
            { label: 'סטטוס', value: 'status' },
          { label: 'תאריך פתיחת בקשה', value: 'createdAt' }
          ]}
          renderCell={renderCell}
          onAddNewClick={handleAddNew}
        />
      </Box>
    </Box>
  );
};

export default ExpertRequestTablePage;
