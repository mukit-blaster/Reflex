// // Default Section - Show Home on Load
// document.addEventListener('DOMContentLoaded', () => {
//     showSection('home-section');
// });

// // Navigation Logic
// document.getElementById('nav-home').addEventListener('click', () => {
//     showSection('home-section');
// });

// // document.getElementById('nav-appointments').addEventListener('click', () => {
// //     showSection('appointments-section');
// // });

// // document.getElementById('nav-users').addEventListener('click', () => {
// //     showSection('users-section');
// // });
// document.getElementById('nav-appointments').addEventListener('click', () => {
//   showSection('appointments-section');
//   loadAppointments(); // 👈 Fetch fresh data each time you open the tab
// });

// document.getElementById('nav-users').addEventListener('click', () => {
//   showSection('users-section');
//   loadUsers(); // 👈 Fetch user list when you open the tab
// });

// document.getElementById('nav-settings').addEventListener('click', () => {
//     showSection('settings-section');
// });

// // Function to Show Sections
// function showSection(sectionId) {
//     const sections = document.querySelectorAll('.content-section');
//     sections.forEach(section => section.classList.remove('active'));
//     document.getElementById(sectionId).classList.add('active');
// }

// // // Approve/Reject Logic
// // document.querySelectorAll('.approve').forEach(button => {
// //     button.addEventListener('click', (e) => {
// //         const id = e.target.dataset.id;
// //         updateStatus(id, '✔️ Approved', 'approved');
// //     });
// // });

// // document.querySelectorAll('.reject').forEach(button => {
// //     button.addEventListener('click', (e) => {
// //         const id = e.target.dataset.id;
// //         updateStatus(id, '❌ Rejected', 'rejected');
// //     });
// // });

// // function updateStatus(id, statusText, statusClass) {
// //     const row = document.querySelector(`td.status[data-id="${id}"]`);
// //     if (row) {
// //         row.textContent = statusText;
// //         row.className = `status ${statusClass}`;
// //     }
// // }


// // document.addEventListener('DOMContentLoaded', () => {
// //     const API_URL = 'http://localhost:3000';
  
// //     function loadAppointments() {
// //       fetch(`${API_URL}/appointments`)
// //         .then(res => res.json())
// //         .then(data => {
// //           const tbody = document.getElementById('appointments-body');
// //           tbody.innerHTML = '';
  
// //           data.forEach((appointment, index) => {
// //             const row = document.createElement('tr');
// //             row.innerHTML = `
// //               <td>${index + 1}</td>
// //               <td>${appointment.name}</td>
// //               <td>${appointment.email}</td>
// //               <td>${appointment.phone}</td>
// //               <td>${appointment.date}</td>
// //               <td>${appointment.time}</td>
// //               <td class="status">${appointment.status}</td>
// //               <td>
// //                 <button class="status-btn approve" data-id="${appointment._id}">Approve</button>
// //                 <button class="status-btn reject" data-id="${appointment._id}">Reject</button>
// //                 <button class="status-btn edit" data-id="${appointment._id}">Edit</button>
// //               </td>
// //             `;
// //             tbody.appendChild(row);
// //           });
  
// //           // Add button functionality
// //           document.querySelectorAll('.approve').forEach(button => {
// //             button.addEventListener('click', () => updateStatus(button.dataset.id, 'Approved'));
// //           });
  
// //           document.querySelectorAll('.reject').forEach(button => {
// //             button.addEventListener('click', () => updateStatus(button.dataset.id, 'Rejected'));
// //           });
// //         });
// //     }
  
// //     function updateStatus(id, status) {
// //       fetch(`${API_URL}/appointments/${id}/status`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ status })
// //       })
// //         .then(res => res.json())
// //         .then(() => loadAppointments())
// //         .catch(err => console.error('Failed to update status:', err));
// //     }
  
// //     loadAppointments();
// //   });









// function loadAppointments() {
//   fetch('http://localhost:3000/appointments')

//       .then(res => res.json())
//       .then(data => {
//         const tbody = document.querySelector('#appointments-section tbody');
//         tbody.innerHTML = '';
//         data.forEach((appointment, index) => {
//           const row = document.createElement('tr');
//           row.innerHTML = `
//             <td>${index + 1}</td>
//             <td>${appointment.name}</td>
//             <td>${appointment.email}</td>
//             <td>${appointment.phone}</td>
//             <td>${appointment.date}</td>
//             <td>${appointment.time}</td>
//             <td class="status">${appointment.status || 'Pending'}</td>
//             <td>
//               <button class="status-btn approve" data-id="${appointment._id}">Approve</button>
//               <button class="status-btn reject" data-id="${appointment._id}">Reject</button>
//               <button class="status-btn edit" data-id="${appointment._id}">Edit</button>
//             </td>
//           `;
//           tbody.appendChild(row);
//         });
  
//         attachEditListeners(); // 👈 Make sure this is called after rendering
//         attachStatusListeners(); // 👈 Add this line!
//       });
//   }
  
