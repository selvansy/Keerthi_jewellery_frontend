// export const formatDate = (dateString) => {
//     if (!dateString) return '-';
    
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '-';
    
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
    
//     return `${day}-${month}-${year}`;
//   };

export function formatDate(dateInput) {
  if (!dateInput || dateInput === 'null' || dateInput === 'undefined' || dateInput === '') {
    return '-';
  }

  if (typeof dateInput === 'object' && !(dateInput instanceof Date)) {
    return '-';
  }

  try {
    let date;

    if (dateInput instanceof Date) {
      date = dateInput;
    }
    else if (typeof dateInput === 'string' && dateInput.includes('T')) {
      date = new Date(dateInput);
    }
    else if (typeof dateInput === 'string' && dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length === 3) {
        const dayFirst = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const monthFirst = `${parts[1]}-${parts[0]}-${parts[2]}`;
        
        const date1 = new Date(dayFirst.split('-').reverse().join('-'));
        const date2 = new Date(monthFirst.split('-').reverse().join('-'));
        
        if (!isNaN(date1.getTime())) {
          date = date1;
        } else if (!isNaN(date2.getTime())) {
          date = date2;
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    }
    else if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const parts = dateInput.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
         
          return dateInput;
        }
        
        date = new Date(dateInput);
      } else {
        return '-';
      }
    }
    
    else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    }

    else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    }
  
    else {
      date = new Date(dateInput);
    }

   
    if (isNaN(date.getTime())) {
      return '-';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', dateInput, error);
    return '-';
  }
}