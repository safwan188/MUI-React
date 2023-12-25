import React, { useState, useEffect } from 'react';
import BasicDataTable from '../../components/dataTables/BasicDataTable';
import { Box,Fab ,Tooltip,Badge} from '@mui/material';
import Sidebar from '../../components/layout/Sidebar';
import theme from '../../theme';
import ReportService from '../../api/ReportService';
import { useNavigate } from 'react-router-dom';
import ReportEditForm from '../../components/forms/ReportEditForm';
import EditDialog from '../../components/common/EditDialog';
import ExpertService from '../../api/ExpertService';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignExpertDialog from '../../components/common/AssignExpertDialog';
import DataToolbar from '../../components/common/DataToolbar';
import EditIcon from '@mui/icons-material/Edit';
const ReportTablePage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [experts, setExperts] = useState([]); // State for storing experts
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [assignmentCompleted, setAssignmentCompleted] = useState(false);

  const handleOpenAssignModal = (report) => {
    setSelectedReport(report);
    console.log(report);
setAssignModalOpen(true);
 
  };
  useEffect(() => {
    if (assignmentCompleted) {
      fetchReports(); // Your function to fetch reports
      setAssignmentCompleted(false); // Reset the flag
    }
  }, [assignmentCompleted]);
  const handleAssign = (expert, date, report) => {
    // Logic to assign the expert to the report
    console.log(expert, date, report);
  };
  const [queryObject, setQueryObject] = useState({
    startDate: null,
    endDate: null,
    column: '',
    textQuery: '',
  });
  
  const handleSearchChange = (newQuery) => {
    setQueryObject({ ...queryObject, ...newQuery });
  };
  
  const handleColumnChange = (column) => {
    setQueryObject({ ...queryObject, column });
  };
  useEffect(() => {
    ReportService.getAllReports()
      .then(response => {
        // First, sort the reports by createdAt date in descending order (newest first)
        const sortedReports = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        // Then, format the createdAt dates
        const formattedReports = sortedReports.map(report => ({
          ...report,
          createdAt: formatDate(report.createdAt)
        }));
          setReports(formattedReports); // Set the state with formatted reports
      })
      .catch(error => {
        console.error('Error fetching reports:', error);
      });
  }, []);
useEffect(() => {
    ExpertService.getAllExperts()
      .then(response => {
        // Update state with fetched experts
        setExperts(response.data); // Assuming response.data.experts is the array of experts
      })
      .catch(error => {
        console.error('Error fetching experts:', error);
      });
  }, []);
  