//   function attachEditListeners() {
//     document.querySelectorAll('.edit').forEach(button => {
//       button.addEventListener('click', () => {
//         const id = button.dataset.id;
//         const row = button.closest('tr');
  
//         const name = prompt('Edit Name:', row.children[1].textContent);
//         const email = prompt('Edit Email:', row.children[2].textContent);
//         const phone = prompt('Edit Phone:', row.children[3].textContent);
//         const date = prompt('Edit Date (YYYY-MM-DD):', row.children[4].textContent);
//         const time = prompt('Edit Time:', row.children[5].textContent);
  
//         if (name && email && phone && date && time) {
//           fetch(`/appointments/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, phone, date, time })
//           })
//           .then(res => res.json())
//           .then(() => loadAppointments())
//           .catch(err => console.error('Failed to update:', err));
//         }
//       });
//     });
//   }















//   function attachStatusListeners() {
//     document.querySelectorAll('.approve').forEach(button => {
//       button.addEventListener('click', () => {
//         const id = button.dataset.id;
//         updateStatus(id, 'Approved');
//       });
//     });
  
//     document.querySelectorAll('.reject').forEach(button => {
//       button.addEventListener('click', () => {
//         const id = button.dataset.id;
//         updateStatus(id, 'Rejected');
//       });
//     });
//   }
  
//   function updateStatus(id, status) {
//     fetch(`/appointments/${id}/status`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status })
//     })
//     .then(res => res.json())
//     .then(() => loadAppointments())
//     .catch(err => console.error('Status update error:', err));
//   }

    
  
//   loadAppointments(); // 👈 Call this once on page load
  













//   async function loadUsers() {
//     try {
//       const response = await fetch('http://localhost:3000/users');
//       const users = await response.json();

//       const tableBody = document.getElementById('users-table-body');
//       tableBody.innerHTML = ''; // Clear table first

//       users.forEach((user, index) => {
//         const tr = document.createElement('tr');

//         tr.innerHTML = `
//           <td>${index + 1}</td>
//           <td>${user.name}</td>
//           <td>${user.email}</td>
//           <td>${new Date(user.createdAt).toISOString().split('T')[0]}</td>
//         `;

//         tableBody.appendChild(tr);
//       });
//     } catch (error) {
//       console.error('Error loading users:', error);
//     }
//   }

//   // Load users when page is ready
//   window.addEventListener('DOMContentLoaded', loadUsers);
































document.addEventListener('DOMContentLoaded', () => {
  showSection('home-section');
  loadAppointments(); // Optional: preload
  loadUsers(); // Optional: preload
});

document.getElementById('nav-home').addEventListener('click', () => {
  showSection('home-section');
});

document.getElementById('nav-appointments').addEventListener('click', () => {
  showSection('appointments-section');
  loadAppointments();
});

document.getElementById('nav-users').addEventListener('click', () => {
  showSection('users-section');
  loadUsers();
});

document.getElementById('nav-settings').addEventListener('click', () => {
  showSection('settings-section');
});

function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

function loadAppointments() {
  fetch('http://localhost:3000/appointments')
      .then(res => res.json())
      .then(data => {
          const tbody = document.getElementById('appointments-body');
          tbody.innerHTML = '';
          data.forEach((appointment, index) => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${appointment.name}</td>
                  <td>${appointment.email}</td>
                  <td>${appointment.phone}</td>
                  <td>${appointment.date}</td>
                  <td>${appointment.time}</td>
                  <td class="status">${appointment.status || 'Pending'}</td>
                  <td>
                      <button class="status-btn approve" data-id="${appointment._id}">Approve</button>
                      <button class="status-btn reject" data-id="${appointment._id}">Reject</button>
                      <button class="status-btn edit" data-id="${appointment._id}">Edit</button>
                  </td>
              `;
              tbody.appendChild(row);
          });

          attachEditListeners();
          attachStatusListeners();
      });
}

function attachEditListeners() {
  document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', () => {
          const id = button.dataset.id;
          const row = button.closest('tr');
          const name = prompt('Edit Name:', row.children[1].textContent);
          const email = prompt('Edit Email:', row.children[2].textContent);
          const phone = prompt('Edit Phone:', row.children[3].textContent);
          const date = prompt('Edit Date (YYYY-MM-DD):', row.children[4].textContent);
          const time = prompt('Edit Time:', row.children[5].textContent);

          if (name && email && phone && date && time) {
              fetch(`http://localhost:3000/appointments/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, phone, date, time })
              })
              .then(res => res.json())
              .then(() => loadAppointments());
          }
      });
  });
}

function attachStatusListeners() {
  document.querySelectorAll('.approve').forEach(button => {
      button.addEventListener('click', () => {
          updateStatus(button.dataset.id, 'Approved');
      });
  });

  document.querySelectorAll('.reject').forEach(button => {
      button.addEventListener('click', () => {
          updateStatus(button.dataset.id, 'Rejected');
      });
  });
}

function updateStatus(id, status) {
  fetch(`http://localhost:3000/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
  })
  .then(res => res.json())
  .then(() => loadAppointments());
}


