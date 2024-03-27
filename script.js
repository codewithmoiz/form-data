let fName = document.querySelector('#first-name'); 
let lName = document.querySelector('#last-name');
let studentAge = document.querySelector('#age');
let studentEmail = document.querySelector('#email');
let studentCountry = document.querySelector('#country');

function populateTable() {
    document.querySelector('#student-table tbody').innerHTML = '';

    for (let i = 1; i <= localStorage.getItem('totalEntries'); i++) {
        let storedStudent = JSON.parse(localStorage.getItem(`studentData${i}`));
        if (storedStudent) {
            let rowId = `row-${i}`;
            document.querySelector('#student-table tbody').innerHTML += `
            <tr id="${rowId}" class="table-row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-500">${storedStudent.firstName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${storedStudent.lastName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${storedStudent.age}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${storedStudent.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${storedStudent.country}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-4">
                        <button class="edit-btn text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button data-row-id="${rowId}" class="delete-btn text-red-600 hover:text-red-900">Delete</button>
                    </div>
                </td>
            </tr>`;
        }
    }

    let editBtn  = document.querySelectorAll(".edit-btn");
    editBtn.forEach(function(btn) {
        btn.addEventListener('click', function() {
            let row = btn.closest('tr');
            let cells = row.querySelectorAll('td');
            
            cells.forEach(function(cell) {
                if (!cell.querySelector('button')) {
                    let cellText = cell.innerText;
                    cell.innerHTML = `<input type="text" class="edit-input" value="${cellText}">`;
                }
            });

            let editInputs = row.querySelectorAll('.edit-input');
            
            editInputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    let newValue = input.value;
                    let columnIndex = input.parentNode.cellIndex;
                    let rowId = row.id.split('-')[1];
                    
                    let storedStudent = JSON.parse(localStorage.getItem(`studentData${rowId}`));
                    
                    switch (columnIndex) {
                        case 0:
                            storedStudent.firstName = newValue;
                            break;
                        case 1:
                            storedStudent.lastName = newValue;
                            break;
                        case 2:
                            storedStudent.age = newValue;
                            break;
                        case 3:
                            storedStudent.email = newValue;
                            break;
                        case 4:
                            storedStudent.country = newValue;
                            break;
                        default:
                            break;
                    }
                    
                    localStorage.setItem(`studentData${rowId}`, JSON.stringify(storedStudent));
                    
                    input.parentNode.innerHTML = `<div class="text-sm text-gray-500">${newValue}</div>`;
                });
                
                input.addEventListener('keyup', function(event) {
                    if (event.key === 'Enter') {
                        document.querySelectorAll('.table-row').forEach(function(r){r.style.color = 'rgb(107 114 128)'});
                        input.blur();
                    }
                });
            });
        });
    });

    let deleteBtn = document.querySelectorAll(".delete-btn");
    deleteBtn.forEach(function(del) {
        del.addEventListener('click', function() {
            let rowId = del.getAttribute('data-row-id');
            
            let index = parseInt(rowId.split('-')[1]);
            localStorage.removeItem(`studentData${index}`);
            
            let row = document.getElementById(rowId);
            row.classList.add('remove');
            row.style.transition = 'all ease-in 0.3s';

            setTimeout(() => {
                row.style.display = 'none';
            }, 700);
        });
    });
}

populateTable();

let btn = document.querySelector('.btn');

btn.addEventListener('click', function () {
    let student = {
        firstName: fName.value,
        lastName: lName.value,
        age: +studentAge.value,
        email: studentEmail.value,
        country: studentCountry.value
    };
    
    let totalEntries = parseInt(localStorage.getItem('totalEntries')) || 0;
    let key = `studentData${totalEntries + 1}`;
    localStorage.setItem(key, JSON.stringify(student));
    localStorage.setItem('totalEntries', totalEntries + 1);

    populateTable();
});