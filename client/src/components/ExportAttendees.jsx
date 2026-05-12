import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getAttendees } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ExportAttendees({ eventId, eventTitle, organizerId }) {
  const { user } = useAuth();

  const handleExport = async () => {
    try {
      const res = await getAttendees(eventId);
      const attendees = res.data;

      if (attendees.length === 0) {
        return toast.error('No attendees to export');
      }

      const data = attendees.map((a, index) => ({
        'No.': index + 1,
        'Name': a.name,
        'Email': a.email,
        'Status': a.status,
        'RSVP Date': new Date(a.created_at).toLocaleDateString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      worksheet['!cols'] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 35 },
        { wch: 12 },
        { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, `${eventTitle}_attendees.xlsx`);
      toast.success(`Downloaded ${attendees.length} attendees!`);
    } catch (err) {
      toast.error('Failed to export attendees');
    }
  };

  if (!user || user.id !== organizerId) return null;

  return (
    <button style={styles.btn} onClick={handleExport}>
      📋 Export Attendees (Excel)
    </button>
  );
}

const styles = {
  btn: {
    padding: '0.6rem 1.2rem',
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  }
};