const fetchReports = async () => {
    try {
      const response = await ReportService.getAllReports();
      const sortedReports = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const formattedReports = sortedReports.map(report => ({
        ...report,
        createdAt: formatDate(report.createdAt)
      }));
      setReports(formattedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };
  const handleAddNew = () => {
    navigate('/add-report');
  }

  const formatDate = (dateString) => {
    // Check if dateString is already in DD-MM-YYYY format
    const alreadyFormatted = /^\d{2}-\d{2}-\d{4}$/.test(dateString);
    console.log(dateString)
    if (alreadyFormatted) return dateString;
  
    if (!dateString) return 'Date not set'; // Placeholder for undefined or null dates
  
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date1'; // Check for invalid date
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
  };
  const convertToDateObject = (dateString) => {
    const parts = dateString.split('-');
    // Convert DD-MM-YYYY to MM-DD-YYYY
    return new Date(`${parts[1]}-${parts[0]}-${parts[2]}`);
  };
  const handleEdit = async (report) => {
    try {
      const reprotwithphoto = await ReportService.getReportById(report._id);
        console.log(reprotwithphoto.data);
      navigate(`/reportedit/${report._id}`);
    } catch (error) {
      console.error('Error fetching report by ID:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    let isDateInRange = true;
    if (queryObject.startDate && queryObject.endDate) {
      const reportDate = convertToDateObject(report.createdAt);
      const startDate = convertToDateObject(queryObject.startDate);
      const endDate = convertToDateObject(queryObject.endDate);
      
      isDateInRange = reportDate >= startDate && reportDate <= endDate;
    }
  
    let doesColumnMatch = true;
    if (queryObject.column && queryObject.column !== 'createdAt' && queryObject.textQuery) {
      let cellValue;
      switch (queryObject.column) {
        case 'customer.name':
          cellValue = report.customer ? report.customer.name.toLowerCase() : '';
          break;
        case 'address':
          cellValue = report.property ? `${report.property.cityName}, ${report.property.street}, ${report.property.propertyNumber}` : '';
          break;
        case 'expertName':
          cellValue = report.expert ? report.expert.name.toLowerCase() : '';
          break;
        default:
          cellValue = report[queryObject.column]?.toString().toLowerCase() || '';
          break;
      }
      doesColumnMatch = cellValue.includes(queryObject.textQuery.toLowerCase());
    }
  
    return isDateInRange && doesColumnMatch;
  });
  
  const renderActionButtons = (report) => {
    return (
      <>
        <Tooltip title="Edit">
          <Fab size="small" color="primary" aria-label="edit" onClick={() => handleEdit(report)}>
            <EditIcon />
          </Fab>
        </Tooltip>
     </>
    );
  };

  
 
  const getStatusIcon = (status) => {
    const badgeStyle = { display: 'flex', alignItems: 'center' };
  
    switch (status) {
      case 'assigned':
        return <Badge badgeContent="Assigned" color="warning"></Badge>;
      case 'completed':
        return <Badge badgeContent="Completed" color="success"></Badge>;
      case 'open':
        return <Badge badgeContent="Open" color="info"></Badge>;
      default:
        return null;
    }
  };

  
const renderCell = (columnLabel, cellValue, row) => {
  switch (columnLabel) {
    case 'תאריך פתיחה': // Opening Date
      return formatDate(row.createdAt);
    case 'שם לקוח': // Customer Name
      return row.customer ? row.customer.name : 'אין';
    case 'כתובת': // Address
      return row.property ? `${row.property.cityName},${row.property.street}, ${row.property.propertyNumber}` : 'אין';
      case `טכנאי`:
        if (row.expert) {
          return row.expert.name;
        } else {
          return (
            <Tooltip title="בחר טבנאי">

            <Fab size="small" color="primary" aria-label="add-expert" onClick={() => handleOpenAssignModal(row)}>
              <PersonAddIcon />
            </Fab>
            </Tooltip>
          );
        }
      default:
      return cellValue;
  }
};

  return (
    <Box sx={{ display: 'flex', bgcolor: theme.palette.background.default }}>
      <Sidebar />
      <Box component="main" sx={{
    flexGrow: 1,
    height: '100%',
    overflow: 'auto',
    p: 3,
    bgcolor: 'background.paper', // Consider a lighter shade that contrasts well with the content
    boxShadow: '0px 3px 6px rgba(0,0,0,0.1)', // A subtle shadow for depth
    borderRadius: '4px', // Optional rounded corners
    border: '1px solid rgba(0,0,0,0.12)', // Optional light border
    '& > *': { // Apply consistent spacing between child elements
      marginBottom: 2,
    },
    // Further style adjustments can be made here
  }}>
      <DataToolbar
        
  title="דוחות"
  menuItems={[
    { label: 'מספר דוח', value: 'index' },
    { label: 'תאריך פתיחה', value: 'createdAt' },
    { label: 'שם לקוח', value: 'customer.name' },
    { label: 'כתובת', value: 'address' },
    { label: 'נושא', value: 'subject' },
    { label: 'טכנאי', value: 'expertName' },
    { label: 'סטטוס', value: 'status' },
  ]}
  btn_txt={'הוסף דוח'}
  onAddNewClick={handleAddNew}
  selectedColumn={queryObject.column}
  includeDateRange={true}
  onSearchChange={handleSearchChange}
  onColumnChange={handleColumnChange}
/>
        <BasicDataTable
        renderActionButtons={renderActionButtons}
        getStatusIcon={getStatusIcon}
        data={filteredReports} // pass the filtered data
        columns={[
            { label: 'מספר דוח', value: 'index' },
            { label: 'תאריך פתיחה', value: (report) => (report.createdAt)},
            { label: 'שם לקוח', value: (report) => report.customer ? report.customer.name : 'Not Available' },
            { label: 'כתובת', value: (report) => report.property ? `${report.property.cityName}, ${report.property.street} ,${report.property.propertyNumber}` : 'Not Available' },
            { label: 'נושא', value: 'subject' },
            {label:'טכנאי',value:(report)=>report.expert?report.expert.name:'Not Available'},
            { label: 'סטטוס', value: 'status' },
          
          ]}
          onEdit={handleEdit}
          renderCell={renderCell}
          title={'דוחות'}
          onAddNewClick={handleAddNew}
        />
        
          <AssignExpertDialog 
            onAssignmentComplete={() => setAssignmentCompleted(true)}

  open={assignModalOpen} 
  onClose={() => {
    setAssignModalOpen(false);
    setAssignmentCompleted(false); // Reset on dialog close
  }}   experts={experts} 
  report={selectedReport} 
  onAssign={handleAssign} 
/>
        
      </Box>
    </Box>
  );
};

export default ReportTablePage;
