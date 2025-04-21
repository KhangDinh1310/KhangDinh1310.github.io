function calculateAverage(student) {
    return ((student.mathScore + student.englishScore + student.literatureScore) / 3).toFixed(2);
}


function renderStudentList(studentsList) {
    const studentListContainer = document.getElementById('student-list');
    studentListContainer.innerHTML = ''; 

    studentsList.forEach((student, index) => {
        const averageScore = calculateAverage(student);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.mathScore}</td>
            <td>${student.englishScore}</td>
            <td>${student.literatureScore}</td>
            <td>${averageScore}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" style ="background-color: red; color: white; border: none;">Update</button>
                <button class="btn btn-sm btn-danger" style ="background-color: green; color: white; border: none;">Delete</button>
            </td>
        `;
        studentListContainer.appendChild(row);
    });
}


document.getElementById('create-student-btn').addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const mathScore = parseFloat(document.getElementById('mathScore').value);
    const englishScore = parseFloat(document.getElementById('englishScore').value);
    const literatureScore = parseFloat(document.getElementById('literatureScore').value);
    const averageScore = calculateAverage({ mathScore, englishScore, literatureScore });

    if (!name || !gender || isNaN(mathScore) || isNaN(englishScore) || isNaN(literatureScore)) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (mathScore < 0 || mathScore > 10 || englishScore < 0 || englishScore > 10 || literatureScore < 0 || literatureScore > 10) {
        alert("Điểm số nhập vào k hợp lệ! Vui lòng nhập lại!");
        return;
    }
    
    let students = getStudentsFromLocalStorage();
    const newStudent = {
        id: students.length + 1, 
        name,
        gender,
        mathScore,
        englishScore,
        literatureScore,
        averageScore,
    };

    const existingStudent = students.find(student => student.name.toLowerCase() === name.toLowerCase());

    if (existingStudent) {
        alert("Sinh viên này đã tồn tại trong danh sách!");
        return;
    }

    students.push(newStudent);
    alert("Thêm sinh viên thành công!");
    localStorage.setItem('students', JSON.stringify(students));

    renderStudentList(getStudentsFromLocalStorage());

    document.getElementById('name').value = '';
    document.getElementById('mathScore').value = '';
    document.getElementById('englishScore').value = '';
    document.getElementById('literatureScore').value = '';
});


function getStudentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('students')) || [];
}


renderStudentList(getStudentsFromLocalStorage());